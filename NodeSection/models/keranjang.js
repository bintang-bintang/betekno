'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class keranjang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.produk, {foreignKey: "produkID"})
      this.belongsTo(models.customer, {foreignKey: "customerID"})
    }
  }
  keranjang.init(
    {
      keranjangID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      customerID: DataTypes.INTEGER,
      produkID: DataTypes.INTEGER,
      kuantitas: DataTypes.INTEGER,
      subHarga: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'keranjang',
    });
  return keranjang;
};