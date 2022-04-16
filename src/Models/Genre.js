
module.exports = (sequelize, DataTypes) => {
  sequelize.define('genre', {
    name:{
      type: DataTypes.STRING,
      unique: true
    }
  },
  {
    timestamps: true,
    createdAt: false,
    updatedAt: false,
    paranoid: true,
    deletedAt: 'Request_Delete'
  });
}