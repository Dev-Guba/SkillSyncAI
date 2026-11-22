
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

dotenv.config();

// ==========================================
// DATABASE CONFIGURATIONS
// ==========================================

const localConfig = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: process.env.LOCAL_DB_PASSWORD || "",
  database: "skillsyncaiv2",
};

const cloudConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 4000,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
};

const BATCH_SIZE = 100;

// Parent tables must be imported before dependent tables.
const TABLE_ORDER = [
  "role",
  "interests",
  "job_title",
  "programs",
  "skill_set",
  "users",
  "jobs",
  "job_title_skills",
  "program_skills",
  "programjobtitles",
  "user_profile",
  "user_skills",
  "userjobtitle",
  "userinterest",
  "jobskills",
  "password_reset_otps",
];

// Migration history must not be copied.
const EXCLUDED_TABLES = [
  "sequelizemeta",
];

// ==========================================
// HELPERS
// ==========================================

const normalize = (value) => value.toLowerCase();

function quoteIdentifier(value) {
  return `\`${value.replace(/`/g, "``")}\``;
}

// ==========================================
// GET TABLE INFORMATION
// ==========================================

async function getTables(connection) {
  const [tables] = await connection.execute(
    `SELECT TABLE_NAME
     FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = ?
       AND TABLE_TYPE = 'BASE TABLE'`,
    [connection.config.database]
  );

  const result = new Map();

  for (const table of tables) {
    result.set(normalize(table.TABLE_NAME), table.TABLE_NAME);
  }

  return result;
}

async function getColumns(connection, tableName) {
  const [columns] = await connection.execute(
    `SELECT COLUMN_NAME
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ?
       AND TABLE_NAME = ?
     ORDER BY ORDINAL_POSITION`,
    [connection.config.database, tableName]
  );

  return columns.map((column) => column.COLUMN_NAME);
}

async function getCount(connection, tableName) {
  const [rows] = await connection.query(
    `SELECT COUNT(*) AS total
     FROM ${quoteIdentifier(tableName)}`
  );

  return Number(rows[0].total);
}

// ==========================================
// VALIDATE BEFORE IMPORT
// ==========================================

async function validateDatabases(local, cloud) {
  console.log("\n========== PRE-IMPORT VALIDATION ==========");

  const localTables = await getTables(local);
  const cloudTables = await getTables(cloud);

  const tableMappings = [];

  for (const sourceName of TABLE_ORDER) {
    const normalized = normalize(sourceName);

    const sourceTable = localTables.get(normalized);
    const targetTable = cloudTables.get(normalized);

    if (!sourceTable) {
      throw new Error(
        `Local table not found: ${sourceName}`
      );
    }

    if (!targetTable) {
      throw new Error(
        `TiDB table not found: ${sourceName}`
      );
    }

    const sourceColumns = await getColumns(
      local,
      sourceTable
    );

    const targetColumns = await getColumns(
      cloud,
      targetTable
    );

    const targetColumnMap = new Map(
      targetColumns.map((column) => [
        normalize(column),
        column,
      ])
    );

    if (sourceColumns.length !== targetColumns.length) {
      throw new Error(
        `Column count mismatch: ${sourceName}`
      );
    }

    const mappedColumns = sourceColumns.map((column) => {
      const targetColumn = targetColumnMap.get(
        normalize(column)
      );

      if (!targetColumn) {
        throw new Error(
          `Column mismatch: ${sourceName}.${column}`
        );
      }

      return targetColumn;
    });

    const sourceCount = await getCount(
      local,
      sourceTable
    );

    const targetCount = await getCount(
      cloud,
      targetTable
    );

    // Prevent accidental duplicate imports.
    if (targetCount !== 0) {
      throw new Error(
        `TiDB table ${targetTable} already contains ` +
        `${targetCount} records. Import cancelled.`
      );
    }

    console.log(
      `${sourceTable} -> ${targetTable} | ` +
      `Local: ${sourceCount} | TiDB: ${targetCount} | READY`
    );

    tableMappings.push({
      sourceTable,
      targetTable,
      sourceColumns,
      targetColumns: mappedColumns,
      sourceCount,
    });
  }

  console.log("\nAll tables passed validation.");

  return tableMappings;
}

