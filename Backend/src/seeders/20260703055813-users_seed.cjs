'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const saltRounds = 10;
    await queryInterface.bulkInsert('Users', [
      {
        role_id: 1,
        username: 'admin',
        password: await bcrypt.hash('admin123', saltRounds),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 2,
        username: 'faculty1',
        password: await bcrypt.hash('faculty123', saltRounds),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 2,
        username: 'faculty2',
        password: await bcrypt.hash('faculty123', saltRounds),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 3,
        username: 'student1',
        password: await bcrypt.hash('student123', saltRounds),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
