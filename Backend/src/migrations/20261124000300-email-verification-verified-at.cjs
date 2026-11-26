'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Set when a code is entered correctly. Lets an email be verified at
    // sign-up, before the user has a profile to store it on.
    await queryInterface.addColumn('Email_Verifications', 'verified_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Email_Verifications', 'verified_at');
  },
};
