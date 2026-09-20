'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('JobSkills', {

      job_skill_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      job_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Jobs',
          key: 'job_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      skill_set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Skill_set',
          key: 'skill_set_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    await queryInterface.addConstraint('JobSkills', {
      fields: ['job_id', 'skill_set_id'],
      type: 'unique',
      name: 'unique_job_skill'
    });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('JobSkills');

  }
};