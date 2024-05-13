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
      this.hasOne(
        models.detail,
        {
          foreignKey: "transaksiID",
          as: "transaksiDetail"
        }
      )
      this.belongsTo(models.customer,{foreignKey: "customerID"})
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
      tanggal: DataTypes.DATE,
      pesan: DataTypes.STRING,
      jumlahHarga: DataTypes.INTEGER,
      customerID: DataTypes.INTEGER,
    }, {
    sequelize,
    modelName: 'transaksi',
  });
  return transaksi;
};