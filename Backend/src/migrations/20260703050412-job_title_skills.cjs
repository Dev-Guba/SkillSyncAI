'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) { 
    await queryInterface.createTable('Job_title_skills', { 
      job_title_id : {
        type: Sequelize.INTEGER,
        references: {
          model: 'Job_title',
          key: 'job_title_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      skill_set_id : {
        type: Sequelize.INTEGER,
        references: {
          model: 'Skill_set',
          key: 'skill_set_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Job_title_skills');
  }
};
