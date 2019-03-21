const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

//Alquilar Aviones
router.get('/alquiler', async (req, res) => {
    res.render('links/alquiler', { model, state, plane });
});

module.exports = router;