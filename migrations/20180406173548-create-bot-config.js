
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('BotConfigs', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        name: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING,
        },
        title: {
            type: Sequelize.STRING,
        },
        configuration: {
            type: Sequelize.TEXT,
        },
        user_id: {
            // note: this is the sub field of Auth0 token
            type: Sequelize.STRING,
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
    }),
    down: queryInterface => queryInterface.dropTable('BotConfigs'),
};
