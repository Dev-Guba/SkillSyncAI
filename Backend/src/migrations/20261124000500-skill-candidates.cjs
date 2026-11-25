'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Skill-like terms found in job postings that aren't in the catalog yet,
    // waiting for an admin to approve, merge or reject (Objectives 2.1, 2.3).
    await queryInterface.createTable('Skill_Candidates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // normalized (lowercase) term, e.g. "devops"
      term: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      // most common spelling in the postings, e.g. "DevOps"
      display_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      job_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      company_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      // existing skill this looks like ("ReactJS" -> React), if any
      similar_skill_set_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      // pending | approved | merged | rejected
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'pending',
      },
      // the catalog skill it became (approved) or was merged into (merged)
      skill_set_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      reviewed_by: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      first_seen_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      last_seen_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('Skill_Candidates', ['status']);

    // Which postings mention each candidate (for counts, and so approving a
    // skill can link it to those postings right away for the forecasts).
    await queryInterface.createTable('Skill_Candidate_Jobs', {
      candidate_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      job_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Skill_Candidate_Jobs');
    await queryInterface.dropTable('Skill_Candidates');
  },
};
