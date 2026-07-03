'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Skill_set', [
      { skill_set_name: 'PHP' },
      { skill_set_name: 'JavaScript' },
      { skill_set_name: 'TypeScript' },
      { skill_set_name: 'Node.js' },
      { skill_set_name: 'Express.js' },
      { skill_set_name: 'React' },
      { skill_set_name: 'Next.js' },
      { skill_set_name: 'Laravel' },
      { skill_set_name: 'Python' },
      { skill_set_name: 'Java' },
      { skill_set_name: 'C#' },
      { skill_set_name: 'MySQL' },
      { skill_set_name: 'PostgreSQL' },
      { skill_set_name: 'MongoDB' },
      { skill_set_name: 'Git' },
      { skill_set_name: 'Docker' },
      { skill_set_name: 'REST API' },
      { skill_set_name: 'HTML' },
      { skill_set_name: 'CSS' },
      { skill_set_name: 'Tailwind CSS' }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Skill_set', null, {});
  }
};
