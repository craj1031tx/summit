module.exports = (sequelize, DataTypes) => {
    const TakeoutAsset = sequelize.define('takeoutAsset', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true, 
          autoIncrement: true
      },
      takeoutId: DataTypes.INTEGER,
      assetId: DataTypes.INTEGER
    }, {});
    TakeoutAsset.associate = function(models) {
      // associations can be defined here
    };
    return TakeoutAsset;
  };