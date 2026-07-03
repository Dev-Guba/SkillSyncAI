'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Skill_set', {
      skill_set_id : {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      skill_set_name: {
        type: Sequelize.STRING(50),
        unique: true,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Skill_set');
  }
};
