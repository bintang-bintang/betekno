'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class produk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.detail, {foreignKey: "produkID", as:"produkDetail"})
      this.hasMany(models.keranjang, {foreignKey: "produkID", as:"produkKeranjang"})
    }
  }
  produk.init(
    {
      produkID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      namaProduk: DataTypes.STRING,
      hargaProduk: DataTypes.DOUBLE,
      stokProduk: DataTypes.INTEGER,
      deskripsiProduk: DataTypes.STRING,
      image: DataTypes.STRING
    }, {
    sequelize,
    modelName: 'produk',
  });
  return produk;
};