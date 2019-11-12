module.exports = (sequelize, Datatypes) => {
    const Takeout = sequelize.define('takeout', {
        token: {
            type: Datatypes.STRING       
        },
        takeoutAssets: {
            type: Datatypes.ARRAY(Datatypes.TEXT)
        },
        expiration: {
            type: Datatypes.DATE //on what date does this expire
        },
        isActive: {
            type: Datatypes.BOOLEAN,//is this takeout currently active?
            defaultValue: true
        }
    })

    Takeout.associate = (models) => {
        Takeout.belongsTo(models.User, {as: 'userTakeout', foreignKey: 'userId'})
    }

    return Takeout;
}