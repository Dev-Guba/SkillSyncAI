'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Interests', [
      {
        interest_name: 'Web Development',
      },
      {
        interest_name: 'Frontend Development',
      },
      {
        interest_name: 'Backend Development',
      },
      {
        interest_name: 'UI/UX Design',
      },
      {
        interest_name: 'Mobile Development',
      },
      {
        interest_name: 'Data Science',
      },
      {
        interest_name: 'Machine Learning',
      },
      {
        interest_name: 'Cybersecurity',
      },
      {
        interest_name: 'Cloud Computing',
      },
      {
        interest_name: 'Game Development',
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Interests',null,{});
  }
};
