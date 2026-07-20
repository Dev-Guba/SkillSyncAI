'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('User_Profile', {
      user_profile_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      first_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      email : {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      phone_number: {
        type: Sequelize.STRING(15)
      },
      birth_date: {
        type: Sequelize.DATE
      },
      gender : {
        type: Sequelize.ENUM('Male', 'Female', 'Other')
      },
      bio: {
        type: Sequelize.TEXT
      },
      location: {
        type: Sequelize.STRING(100)
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('User_Profile');
  }
};
