'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Deactivated accounts can't log in, but keep their data and email.
    await queryInterface.addColumn('Users', 'is_active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn('Users', 'deactivated_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Who did what to which account. target_username is copied so entries
    // still make sense after an account is permanently deleted.
    await queryInterface.createTable('Admin_Action_Logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      admin_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      admin_username: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      target_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      target_username: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      action: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      details: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('Admin_Action_Logs', ['created_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Admin_Action_Logs');
    await queryInterface.removeColumn('Users', 'deactivated_at');
    await queryInterface.removeColumn('Users', 'is_active');
  },
};
