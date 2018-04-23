const express = require('express');
const passport = require('passport');
const models = require('../models');
const sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const config = require('../server/config.js');
const request = require('request');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const router = express.Router();
const env = {
    AUTH0_CLIENT_ID: 'kYw-F9JzITYkyDZoQUiFE5PGqkeAvB_H',
    AUTH0_DOMAIN: 'dota-bot-scripting.eu.auth0.com',
    AUTH0_CALLBACK_URL: 'http://localhost:3000/callback',
    AUTH0_API_AUDIENCE: 'dota-bot-scripting',
};

/* Authenticate JWT at route endpoints */
const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: env.AUTH0_API_AUDIENCE,
    issuer: `https://${env.AUTH0_DOMAIN}/`,
    algorithm: 'RS256',
});

/* GET home page. */

router.get('/', (req, res) => {
    if (req.user) {
        res.redirect('/user');
        return;
    }
    res.render('index', { title: 'Backend testing of auth0' });
});

// router.get(
//     '/login',
//     passport.authenticate('auth0', {
//         clientID: env.AUTH0_CLIENT_ID,
//         domain: env.AUTH0_DOMAIN,
//         redirectUri: env.AUTH0_CALLBACK_URL,
//         audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
//         audience: 'dota-bot-scripting',
//         responseType: 'code',
//         scope: 'openid',
//     }),
//     (req, res) => {
//         res.redirect('/');
//     },
// );

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// router.get(
//     '/callback',
//     passport.authenticate(
//         'auth0',
//         { failureRedirect: '/failure' },
//     ),
//     (req, res) => {
//         res.redirect(req.session.returnTo || '/user');
//     },
// );

router.get('/failure', (req, res) => {
    const error = req.flash('error');
    const errorDescription = req.flash('error_description');
    req.logout();
    res.render('failure', {
        error: error[0],
        errorDescription: errorDescription[0],
    });
});

router.get('/test', jwtCheck, (request, response) => {    
    console.log("ethiosentuh"); 
    response.status(200).send({ message: 'This is an error response' });
});

// Generates the bot TeamDesires script
router.post('/generate', jwtCheck, (req, res) => {
    let scriptBuilder = '';

    // Adds the script name and the description as a comment at the top of the file
    scriptBuilder += `-- ${req.body.teamDesires.name}--\n`;
    scriptBuilder += `[[ ${req.body.teamDesires.description}]]\n`;

    const { teamDesires } = req.body;
    // Creates the UpdateRoshanDesire function
    const roshanDesire = teamDesires.roshan / 10;
    scriptBuilder += 'function UpdateRoshanDesires()\n';
    scriptBuilder += `    return ${roshanDesire};\n`;
    scriptBuilder += 'end\n\n';

    // Creates the UpdateRoamDesire function
    const roamDesire = teamDesires.roam / 10;
    scriptBuilder += 'function UpdateRoamDesires()\n';
    scriptBuilder += `    return {${roamDesire}, GetTeamMember(((GetTeam() == TEAM_RADIANT) ? TEAM_RADIANT : TEAM_DIRE), RandomInt(1, 5))}\n`;
    scriptBuilder += 'end\n\n';

    // Creates the UpdatePushLaneDesires function
    Object.keys(teamDesires.push).map((lane) => {
        teamDesires.push[lane] /= 10;
    });
    scriptBuilder += 'function UpdatePushLaneDesires() \n';
    scriptBuilder += `    return {${teamDesires.push.top}, ${teamDesires.push.mid}, ${teamDesires.push.bot}}\n`;
    scriptBuilder += 'end\n\n';

    // Creates the UpdateDefendLaneDesires function
    Object.keys(req.body.teamDesires.defend).map((lane) => {
        req.body.teamDesires.defend[lane] /= 10;
    });
    scriptBuilder += 'function UpdateDefendLaneDesires() \n';
    scriptBuilder += `    return {${teamDesires.defend.top}, ${teamDesires.defend.mid}, ${teamDesires.defend.bot}}\n`;
    scriptBuilder += 'end\n\n';

    // Creates the UpdateFarmLaneDesires function
    Object.keys(req.body.teamDesires.farm).map((lane) => {
        req.body.teamDesires.farm[lane] /= 10;
    });
    scriptBuilder += 'function UpdateFarmLaneDesires() \n';
    scriptBuilder += `    return {${teamDesires.farm.top}, ${teamDesires.farm.mid}, ${teamDesires.farm.bot}}\n`;
    scriptBuilder += 'end';

    try {
        fs.mkdirSync('./Lua');
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
    fs.writeFile('./Lua/team_desires.lua', scriptBuilder, (err) => {
        if (err) throw err;
    });
    res.status(200).send({ id: 'team_desires.lua' });
});

router.get('/download/:id([a-zA-Z0-9_\\.]+)', jwtCheck, (req, res) => {
    const file = `${__dirname}/../Lua/${req.params.id}`;

    const filename = path.basename(file);
    const mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-type', mimetype);

    const filestream = fs.createReadStream(file);
    filestream.pipe(res);
    res.download(file);
});

/** The following routes are here to quickly demonstrate how one would use sequelize.
 *  please consult the documentation for all possible options
 *  http://docs.sequelizejs.com/manual/tutorial/querying.html
 */
router.get('/example/sequelizer', (request, res) => {
    models.BotConfig.findAll({
        include: [{
            model: models.User,
            as: 'user',
        }],
    }).then((returnedModels) => {
        res.render('exampleSequelize', { title: 'Backend testing of auth0', models: returnedModels });
    });
});

router.get('/example/sequelizer/user', (request, res) => {
    models.User.findAll({
        include: [{
            model: models.BotConfig,
            as: 'botConfigs',
        }],
    }).then((returnedModels) => {
        res.render('exampleSequelize', { title: 'Backend testing of auth0', models: returnedModels });
    });
});

router.get('/example/sequelizer/user/5', (request, res) => {
    models.User.findAll({
        include: [{
            model: models.BotConfig,
            as: 'botConfigs',
        }],
        where: {
            id: 5,
        },
    }).then((returnedModels) => {
        res.render('exampleSequelize', { title: 'Backend testing of auth0', models: returnedModels });
    });
});

const { Op } = sequelize;
router.get('/example/sequelizer/user/query', (request, res) => {
    models.User.findAll({
        include: [{
            model: models.BotConfig,
            as: 'botConfigs',
        }],
        where: {
            [Op.or]: [{ id: 12 }, { id: 13 }],
            // alternatives ways (syntax) to query
            //  id: {
            //     [Op.and]: {
            //       [Op.lt]: 13,
            //       [Op.gt]: 4
            //   }
            //  },
            // firstname: {
            //   [Op.like]: 'a%'
            // }
        },
    }).then((returnedModels) => {
        res.render('exampleSequelize', { title: 'Backend testing of auth0', models: returnedModels });
    });
});

module.exports = router;
