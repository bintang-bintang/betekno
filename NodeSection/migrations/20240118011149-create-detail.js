'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('details', {
      detailID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaksiID: {
        type: Sequelize.INTEGER
        ,references: {
          model: 'transaksis',
          key: 'transaksiID'
        },
        allowNull: false
      },
      keranjangID: {
        type: Sequelize.INTEGER
        ,references: {
          model: 'keranjangs',
          key: 'keranjangID'
        },
        allowNull: false
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
    await queryInterface.dropTable('details');
  }
};