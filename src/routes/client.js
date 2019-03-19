const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

//clientes

router.get('/client', async (req, res) => {
    const ciudad = await pool.query('SELECT * FROM ciudad');
    res.render('./links/client', { ciudad });
});

router.post('/client-create', async (req, res) => {
    const {
        cedula,
        nombre,
        apellido,
        correo_electronico,
        direccion,
        nombre_ciudad,
        numero_telefono
    } = req.body;
    const city = await pool.query('SELECT id_ciudad FROM ciudad WHERE nombre_ciudad = ?', [nombre_ciudad]);
    const cit = city[0];
    const id_ciudad = cit["id_ciudad"];
    const newCliente = {
        cedula,
        nombre,
        apellido,
        correo_electronico,
        direccion,
        id_ciudad,
        numero_telefono
    }
    try {
        await pool.query('INSERT INTO cliente set ?', [newCliente]);
        req.flash('success', 'Se agrego con exito un cliente');
        res.redirect('/links/client');
    }
    catch (e) {
        req.flash('success', 'ERROR: Cliente no pudo ser agregado con exito');
        res.redirect('/links/client');
        console.log(e);
    }
});


module.exports = router;