// ==========================================
// IMPORT ONE TABLE IN BATCHES
// ==========================================

async function importTable(local, cloud, table) {
  const {
    sourceTable,
    targetTable,
    sourceColumns,
    targetColumns,
    sourceCount,
  } = table;

  if (sourceCount === 0) {
    console.log(`\n${sourceTable}: No records. Skipped.`);
    return;
  }

  console.log(`\nImporting ${sourceTable}...`);

  const sourceColumnSQL = sourceColumns
    .map(quoteIdentifier)
    .join(", ");

  const targetColumnSQL = targetColumns
    .map(quoteIdentifier)
    .join(", ");

  let imported = 0;

  for (let offset = 0; offset < sourceCount; offset += BATCH_SIZE) {
    const [rows] = await local.query(
      `SELECT ${sourceColumnSQL}
       FROM ${quoteIdentifier(sourceTable)}
       LIMIT ? OFFSET ?`,
      [BATCH_SIZE, offset]
    );

    if (rows.length === 0) break;

    const values = rows.map((row) =>
      sourceColumns.map((column) => row[column])
    );

    await cloud.query(
      `INSERT INTO ${quoteIdentifier(targetTable)}
       (${targetColumnSQL})
       VALUES ?`,
      [values]
    );

    imported += rows.length;

    console.log(
      `  Progress: ${imported}/${sourceCount}`
    );
  }

  console.log(
    `${sourceTable}: ${imported} records imported.`
  );
}

// ==========================================
// VERIFY IMPORT
// ==========================================

async function verifyImport(local, cloud, tables) {
  console.log("\n========== IMPORT VERIFICATION ==========");

  let successful = true;

  for (const table of tables) {
    const localCount = await getCount(
      local,
      table.sourceTable
    );

    const cloudCount = await getCount(
      cloud,
      table.targetTable
    );

    const passed = localCount === cloudCount;

    console.log(
      `${table.sourceTable}: Local=${localCount}, ` +
      `TiDB=${cloudCount} | ${passed ? "MATCH" : "MISMATCH"}`
    );

    if (!passed) successful = false;
  }

  if (!successful) {
    throw new Error("Record count verification failed.");
  }

  console.log("\nAll imported table counts match!");
}

// ==========================================
// MAIN
// ==========================================

async function main() {
  let local;
  let cloud;
  let transactionStarted = false;

  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  });

  try {
    console.log("Connecting to databases...");

    local = await mysql.createConnection(localConfig);
    console.log("Connected to local MySQL!");

    cloud = await mysql.createConnection(cloudConfig);
    console.log("Connected to TiDB Cloud!");

    // Validate every table before writing anything.
    const tables = await validateDatabases(
      local,
      cloud
    );

    console.log("\n======================================");
    console.log("READY TO IMPORT DATA");
    console.log("======================================");
    console.log("Batch size:", BATCH_SIZE);
    console.log("Tables:", tables.length);
    console.log("Migration history: EXCLUDED");
    console.log("Existing TiDB records: NONE");
    console.log("======================================");

    const answer = await rl.question(
      '\nType IMPORT to begin: '
    );

    if (answer.trim() !== "IMPORT") {
      console.log("\nImport cancelled. No records changed.");
      return;
    }

    // Start one transaction for the entire transfer.
    await cloud.beginTransaction();
    transactionStarted = true;

    for (const table of tables) {
      await importTable(local, cloud, table);
    }

    // Verify counts before committing.
    await verifyImport(local, cloud, tables);

    await cloud.commit();
    transactionStarted = false;

    console.log("\n======================================");
    console.log("DATABASE IMPORT SUCCESSFUL!");
    console.log("======================================");

  } catch (error) {
    console.error("\nIMPORT FAILED:");
    console.error(error.message);

    if (cloud && transactionStarted) {
      try {
        await cloud.rollback();
        console.log("\nTiDB transaction rolled back.");
      } catch (rollbackError) {
        console.error(
          "Rollback failed:",
          rollbackError.message
        );
      }
    }

  } finally {
    rl.close();

    if (local) await local.end();
    if (cloud) await cloud.end();

    console.log("\nDatabase connections closed.");
  }
}

main();
