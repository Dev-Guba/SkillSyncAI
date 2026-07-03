'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('User_Skills', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      skill_set_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Skill_set',
          key: 'skill_set_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      proficiency_level: {
        type: Sequelize.ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert'),
        allowNull: false,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('User_Skills');
  }
};
