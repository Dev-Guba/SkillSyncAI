import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const EmailVerification = sequelize.define("EmailVerification", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // The address being verified (a pending new email, or the current one)
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    code_hash: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    is_used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    // When the code was entered correctly (null = not verified with this code)
    verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: "Email_Verifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

export default EmailVerification;
