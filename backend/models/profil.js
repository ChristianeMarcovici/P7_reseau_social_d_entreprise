'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profil extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Profil.belongsTo(models.User, {
        foreignKey:{
          allowNull: false
        }
      }),
      models.Profil.belongsTo(models.Message, {
        foreignKey:{
          allowNull: false
        }
    })
  }
};
  Profil.init({
    idUSERS: DataTypes.INTEGER,
    username: DataTypes.STRING,
    emploi: DataTypes.STRING,
    seniority: DataTypes.INTEGER,
    presentation: DataTypes.STRING,
    imgProfil: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profil',
  });
  return Profil;
};
