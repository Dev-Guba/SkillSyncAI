'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('UserJobTitle', [
      {
        user_id: 4,
        job_title_id: 1, // Backend Developer
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'UserJobTitle',
      {
        user_id: 4
      }
    );
  }
};
