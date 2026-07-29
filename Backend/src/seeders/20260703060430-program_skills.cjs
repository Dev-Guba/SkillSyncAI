'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const now = new Date();

    await queryInterface.bulkInsert('Program_Skills', [

      // BSIT
      {
        program_id: 1,
        skill_set_id: 1, // PHP
        createdAt: now,
        updatedAt: now,
      },

      {
        program_id: 1,
        skill_set_id: 2, // JavaScript
        createdAt: now,
        updatedAt: now,
      },

      {
        program_id: 1,
        skill_set_id: 3, // TypeScript
        createdAt: now,
        updatedAt: now,
      },

      {
        program_id: 1,
        skill_set_id: 4, // Node.js
        createdAt: now,
        updatedAt: now,
      },

      {
        program_id: 1,
        skill_set_id: 5, // Express.js
        createdAt: now,
        updatedAt: now,
      },

      {
        program_id: 1,
        skill_set_id: 6, // React
        createdAt: now,
        updatedAt: now,
      },

      {
        program_id: 1,
        skill_set_id: 8, // Laravel
        createdAt: now,
        updatedAt: now,
      },

      {
        program_id: 1,
        skill_set_id: 9, // Python
        createdAt: now,
        updatedAt: now,
      },

      {
        program_id: 1,
        skill_set_id: 12, // MySQL
        createdAt: now,
        updatedAt: now,
      },

      {
        program_id: 1,
        skill_set_id: 13, // PostgreSQL
        createdAt: now,
        updatedAt: now,
      },

      {
        program_id: 1,
        skill_set_id: 14, // MongoDB
        createdAt: now,
        updatedAt: now,
      },

      {
        program_id: 1,
        skill_set_id: 15, // Git
        createdAt: now,
        updatedAt: now,
      },

      {
        program_id: 1,
        skill_set_id: 16, // Docker
        createdAt: now,
        updatedAt: now,
      },

      {
        program_id: 1,
        skill_set_id: 17, // REST API
        createdAt: now,
        updatedAt: now,
      },

      {
        program_id: 1,
        skill_set_id: 18, // HTML
        createdAt: now,
        updatedAt: now,
      },

      {
        program_id: 1,
        skill_set_id: 19, // CSS
        createdAt: now,
        updatedAt: now,
      },

      {
        program_id: 1,
        skill_set_id: 20, // Tailwind CSS
        createdAt: now,
        updatedAt: now,
      },

    ]);

  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Program_Skills', null, {});
  },
};