/**
 *  This class defines an interface to be used whenever a component of the
 *  system wishes to interact with any bot configurations in the database
 */

const models = require('models');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const sequelize = require('sequelize');
const { writeScripts, shouldRegenerateBotScripts } = require('./codeGeneration/generateScript.js');

const PATH_TO_LUA = path.join(__dirname, '..', '..', '..', 'public', 'lua');
const LIMIT_NUMBER = 5;
const MAX_DEPTH = 10;

class BotController {
    static getRecentBots(request, response) {
        models.BotConfig.findAll({
            where: { userId: request.user.sub },
            order: [
                ['updatedAt', 'DESC'],
            ],
            limit: LIMIT_NUMBER,
        })
            .then((botConfigs) => {
                models.BotConfig.findAll({
                    where: { userId: request.user.sub },
                    attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'numBots']],
                })
                    .then((returned) => {
                        response.status(200).json({
                            botConfigs,
                            numBots: returned[0].dataValues.numBots,
                        });
                    });
            })
            .catch(() => {
                response.status(500).json({ error: true, message: 'Database Error' });
            });
    }

    /** recursively simplifies an complex item into
     * an object such as
     * {
     *      name: <name>
     *      components: null | {
     *           name: <name>,
     *           componenets: null | <thisStructure>,
     *       }
     * }
     */
    static makeSimpleItemArray(items) {
        const itemsArr = [];
        if (items && items.length) {
            items.forEach((element) => {
                itemsArr.push(this.makeSimpleItem(element, 0));
            });
        }
        return itemsArr;
    }

    // Recursive function to simplify item object
    // into what is needed by the code generator
    static makeSimpleItem(item, depth) {
        if (item) {
            const newItem = {
                name: this.getItemApiName(item),
            };
            if (item.components) {
                if (item.components === 'null' || item.components === null || depth >= MAX_DEPTH) {
                    newItem.components = 'null';
                } else if (item.components.length) {
                    const itemParts = [];
                    newItem.name = `item_recipe_${newItem.name}`;
                    item.components.forEach((element) => {
                        itemParts.push(this.makeSimpleItem(element, depth + 1));
                    });
                    newItem.components = itemParts;
                }
                return newItem;
            }
        }
        return null;
    }

    static getItemApiName(item) {
        /**
         * the dagon_1, dagon_2, dagon_3 from the scraper
         *  do not resolve in the dota api, they all
         *  refer to 'item_recipe_dagon'
         */
        if (item.name.indexOf('dagon') > -1) {
            return 'item_recipe_dagon';
        }
        return `item_${item.name}`;
    }

    // removes unnecessary fields from json
    static reduceAbilityObject(abilityObject) {
        const abilityTempObject = {};
        abilityTempObject.priorities = {};
        abilityObject.abilities.forEach((x) => {
            abilityTempObject.priorities[x.type] = x.priority;
        });
        abilityTempObject.abilityLevels = abilityObject.abilityLevels;
        return abilityTempObject;
    }

    static removeRedundantDataFromObject(configuration) {
        const newConfiguration = {};
        newConfiguration.heroPool = configuration.heroPool;
        newConfiguration.desires = configuration.desires;
        let result = [];
        if (configuration.heroes && configuration.heroes.length) {
            const newHeroes = [];
            configuration.heroes.forEach((hero) => {
                let newHero = { };
                if (hero.abilities) {
                    newHero = this.reduceAbilityObject(hero);
                }
                newHero.name = hero.name;
                if (hero.items && hero.items.length) {
                    result = this.makeSimpleItemArray(hero.items);
                    newHero.items = result;
                }
                newHeroes.push(newHero);
            });
            newConfiguration.heroes = newHeroes;
        } else {
            newConfiguration.heroes = [];
        }
        return newConfiguration;
    }

    static updateBot(request, response) {
        let { configuration } = request.body;
        const {
            name, id, description,
        } = request.body;
        const userId = request.user.sub;
        // condition for creating a botconfig entry
        configuration = this.removeRedundantDataFromObject(configuration);
        request.body.configuration = configuration;
        if (id === -1) {
            models.BotConfig.create({
                name,
                description,
                configuration: JSON.stringify(configuration),
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
                .then((botConfig) => {
                    writeScripts(request, response, request.user.sub, botConfig.id);
                    response.status(200).json({ botConfig });
                });
        } else {
            models.BotConfig.find({
                where: {
                    userId: request.user.sub,
                    id,
                },
            })
                .then((botConfig) => {
                    if (botConfig !== null) {
                        botConfig.update({
                            name,
                            description,
                            configuration: JSON.stringify(configuration),
                            updatedAt: new Date(),
                        });
                        writeScripts(request, response, request.user.sub, botConfig.id);
                        response.status(200).json({ botConfig });
                    } else {
                        response.status(200).json({});
                    }
                });
            // .catch(() => {
            //     response.status(500).json({ error: true, message: 'Database Error' });
            // });
        }
    }

    static getBot(request, response) {
        const id = request.params.botID;
        models.BotConfig.findAll({
            where: {
                userId: request.user.sub,
                id,
            },
        })
            .then((botConfig) => {
                response.status(200).json({ botConfig });
            });
        // .catch(() => {
        //     response.status(500).json({ error: true, message: 'Database Error' });
        // });
    }

    static getAllBots(request, response) {
        models.BotConfig.findAll({
            where: { userId: request.user.sub },
        })
            .then((botConfigs) => {
                response.status(200).json({ botConfigs });
            });
        // .catch(() => {
        //     response.status(500).json({ error: true, message: 'Database Error' });
        // });
    }

    static deleteBot(request, response) {
        const id = request.body.botID;
        models.BotConfig.destroy({
            where: {
                userId: request.user.sub,
                id,
            },
        })
            .catch(() => {
                response.status(500).json({ error: true, deleted: false });
            })
            .then(() => {
                response.status(200).json({ deleted: true });
            });
    }

    static getScripts(request, response) {
        const id = request.params.botID;
        models.BotConfig.find({
            where: {
                userId: request.user.sub,
                id,
            },
        })
            .then((botConfig) => {
                request.body = JSON.parse(botConfig.configuration);
                const userId = request.user.sub;
                if (shouldRegenerateBotScripts(userId, botConfig.id, botConfig.updatedAt)) {
                    writeScripts(request, response, request.user.sub, botConfig.id);
                }
                const file = path.join(PATH_TO_LUA, request.user.sub, `${botConfig.id}.zip`);
                const filename = path.basename(file);
                const mimetype = mime.lookup(file);
                response.setHeader('Content-disposition', `attachment; filename=${filename}`);
                response.setHeader('Content-type', mimetype);
                const filestream = fs.createReadStream(file);
                filestream.pipe(response);
                response.download(file);
            })
            .catch((err) => {
                response.status(500).json({ error: true, message: err });
            });
    }
}
module.exports.BotController = BotController;
