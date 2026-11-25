'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // When the profile email was confirmed with a code. NULL = not verified.
    await queryInterface.addColumn('User_Profile', 'email_verified_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Accounts that existed before verification was added are treated as
    // verified, so nobody gets locked out.
    await queryInterface.sequelize.query(
      'UPDATE User_Profile SET email_verified_at = NOW() WHERE email_verified_at IS NULL'
    );

    // One row per code sent. `email` is the address being verified, which
    // may differ from the profile's current email while a change is pending.
    await queryInterface.createTable('Email_Verifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      code_hash: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_used: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('Email_Verifications', ['user_id', 'is_used']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Email_Verifications');
    await queryInterface.removeColumn('User_Profile', 'email_verified_at');
  },
};
