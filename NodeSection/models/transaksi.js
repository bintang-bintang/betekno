'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.detail, {foreignKey: "transaksiID", as:"transaksiDetail"})
      this.belongsTo(models.customer, {foreignKey: "customerID"})

}
  }
  transaksi.init(
    {
      transaksiID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      customerID: DataTypes.INTEGER,
      tanggal: DataTypes.DATE,
      jumlahHarga: DataTypes.DOUBLE
    }, {
    sequelize,
    modelName: 'transaksi',
  });
  return transaksi;
};