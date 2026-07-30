'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("ProgramJobTitles", {

      program_job_title_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      program_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Programs",
          key: "program_id",
        },
        onDelete: "CASCADE",
      },

      job_title_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Job_Title",
          key: "job_title_id",
        },
        onDelete: "CASCADE",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull:false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull:false,
      }

    });

  },


  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable("ProgramJobTitles");

  }
};