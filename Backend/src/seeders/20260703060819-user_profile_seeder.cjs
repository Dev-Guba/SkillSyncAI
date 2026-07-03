'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('User_Profile', [
      {
        user_id: 1,
        first_name: 'System',
        last_name: 'Administrator',
        phone_number: '09171234567',
        birth_date: new Date('1990-01-01'),
        gender: 'Male',
        bio: 'System administrator of SkillSyncAI.',
        location: 'Cebu City'
      },
      {
        user_id: 2,
        first_name: 'Maria',
        last_name: 'Santos',
        phone_number: '09181234567',
        birth_date: new Date('1988-05-15'),
        gender: 'Female',
        bio: 'Faculty member specializing in Software Engineering.',
        location: 'Cebu City'
      },
      {
        user_id: 3,
        first_name: 'John',
        last_name: 'Reyes',
        phone_number: '09192345678',
        birth_date: new Date('1992-09-20'),
        gender: 'Male',
        bio: 'Faculty member teaching Web Development and Databases.',
        location: 'Mandaue City'
      },
      {
        user_id: 4,
        first_name: 'James',
        last_name: 'David',
        phone_number: '09951234567',
        birth_date: new Date('2004-09-13'),
        gender: 'Male',
        bio: 'BSIT student passionate about Backend Development and AI.',
        location: 'Lapu-Lapu City'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User_Profile', null, {});
  }
};
