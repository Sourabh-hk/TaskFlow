'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('Password@123', 12);

    await queryInterface.bulkInsert('Users', [
      {
        fullName: 'Alice Johnson',
        email: 'alice@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: 'Bob Smith',
        email: 'bob@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const users = await queryInterface.sequelize.query(
      "SELECT id FROM \"Users\" WHERE email IN ('alice@example.com', 'bob@example.com');",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const [alice, bob] = users;

    await queryInterface.bulkInsert('Tasks', [
      {
        title: 'Set up project repository',
        description: 'Initialize Git repo, add README, set up CI/CD pipeline.',
        status: 'Completed',
        priority: 'High',
        dueDate: '2024-01-15',
        userId: alice.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Design database schema',
        description: 'Create ER diagrams and define all table relationships.',
        status: 'In Progress',
        priority: 'High',
        dueDate: '2024-01-20',
        userId: alice.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Implement authentication',
        description: 'JWT-based auth with refresh token support.',
        status: 'Pending',
        priority: 'High',
        dueDate: '2024-01-25',
        userId: alice.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Review codebase',
        description: 'Audit existing code for security vulnerabilities.',
        status: 'Pending',
        priority: 'Medium',
        dueDate: '2024-01-18',
        userId: bob.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Write unit tests',
        description: 'Achieve 80% code coverage for critical paths.',
        status: 'In Progress',
        priority: 'Medium',
        dueDate: '2024-01-22',
        userId: bob.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Tasks', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
