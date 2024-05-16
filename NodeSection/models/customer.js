'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.keranjang, {foreignKey: "customerID", as: "customerKeranjang"})
      this.hasMany(models.transaksi, {foreignKey: "customerID", as: "customerTransaksi"})
    }
  }
  customer.init(
    {
      customerID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nama: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      alamat: DataTypes.STRING,
      teknoCoin: DataTypes.INTEGER,
      role: DataTypes.STRING
    }, {
    sequelize,
    modelName: 'customer',
  });
  return customer;
};