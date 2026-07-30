'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('Programs', [
      {
        program_code: 'BSIT',
        program_name: 'BS Information Technology',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSCS',
        program_name: 'BS Computer Science',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSIS',
        program_name: 'BS Information Systems',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSCpE',
        program_name: 'BS Computer Engineering',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSSE',
        program_name: 'BS Software Engineering',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSDS',
        program_name: 'BS Data Science',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSCyber',
        program_name: 'BS Cybersecurity',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BMMA',
        program_name: 'BS Multimedia Arts',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSBA',
        program_name: 'BS Business Administration',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSA',
        program_name: 'BS Accountancy',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSHM',
        program_name: 'BS Hospitality Management',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSTM',
        program_name: 'BS Tourism Management',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSCRIM',
        program_name: 'BS Criminology',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSN',
        program_name: 'BS Nursing',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSP',
        program_name: 'BS Pharmacy',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSMT',
        program_name: 'BS Medical Technology',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSCE',
        program_name: 'BS Civil Engineering',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSME',
        program_name: 'BS Mechanical Engineering',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSEE',
        program_name: 'BS Electrical Engineering',
        createdAt: now,
        updatedAt: now,
      },
      {
        program_code: 'BSED',
        program_name: 'BS Education',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Programs', null, {});
  },
};