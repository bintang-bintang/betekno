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
      keranjangID: {
        type: Sequelize.INTEGER
        ,references: {
          model: 'keranjangs',
          key: 'keranjangID'
        },
        allowNull: false
      },
      transaksiID: {
        type: Sequelize.INTEGER
        ,references: {
          model: 'transaksis',
          key: 'transaksiID'
        },
        allowNull: false
      },
      // kuantitas: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER
      // },
      // jumlahHarga: {
      //   type: Sequelize.DOUBLE
      // },
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