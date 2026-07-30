import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const ProgramJobTitle = sequelize.define(
    "ProgramJobTitle",
    {

        program_job_title_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },

        program_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },

        job_title_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        }

    },
    {
        tableName:"ProgramJobTitles",
        timestamps:true
    }
);


export default ProgramJobTitle;