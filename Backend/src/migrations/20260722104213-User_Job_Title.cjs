'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable(
      "UserJobTitle",
      {

        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,

          references:{
            model:"Users",
            key:"user_id",
          },

          onUpdate:"CASCADE",
          onDelete:"CASCADE",
        },


        job_title_id:{
          type: Sequelize.INTEGER,
          allowNull:false,

          references:{
            model:"Job_title",
            key:"job_title_id",
          },

          onUpdate:"CASCADE",
          onDelete:"CASCADE",
        }

      },
    );

  },


  async down(queryInterface){

    await queryInterface.dropTable("UserJobTitle");

  }

};