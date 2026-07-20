'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Interests', {
      interest_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    interest_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Interests')
  }
};
