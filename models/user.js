'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
	    // tbl_user.hasOne(models.tbl_presensi,{ foreignKey: 'user_id' })
      // tbl_user.belongsTo(models.tbl_pangkat,{ foreignKey: 'pangkat_id' })
      // tbl_user.belongsTo(models.tbl_jabatan,{ foreignKey: 'jabatan_id' })
      // tbl_user.belongsTo(models.tbl_organisasi,{ foreignKey: 'organisasi_id' })
      // tbl_user.belongsTo(models.tbl_user,{as: 'manager_user', foreignKey: 'manager_user_id' })
      // tbl_user.belongsTo(models.tbl_absensi,{as: 'absensi_manager_user', foreignKey: 'manager_user_id' })
      // tbl_user.belongsTo(models.tbl_absensi,{as: 'absensi_user', foreignKey: 'user_id' })
    }
  }
  user.init({
    user_id: {
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nip: DataTypes.STRING,
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.TEXT,
    last_login: DataTypes.INTEGER,
    deleted: DataTypes.SMALLINT,
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'user',
  });
  return user;
};