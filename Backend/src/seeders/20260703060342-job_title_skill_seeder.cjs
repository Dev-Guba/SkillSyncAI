'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('Job_title_skills', [

      // Backend Developer
      { job_title_id: 1, skill_set_id: 1 },   // PHP
      { job_title_id: 1, skill_set_id: 4 },   // Node.js
      { job_title_id: 1, skill_set_id: 5 },   // Express.js
      { job_title_id: 1, skill_set_id: 12 },  // MySQL
      { job_title_id: 1, skill_set_id: 15 },  // Git
      { job_title_id: 1, skill_set_id: 17 },  // REST API
      { job_title_id: 1, skill_set_id: 16 },  // Docker

      // Frontend Developer
      { job_title_id: 2, skill_set_id: 2 },   // JavaScript
      { job_title_id: 2, skill_set_id: 3 },   // TypeScript
      { job_title_id: 2, skill_set_id: 6 },   // React
      { job_title_id: 2, skill_set_id: 7 },   // Next.js
      { job_title_id: 2, skill_set_id: 18 },  // HTML
      { job_title_id: 2, skill_set_id: 19 },  // CSS
      { job_title_id: 2, skill_set_id: 20 },  // Tailwind CSS
      { job_title_id: 2, skill_set_id: 15 },  // Git

      // Full Stack Developer
      { job_title_id: 3, skill_set_id: 1 },
      { job_title_id: 3, skill_set_id: 2 },
      { job_title_id: 3, skill_set_id: 4 },
      { job_title_id: 3, skill_set_id: 5 },
      { job_title_id: 3, skill_set_id: 6 },
      { job_title_id: 3, skill_set_id: 12 },
      { job_title_id: 3, skill_set_id: 15 },
      { job_title_id: 3, skill_set_id: 16 },

      // Software Engineer
      { job_title_id: 4, skill_set_id: 2 },
      { job_title_id: 4, skill_set_id: 9 },
      { job_title_id: 4, skill_set_id: 10 },
      { job_title_id: 4, skill_set_id: 12 },
      { job_title_id: 4, skill_set_id: 15 },

      // Mobile Developer
      { job_title_id: 5, skill_set_id: 2 },
      { job_title_id: 5, skill_set_id: 9 },
      { job_title_id: 5, skill_set_id: 10 },
      { job_title_id: 5, skill_set_id: 15 },

      // Data Analyst
      { job_title_id: 6, skill_set_id: 9 },
      { job_title_id: 6, skill_set_id: 12 },
      { job_title_id: 6, skill_set_id: 13 },
      { job_title_id: 6, skill_set_id: 14 },
      { job_title_id: 6, skill_set_id: 15 }

    ]);
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Job_title_skills', null, {});
  }
};
