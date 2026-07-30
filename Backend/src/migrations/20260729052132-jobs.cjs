'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('Jobs', {

      job_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      external_job_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      title: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      company: {
        type: Sequelize.STRING(150),
        allowNull: true
      },

      location: {
        type: Sequelize.STRING(150),
        allowNull: true
      },

      classification: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      subclassification: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      salary: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      employment_type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      source: {
        type: Sequelize.STRING(50),
        allowNull: false
      },

      posted_date: {
        type: Sequelize.DATE,
        allowNull: true
      },

      url: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }

    });

  },


  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('Jobs');

  }
};