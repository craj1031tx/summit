module.exports = (sequelize, DataTypes) => {
  const ProductAsset = sequelize.define('productAsset', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    productId: DataTypes.INTEGER,
    assetId: DataTypes.INTEGER
  }, {});
  ProductAsset.associate = function(models) {
    // associations can be defined here
  };
  return ProductAsset;
};