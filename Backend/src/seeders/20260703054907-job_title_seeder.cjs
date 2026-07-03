'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Job_title', [
  { job_title_name: 'Backend Developer' },
  { job_title_name: 'Frontend Developer' },
  { job_title_name: 'Full Stack Developer' },
  { job_title_name: 'Software Engineer' },
  { job_title_name: 'Mobile Developer' },
  { job_title_name: 'Data Analyst' }
]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Job_title', null, {});
  }
};
