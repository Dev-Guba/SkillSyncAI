'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('User_Profile', [
      {
        user_id: 1,
        program_id: 1, // BS Information Technology
        first_name: 'System',
        last_name: 'Administrator',
        email: 'system.administrator@test.com',
        phone_number: '09171234567',
        birth_date: new Date('1990-01-01'),
        gender: 'Male',
        bio: 'System administrator of SkillSyncAI.',
        location: 'Cebu City'
      },
      {
        user_id: 2,
        program_id: 5, // BS Software Engineering
        first_name: 'Maria',
        last_name: 'Santos',
        email: 'maria.santos@test.com',
        phone_number: '09181234567',
        birth_date: new Date('1988-05-15'),
        gender: 'Female',
        bio: 'Faculty member specializing in Software Engineering.',
        location: 'Cebu City'
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User_Profile', null, {});
  }
};