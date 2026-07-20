'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable( 'UserInterest', {
      user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    interest_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Interests",
        key: "interest_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
