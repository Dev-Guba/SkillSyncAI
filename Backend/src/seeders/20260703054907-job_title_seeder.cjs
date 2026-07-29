'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Job_title', [

      // Information & Communication Technology
      { job_title_name: 'Backend Developer' },
      { job_title_name: 'Frontend Developer' },
      { job_title_name: 'Full Stack Developer' },
      { job_title_name: 'Software Engineer' },
      { job_title_name: 'Mobile Developer' },
      { job_title_name: 'Web Developer' },
      { job_title_name: 'Data Analyst' },
      { job_title_name: 'Data Scientist' },
      { job_title_name: 'Machine Learning Engineer' },
      { job_title_name: 'AI Engineer' },
      { job_title_name: 'DevOps Engineer' },
      { job_title_name: 'Cloud Engineer' },
      { job_title_name: 'Database Administrator' },
      { job_title_name: 'Network Engineer' },
      { job_title_name: 'Cybersecurity Analyst' },
      { job_title_name: 'IT Support Specialist' },
      { job_title_name: 'Quality Assurance Engineer' },
      { job_title_name: 'UI/UX Designer' },


      // Healthcare
      { job_title_name: 'Registered Nurse' },
      { job_title_name: 'Medical Technologist' },
      { job_title_name: 'Pharmacist' },
      { job_title_name: 'Healthcare Assistant' },
      { job_title_name: 'Caregiver' },
      { job_title_name: 'Radiologic Technologist' },


      // Business & Finance
      { job_title_name: 'Accountant' },
      { job_title_name: 'Financial Analyst' },
      { job_title_name: 'Auditor' },
      { job_title_name: 'Business Analyst' },
      { job_title_name: 'Human Resource Specialist' },
      { job_title_name: 'Administrative Assistant' },
      { job_title_name: 'Project Manager' },


      // Engineering
      { job_title_name: 'Civil Engineer' },
      { job_title_name: 'Electrical Engineer' },
      { job_title_name: 'Mechanical Engineer' },
      { job_title_name: 'Electronics Engineer' },
      { job_title_name: 'Architect' },


      // Education
      { job_title_name: 'Teacher' },
      { job_title_name: 'College Instructor' },
      { job_title_name: 'Training Specialist' },


      // Marketing & Sales
      { job_title_name: 'Marketing Specialist' },
      { job_title_name: 'Sales Representative' },
      { job_title_name: 'Digital Marketing Specialist' },
      { job_title_name: 'Content Creator' },


      // Hospitality
      { job_title_name: 'Hotel Staff' },
      { job_title_name: 'Chef' },
      { job_title_name: 'Customer Service Representative' }

    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Job_title', null, {});
  }
};