'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('Program_Skills', [

      // BSIT
      {
        program_id: 1,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 2, // Java
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 3, // C
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 4, // C++
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 5, // JavaScript
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 6, // TypeScript
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 7, // PHP
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 8, // HTML
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 9, // CSS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 10, // React
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 11, // NodeJS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 12, // Express
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 13, // Laravel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 14, // MySQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 15, // PostgreSQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 16, // MongoDB
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 17, // SQLite
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 18, // Git
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 19, // Docker
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 20, // Linux
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 21, // Windows
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 22, // AWS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 23, // Azure
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 24, // Firebase
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 25, // Prisma
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 26, // Tailwind
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 27, // Bootstrap
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 28, // Figma
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 29, // REST
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        skill_set_id: 30, // GitHub
        createdAt: now,
        updatedAt: now,
      },

      // BSCS
      {
        program_id: 2,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 3, // C
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 4, // C++
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 2, // Java
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 31, // Rust
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 32, // Go
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 33, // Kotlin
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 34, // Swift
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 35, // TensorFlow
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 36, // PyTorch
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 37, // NumPy
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 38, // Pandas
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 39, // OpenCV
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 40, // MATLAB
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 41, // R
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 20, // Linux
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 18, // Git
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 19, // Docker
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 42, // Kubernetes
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 43, // Redis
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 15, // PostgreSQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 16, // MongoDB
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 44, // GraphQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 45, // Bash
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 46, // CUDA
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 47, // LLVM
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 48, // Jenkins
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 49, // Anaconda
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 50, // Flask
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        skill_set_id: 51, // Django
        createdAt: now,
        updatedAt: now,
      },

      // BSIS
      {
        program_id: 3,
        skill_set_id: 52, // SAP
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 53, // Oracle
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 54, // Salesforce
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 55, // PowerBI
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 56, // Tableau
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 57, // Excel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 58, // SQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 14, // MySQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 15, // PostgreSQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 59, // Access
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 60, // SharePoint
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 61, // Dynamics365
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 62, // Jira
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 63, // Confluence
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 64, // Visio
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 23, // Azure
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 22, // AWS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 5, // JavaScript
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 7, // PHP
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 13, // Laravel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 10, // React
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 11, // NodeJS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 16, // MongoDB
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 19, // Docker
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 18, // Git
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 28, // Figma
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 65, // Notion
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 66, // PowerApps
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        skill_set_id: 67, // Teams
        createdAt: now,
        updatedAt: now,
      },

      // BSCpE
      {
        program_id: 4,
        skill_set_id: 3, // C
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 4, // C++
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 68, // Arduino
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 69, // RaspberryPi
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 70, // ESP32
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 71, // STM32
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 72, // Verilog
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 73, // VHDL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 40, // MATLAB
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 74, // Proteus
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 75, // Multisim
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 76, // KiCad
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 77, // Altium
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 78, // SolidWorks
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 79, // AutoCAD
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 80, // FPGA
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 81, // Quartus
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 82, // Vivado
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 83, // MPLAB
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 84, // Keil
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 85, // FreeRTOS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 86, // LabVIEW
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 20, // Linux
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 18, // Git
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 19, // Docker
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 46, // CUDA
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 45, // Bash
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 39, // OpenCV
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        skill_set_id: 35, // TensorFlow
        createdAt: now,
        updatedAt: now,
      },

      // BSSE
      {
        program_id: 5,
        skill_set_id: 2, // Java
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 87, // C#
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 5, // JavaScript
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 6, // TypeScript
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 10, // React
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 88, // Vue
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 89, // Angular
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 11, // NodeJS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 12, // Express
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 90, // Spring
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 91, // .NET
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 51, // Django
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 50, // Flask
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 13, // Laravel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 15, // PostgreSQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 16, // MongoDB
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 14, // MySQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 43, // Redis
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 19, // Docker
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 42, // Kubernetes
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 18, // Git
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 48, // Jenkins
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 92, // Terraform
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 44, // GraphQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 29, // REST
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 25, // Prisma
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 26, // Tailwind
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 27, // Bootstrap
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        skill_set_id: 23, // Azure
        createdAt: now,
        updatedAt: now,
      },

      // BSDS
      {
        program_id: 6,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 41, // R
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 58, // SQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 38, // Pandas
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 37, // NumPy
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 93, // SciPy
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 35, // TensorFlow
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 36, // PyTorch
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 94, // Scikit-learn
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 95, // Spark
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 96, // Hadoop
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 56, // Tableau
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 55, // PowerBI
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 97, // Jupyter
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 49, // Anaconda
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 40, // MATLAB
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 15, // PostgreSQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 16, // MongoDB
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 57, // Excel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 39, // OpenCV
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 98, // Seaborn
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 99, // Matplotlib
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 100, // Keras
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 101, // Airflow
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 102, // Snowflake
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 103, // Databricks
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 22, // AWS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 23, // Azure
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 18, // Git
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        skill_set_id: 19, // Docker
        createdAt: now,
        updatedAt: now,
      },

      // BSCyber
      {
        program_id: 7,
        skill_set_id: 104, // Kali
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 20, // Linux
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 21, // Windows
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 105, // Wireshark
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 106, // Metasploit
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 107, // BurpSuite
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 108, // Nmap
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 109, // Nessus
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 110, // Snort
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 111, // Suricata
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 112, // Splunk
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 113, // ELK
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 45, // Bash
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 114, // PowerShell
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 58, // SQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 19, // Docker
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 42, // Kubernetes
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 115, // Cisco
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 116, // Ghidra
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 117, // YARA
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 118, // Hashcat
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 119, // Hydra
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 120, // OpenVAS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 121, // VMware
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 122, // VirtualBox
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 22, // AWS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 23, // Azure
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 18, // Git
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        skill_set_id: 123, // JohnTheRipper
        createdAt: now,
        updatedAt: now,
      },

      // BMMA
      {
        program_id: 8,
        skill_set_id: 124, // Photoshop
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 125, // Illustrator
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 126, // InDesign
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 127, // Premiere
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 128, // AfterEffects
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 129, // Blender
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 130, // Maya
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 131, // Cinema4D
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 28, // Figma
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 132, // Canva
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 133, // Lightroom
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 134, // Audition
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 135, // Animate
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 136, // XD
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 137, // Sketch
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 138, // Procreate
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 139, // CorelDRAW
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 140, // DaVinciResolve
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 141, // Unreal
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 142, // Unity
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 143, // ZBrush
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 144, // Rhino
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 145, // SubstancePainter
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 79, // AutoCAD
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 8, // HTML
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 9, // CSS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 5, // JavaScript
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 146, // SVG
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 147, // OBS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        skill_set_id: 148, // CapCut
        createdAt: now,
        updatedAt: now,
      },

      // BSBA
      {
        program_id: 9,
        skill_set_id: 57, // Excel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 52, // SAP
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 53, // Oracle
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 149, // QuickBooks
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 150, // Xero
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 54, // Salesforce
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 151, // HubSpot
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 56, // Tableau
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 55, // PowerBI
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 152, // SPSS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 58, // SQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 153, // Word
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 154, // PowerPoint
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 59, // Access
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 61, // Dynamics365
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 155, // Zoho
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 156, // Slack
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 157, // Trello
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 158, // Asana
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 62, // Jira
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 65, // Notion
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 132, // Canva
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 159, // Mailchimp
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 160, // GoogleAnalytics
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 161, // MetaAds
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 162, // Shopify
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 163, // Stripe
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 67, // Teams
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        skill_set_id: 164, // Zoom
        createdAt: now,
        updatedAt: now,
      },

      // BSA
      {
        program_id: 10,
        skill_set_id: 149, // QuickBooks
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 150, // Xero
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 52, // SAP
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 53, // Oracle
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 57, // Excel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 59, // Access
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 58, // SQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 55, // PowerBI
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 56, // Tableau
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 165, // MYOB
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 166, // Sage
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 152, // SPSS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 153, // Word
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 154, // PowerPoint
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 167, // Tally
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 168, // FreshBooks
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 169, // Wave
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 170, // ZohoBooks
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 61, // Dynamics365
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 171, // VBA
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 172, // GoogleSheets
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 173, // Alteryx
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 174, // ACL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 175, // IDEA
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 176, // Bloomberg
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 177, // OneDrive
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 60, // SharePoint
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 178, // TaxCalc
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        skill_set_id: 179, // CaseWare
        createdAt: now,
        updatedAt: now,
      },

      // BSHM
      {
        program_id: 11,
        skill_set_id: 180, // Fidelio
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 181, // Opera
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 182, // Micros
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 183, // POS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 149, // QuickBooks
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 57, // Excel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 132, // Canva
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 154, // PowerPoint
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 153, // Word
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 52, // SAP
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 53, // Oracle
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 184, // Toast
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 185, // Lightspeed
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 186, // MenuDrive
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 187, // ResDiary
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 188, // SevenRooms
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 189, // OpenTable
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 190, // GoogleWorkspace
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 67, // Teams
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 164, // Zoom
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 191, // Facebook
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 192, // Instagram
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 193, // TikTok
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 159, // Mailchimp
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 194, // Hootsuite
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 195, // Eventbrite
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 196, // Square
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 162, // Shopify
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 157, // Trello
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        skill_set_id: 158, // Asana
        createdAt: now,
        updatedAt: now,
      },

      // BSTM
      {
        program_id: 12,
        skill_set_id: 197, // Amadeus
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 198, // Sabre
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 199, // Galileo
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 181, // Opera
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 180, // Fidelio
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 57, // Excel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 153, // Word
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 154, // PowerPoint
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 132, // Canva
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 200, // GoogleMaps
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 201, // ArcGIS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 202, // CRM
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 54, // Salesforce
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 203, // Travelport
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 204, // Booking
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 205, // Expedia
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 206, // Skyscanner
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 164, // Zoom
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 67, // Teams
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 191, // Facebook
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 192, // Instagram
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 193, // TikTok
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 159, // Mailchimp
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 194, // Hootsuite
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 157, // Trello
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 158, // Asana
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 65, // Notion
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 190, // GoogleWorkspace
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 195, // Eventbrite
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        skill_set_id: 163, // Stripe
        createdAt: now,
        updatedAt: now,
      },

      // BSCRIM
      {
        program_id: 13,
        skill_set_id: 207, // AFIS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 208, // NCIC
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 209, // CODIS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 210, // GIS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 201, // ArcGIS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 211, // Cellebrite
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 212, // EnCase
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 213, // FTK
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 214, // Autopsy
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 215, // MagnetAXIOM
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 58, // SQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 57, // Excel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 153, // Word
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 154, // PowerPoint
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 152, // SPSS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 56, // Tableau
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 55, // PowerBI
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 20, // Linux
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 21, // Windows
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 105, // Wireshark
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 106, // Metasploit
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 108, // Nmap
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 104, // Kali
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 39, // OpenCV
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 216, // Fingerprint
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 217, // Ballistics
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 218, // Biometrics
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 219, // CCTV
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        skill_set_id: 220, // GPS
        createdAt: now,
        updatedAt: now,
      },

      // BSN
      {
        program_id: 14,
        skill_set_id: 221, // Epic
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 222, // Cerner
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 223, // Meditech
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 224, // Allscripts
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 225, // eClinicalWorks
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 57, // Excel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 153, // Word
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 154, // PowerPoint
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 152, // SPSS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 226, // Minitab
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 227, // Telehealth
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 228, // DICOM
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 229, // PACS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 230, // EMR
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 231, // EHR
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 232, // ICD10
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 233, // HL7
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 234, // ECG
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 235, // PulseOximeter
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 236, // Ultrasound
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 237, // InfusionPump
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 238, // Ventilator
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 239, // Defibrillator
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 132, // Canva
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 164, // Zoom
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 67, // Teams
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 190, // GoogleWorkspace
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 240, // REDCap
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 56, // Tableau
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },

      // BSP
      {
        program_id: 15,
        skill_set_id: 241, // RxNorm
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 242, // Micromedex
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 243, // Lexicomp
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 244, // Medscape
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 57, // Excel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 153, // Word
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 154, // PowerPoint
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 152, // SPSS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 58, // SQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 52, // SAP
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 53, // Oracle
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 56, // Tableau
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 55, // PowerBI
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 230, // EMR
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 231, // EHR
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 232, // ICD10
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 233, // HL7
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 245, // Barcode
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 246, // Inventory
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 247, // Pharmacovigilance
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 240, // REDCap
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 226, // Minitab
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 190, // GoogleWorkspace
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 164, // Zoom
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 67, // Teams
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 132, // Canva
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 248, // LabWare
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 249, // LIMS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 15,
        skill_set_id: 250, // ChemDraw
        createdAt: now,
        updatedAt: now,
      },

      // BSMT
      {
        program_id: 16,
        skill_set_id: 249, // LIMS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 223, // Meditech
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 222, // Cerner
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 221, // Epic
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 57, // Excel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 152, // SPSS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 226, // Minitab
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 58, // SQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 56, // Tableau
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 55, // PowerBI
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 228, // DICOM
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 229, // PACS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 233, // HL7
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 232, // ICD10
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 240, // REDCap
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 250, // ChemDraw
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 248, // LabWare
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 40, // MATLAB
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 41, // R
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 251, // GraphPad
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 252, // ELISA
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 253, // PCR
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 254, // Microscopy
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 255, // FlowJo
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 256, // BioRender
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 190, // GoogleWorkspace
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 164, // Zoom
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 67, // Teams
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        skill_set_id: 153, // Word
        createdAt: now,
        updatedAt: now,
      },

      // BSCE
      {
        program_id: 17,
        skill_set_id: 79, // AutoCAD
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 257, // Civil3D
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 258, // Revit
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 259, // STAAD
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 260, // ETABS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 261, // SAP2000
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 262, // SketchUp
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 201, // ArcGIS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 40, // MATLAB
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 57, // Excel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 263, // Primavera
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 264, // MSProject
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 265, // Bluebeam
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 266, // MicroStation
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 267, // Navisworks
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 268, // Tekla
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 269, // SAFE
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 270, // PLAXIS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 271, // ANSYS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 272, // Dynamo
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 144, // Rhino
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 273, // Lumion
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 274, // InfraWorks
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 275, // QGIS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 153, // Word
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 154, // PowerPoint
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 58, // SQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 18, // Git
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        skill_set_id: 276, // BIM
        createdAt: now,
        updatedAt: now,
      },

      // BSME
      {
        program_id: 18,
        skill_set_id: 78, // SolidWorks
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 79, // AutoCAD
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 277, // CATIA
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 278, // Fusion360
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 279, // Inventor
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 271, // ANSYS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 40, // MATLAB
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 86, // LabVIEW
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 4, // C++
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 57, // Excel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 280, // Simulink
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 281, // Creo
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 282, // Abaqus
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 283, // COMSOL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 284, // Mastercam
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 285, // CNC
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 286, // GCode
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 68, // Arduino
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 69, // RaspberryPi
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 287, // PLC
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 288, // SiemensNX
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 289, // Autodesk
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 258, // Revit
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 261, // SAP2000
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 18, // Git
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 19, // Docker
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 20, // Linux
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 55, // PowerBI
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 18,
        skill_set_id: 56, // Tableau
        createdAt: now,
        updatedAt: now,
      },

      // BSEE
      {
        program_id: 19,
        skill_set_id: 40, // MATLAB
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 280, // Simulink
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 79, // AutoCAD
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 290, // ETAP
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 291, // PSCAD
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 86, // LabVIEW
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 287, // PLC
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 68, // Arduino
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 69, // RaspberryPi
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 74, // Proteus
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 75, // Multisim
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 76, // KiCad
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 77, // Altium
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 3, // C
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 4, // C++
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 72, // Verilog
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 80, // FPGA
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 81, // Quartus
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 82, // Vivado
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 57, // Excel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 292, // SCADA
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 293, // DIALux
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 258, // Revit
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 18, // Git
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 20, // Linux
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 19, // Docker
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 45, // Bash
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 58, // SQL
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        skill_set_id: 22, // AWS
        createdAt: now,
        updatedAt: now,
      },

      // BSED
      {
        program_id: 20,
        skill_set_id: 294, // GoogleClassroom
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 295, // Moodle
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 296, // Canvas
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 297, // Blackboard
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 298, // MicrosoftTeams
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 164, // Zoom
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 299, // GoogleMeet
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 154, // PowerPoint
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 153, // Word
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 57, // Excel
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 132, // Canva
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 300, // Kahoot
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 301, // Quizizz
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 302, // Nearpod
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 303, // Edmodo
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 304, // Padlet
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 305, // Scratch
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 1, // Python
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 8, // HTML
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 9, // CSS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 5, // JavaScript
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 152, // SPSS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 190, // GoogleWorkspace
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 147, // OBS
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 148, // CapCut
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 65, // Notion
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 157, // Trello
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 158, // Asana
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 28, // Figma
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        skill_set_id: 306, // Audacity
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Program_Skills', null, {});
  },
};