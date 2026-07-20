'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Job_title', {
      job_title_id : {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      job_title_name: {
        type: Sequelize.STRING(50),
        unique: true,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Job_title');
  }
};
