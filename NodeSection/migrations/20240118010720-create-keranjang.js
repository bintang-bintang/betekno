'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('keranjangs', {
      keranjangID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerID: {
        type: Sequelize.INTEGER
        ,references: {
          model: 'customers',
          key: 'customerID'
        },
        allowNull: false
      },
      produkID: {
        type: Sequelize.INTEGER
        ,references: {
          model: 'produks',
          key: 'produkID'
        },
        allowNull: false
      },
      kuantitas: {
        type: Sequelize.INTEGER
      },
      subHarga: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('keranjangs');
  }
};