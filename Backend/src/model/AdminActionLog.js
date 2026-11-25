import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// Record of admin actions on accounts (role changes, deactivation, deletion...)
const AdminActionLog = sequelize.define("AdminActionLog", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    admin_user_id: DataTypes.INTEGER,
    admin_username: DataTypes.STRING(50),
    target_user_id: DataTypes.INTEGER,
    target_username: DataTypes.STRING(50),
    action: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    // JSON text, e.g. {"from":"Student","to":"Admin"}
    details: DataTypes.TEXT,
}, {
    tableName: "Admin_Action_Logs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
});

export default AdminActionLog;
