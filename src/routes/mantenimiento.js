const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

//Aviones Mantenimiento

router.get('/mantenimiento', async (req, res) => {
    const avion = await pool.query('SELECT * FROM avion');
    const tipo_mantenimiento = await pool.query('SELECT * FROM tipo_mantenimiento');
    res.render('./links/mantenimiento', { avion, tipo_mantenimiento });
});

router.post('/mantenimiento-save', async (req, res) => {
    const {
        matricula_avion,
        nombre_mantenimiento,
        fecha_inicio,
        fecha_final,
        observacion
    } = req.body;
    const avion = await pool.query("SELECT id_avion FROM avion WHERE matricula_avion = ?", [matricula_avion]);
    const ave = avion[0];
    const id_avion = ave["id_avion"];

    const tipo_mantenimiento = await pool.query("SELECT id_mantenimiento FROM tipo_mantenimiento WHERE nombre_mantenimiento = ?", [nombre_mantenimiento]);
    const mant = tipo_mantenimiento[0];
    const id_tipo_mantenimiento = mant["id_mantenimiento"];

    const newMantenimiento = {
        id_avion,
        id_tipo_mantenimiento,
        fecha_inicio,
        fecha_final,
        observacion
    }
    try {
        await pool.query('INSERT INTO mantenimiento set ?', [newMantenimiento]);
        req.flash('success', 'Se agrego un avion a mantenimiento');
        res.redirect('/links/mantenimiento');
    }
    catch (e) {
        req.flash('success', 'ERROR: El avion no pudo ser agregado al mantenimiento con exito');
        res.redirect('/links/mantenimiento');
        console.log(e);
    }
});




module.exports = router;