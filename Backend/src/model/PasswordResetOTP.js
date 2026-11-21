import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PasswordResetOTP = sequelize.define("PasswordResetOTP", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    otp_hash: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    reset_token_hash: {
        type: DataTypes.STRING(64),
        allowNull: true
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    is_used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "Password_Reset_OTPs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

export default PasswordResetOTP;