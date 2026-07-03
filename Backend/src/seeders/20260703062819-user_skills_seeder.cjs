'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('User_Skills', [
      {
        user_id: 4,
        skill_set_id: 1, // PHP
        proficiency_level: 'Advanced'
      },
      {
        user_id: 4,
        skill_set_id: 2, // JavaScript
        proficiency_level: 'Intermediate'
      },
      {
        user_id: 4,
        skill_set_id: 5, // Express.js
        proficiency_level: 'Intermediate'
      },
      {
        user_id: 4,
        skill_set_id: 12, // MySQL
        proficiency_level: 'Advanced'
      },
      {
        user_id: 4,
        skill_set_id: 15, // Git
        proficiency_level: 'Intermediate'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User_Skills', {
        user_id: 4
      }
    );
  }
};
