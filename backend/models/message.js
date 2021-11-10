'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Message.belongsTo(models.User, {
        foreignKey:{
          allowNull: false
        }
    }),
    models.Message.belongsTo(models.Profil, {
      foreignKey:{
        allowNull: false
      }
  })
  
  }
};
  Message.init({
    idUSERS: {
     type: DataTypes.INTEGER,
      allowNull: false 
    },
    idPROFILS: {
      type:DataTypes.INTEGER,
      allowNull: false 
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    msg: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    imgMsg: {
      type:DataTypes.STRING
  }
},
  {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};