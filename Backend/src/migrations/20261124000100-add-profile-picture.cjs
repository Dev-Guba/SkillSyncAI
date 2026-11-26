'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Stores a small (256x256) image as a data URL, e.g. "data:image/jpeg;base64,..."
    await queryInterface.addColumn('User_Profile', 'profile_picture', {
      type: Sequelize.TEXT('medium'),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('User_Profile', 'profile_picture');
  },
};
