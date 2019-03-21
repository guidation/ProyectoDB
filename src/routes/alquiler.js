const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

//Alquilar Aviones

router.get('/alquiler', async (req, res) => {
    const modelo = await pool.query('SELECT * FROM avion_modelo');
    const proveedor = await pool.query('SELECT * FROM  proveedor_charter');
    res.render('links/alquiler', { modelo, proveedor });
});

router.post('/crear-proveedor', async (req, res) => {
    const {
        nombre_proveedor_charter,
        tiempo_respuesta
    } = req.body;
    const newProveedor = {
        nombre_proveedor_charter,
        tiempo_respuesta
    };
    try {
        await pool.query('INSERT INTO proveedor_charter set ?', [newProveedor]);
        req.flash('success', 'Proveedor agregado con exito');
        res.redirect('/links/alquiler');
    } catch (e) {
        req.flash('success', 'ERROR: Proveedor no pudo ser agregado con exito');
        res.redirect('/links/alquiler');
        console.log(e);
    }

});

router.post('/alquilar-avion', async (req, res) => {
    const {
        nombre_proveedor_charter,
        nombre_avion_modelo,
        matricula_avion,
        precio_por_distancia
    } = req.body;

    const proveedor = await pool.query('SELECT id_proveedor_charter FROM proveedor_charter WHERE nombre_proveedor_charter = ?', [nombre_proveedor_charter]);
    const prov = proveedor[0];
    const id_proveedor_charter = prov["id_proveedor_charter"];

    const modelo = await pool.query('SELECT id_avion_modelo FROM avion_modelo WHERE nombre_avion_modelo = ?', [nombre_avion_modelo]);
    const mod = modelo[0];
    const id_avion_modelo = mod["id_avion_modelo"];

    const es_alquilado = 1;
    const id_avion_estado = 1;

    const NewAvion = {
        id_avion_modelo,
        matricula_avion,
        es_alquilado,
        id_avion_estado
    }

    try{
        await pool.query('INSERT INTO avion set ?', [NewAvion]);
    } catch (e) {
        req.flash('success', 'ERROR: Avion no pudo ser agregado con exito');
        res.redirect('/links/alquiler');
        console.log(e);
    }

    const avion = await pool.query('SELECT id_avion FROM avion WHERE matricula_avion = ?', [matricula_avion]);
    const avn = avion[0];
    const id_avion = avn["id_avion"];

    const newAvionProveedor = {
        id_avion,
        id_proveedor_charter,
        precio_por_distancia
    }

    try {
        await pool.query('INSERT INTO avion_proveedor set ?', [newAvionProveedor]);
        req.flash('success', 'Se alquilo con exito un Avion');
        res.redirect('/links/alquiler');
    }
    catch (e) {
        req.flash('success', 'ERROR: Avion no pudo ser alquilado con exito');
        res.redirect('/links/client');
        console.log(e);
    }
});
module.exports = router;