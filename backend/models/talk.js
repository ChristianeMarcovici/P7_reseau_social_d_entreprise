'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Talk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Talk.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      }),
      models.Talk.belongsTo(models.Message, {
        foreignKey: {
          allowNull: false
        }
      }),
      models.Talk.hasOne(models.Talk, {
        foreignKey: {
          allowNull: false
        }
      })
    }
  };
  Talk.init({
    idUSERS: DataTypes.INTEGER,
    idMESSAGES: DataTypes.INTEGER,
    msgTalk: DataTypes.STRING,
    imgTalk: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Talk',
  });
  return Talk;
};