'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('ProgramJobTitles', [

      // BSIT
      {
        program_id: 1,
        job_title_id: 1, // Backend Developer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        job_title_id: 2, // Frontend Developer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        job_title_id: 3, // Full Stack Developer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        job_title_id: 6, // Web Developer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        job_title_id: 5, // Mobile Developer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        job_title_id: 13, // Database Administrator
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        job_title_id: 16, // IT Support Specialist
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        job_title_id: 17, // Quality Assurance Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        job_title_id: 12, // Cloud Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 1,
        job_title_id: 11, // DevOps Engineer
        createdAt: now,
        updatedAt: now,
      },

      // BSCS
      {
        program_id: 2,
        job_title_id: 4, // Software Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        job_title_id: 1, // Backend Developer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        job_title_id: 8, // Data Scientist
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        job_title_id: 9, // Machine Learning Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        job_title_id: 10, // AI Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        job_title_id: 3, // Full Stack Developer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        job_title_id: 12, // Cloud Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 2,
        job_title_id: 11, // DevOps Engineer
        createdAt: now,
        updatedAt: now,
      },

      // BSIS
      {
        program_id: 3,
        job_title_id: 28, // Business Analyst
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        job_title_id: 7, // Data Analyst
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        job_title_id: 13, // Database Administrator
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        job_title_id: 16, // IT Support Specialist
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        job_title_id: 31, // Project Manager
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 3,
        job_title_id: 6, // Web Developer
        createdAt: now,
        updatedAt: now,
      },

      // BSCpE
      {
        program_id: 4,
        job_title_id: 35, // Electronics Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        job_title_id: 14, // Network Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        job_title_id: 4, // Software Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 4,
        job_title_id: 16, // IT Support Specialist
        createdAt: now,
        updatedAt: now,
      },

      // BSSE
      {
        program_id: 5,
        job_title_id: 4, // Software Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        job_title_id: 1, // Backend Developer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        job_title_id: 2, // Frontend Developer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        job_title_id: 3, // Full Stack Developer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        job_title_id: 11, // DevOps Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 5,
        job_title_id: 17, // Quality Assurance Engineer
        createdAt: now,
        updatedAt: now,
      },

      // BSDS
      {
        program_id: 6,
        job_title_id: 8, // Data Scientist
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        job_title_id: 7, // Data Analyst
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        job_title_id: 9, // Machine Learning Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        job_title_id: 10, // AI Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 6,
        job_title_id: 28, // Business Analyst
        createdAt: now,
        updatedAt: now,
      },

      // BSCyber
      {
        program_id: 7,
        job_title_id: 15, // Cybersecurity Analyst
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        job_title_id: 14, // Network Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        job_title_id: 16, // IT Support Specialist
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        job_title_id: 12, // Cloud Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 7,
        job_title_id: 11, // DevOps Engineer
        createdAt: now,
        updatedAt: now,
      },

      // BMMA
      {
        program_id: 8,
        job_title_id: 18, // UI/UX Designer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        job_title_id: 43, // Content Creator
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 8,
        job_title_id: 42, // Digital Marketing Specialist
        createdAt: now,
        updatedAt: now,
      },

      // BSBA
      {
        program_id: 9,
        job_title_id: 28, // Business Analyst
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        job_title_id: 40, // Marketing Specialist
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        job_title_id: 41, // Sales Representative
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        job_title_id: 29, // Human Resource Specialist
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        job_title_id: 30, // Administrative Assistant
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 9,
        job_title_id: 31, // Project Manager
        createdAt: now,
        updatedAt: now,
      },

      // BSA
      {
        program_id: 10,
        job_title_id: 25, // Accountant
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        job_title_id: 27, // Auditor
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 10,
        job_title_id: 26, // Financial Analyst
        createdAt: now,
        updatedAt: now,
      },

      // BSHM
      {
        program_id: 11,
        job_title_id: 44, // Hotel Staff
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        job_title_id: 45, // Chef
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 11,
        job_title_id: 46, // Customer Service Representative
        createdAt: now,
        updatedAt: now,
      },

      // BSTM
      {
        program_id: 12,
        job_title_id: 44, // Hotel Staff
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        job_title_id: 46, // Customer Service Representative
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 12,
        job_title_id: 41, // Sales Representative
        createdAt: now,
        updatedAt: now,
      },

      // BSCRIM
      {
        program_id: 13,
        job_title_id: 47, // Forensic Investigator
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        job_title_id: 48, // Police Officer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        job_title_id: 49, // Crime Scene Investigator
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        job_title_id: 50, // Correctional Officer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 13,
        job_title_id: 51, // Customs Officer
        createdAt: now,
        updatedAt: now,
      },

      // BSN
      {
        program_id: 14,
        job_title_id: 19, // Registered Nurse
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        job_title_id: 22, // Healthcare Assistant
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 14,
        job_title_id: 23, // Caregiver
        createdAt: now,
        updatedAt: now,
      },

      // BSP
      {
        program_id: 15,
        job_title_id: 21, // Pharmacist
        createdAt: now,
        updatedAt: now,
      },

      // BSMT
      {
        program_id: 16,
        job_title_id: 20, // Medical Technologist
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 16,
        job_title_id: 24, // Radiologic Technologist
        createdAt: now,
        updatedAt: now,
      },

      // BSCE
      {
        program_id: 17,
        job_title_id: 32, // Civil Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 17,
        job_title_id: 36, // Architect
        createdAt: now,
        updatedAt: now,
      },

      // BSME
      {
        program_id: 18,
        job_title_id: 34, // Mechanical Engineer
        createdAt: now,
        updatedAt: now,
      },

      // BSEE
      {
        program_id: 19,
        job_title_id: 33, // Electrical Engineer
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 19,
        job_title_id: 35, // Electronics Engineer
        createdAt: now,
        updatedAt: now,
      },

      // BSED
      {
        program_id: 20,
        job_title_id: 37, // Teacher
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        job_title_id: 38, // College Instructor
        createdAt: now,
        updatedAt: now,
      },
      {
        program_id: 20,
        job_title_id: 39, // Training Specialist
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ProgramJobTitles', null, {});
  },
};