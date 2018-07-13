const express = require('express');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const { jwtCheck } = require('./jwtCheck');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    if (req.user) {
        res.redirect('/user');
        return;
    }
    res.render('index', { title: 'Backend testing of auth0' });
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/failure', (req, res) => {
    const error = req.flash('error');
    const errorDescription = req.flash('error_description');
    req.logout();
    res.render('failure', {
        error: error[0],
        errorDescription: errorDescription[0],
    });
});

router.get('/test', (request, response) => {
    response.status(500).send({ message: 'This is an error response' });
});

router.get('/download/:id([a-zA-Z0-9_\\.]+)', (req, res) => {
    const file = `${__dirname}/../Lua/${req.params.id}.zip`;

    const filename = path.basename(file);
    const mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-type', mimetype);

    const filestream = fs.createReadStream(file);
    filestream.pipe(res);
    res.download(file);
});

/* just to test request and via its details */
router.get('/testAuthentication', jwtCheck, (request, response) => {
    response.status(500).send({ message: 'you have been sucessfully authenticated' });
});

module.exports = router;