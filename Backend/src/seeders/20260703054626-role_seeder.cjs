'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('Role', [
    {
      role_name: 'Admin'
    },
    {
      role_name: 'Faculty'
    },
    {
      role_name: 'Student'
    }
  ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Role', null, {});
  }
};
