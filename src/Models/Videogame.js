
module.exports = (sequelize, DataTypes, UUIDV4) => {

  sequelize.define('videogame', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    released:{
      type: DataTypes.DATEONLY 
    },
  
    rating:{
      type: DataTypes.DECIMAL
    },
    platforms:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    background_image:{
      type: DataTypes.STRING,
    },
  },{
    timestamps: true,
    createdAt: false,
    updatedAt: false,
    paranoid: true,
    deletedAt: "Request_Delete",
  });
};
