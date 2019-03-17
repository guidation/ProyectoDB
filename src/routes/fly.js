const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/vuelos', async(req, res)=>{
    const aeropuerto = await pool.query('SELECT * FROM aeropuerto');
    const modelo = await pool.query('SELECT * FROM avion_modelo');
    const vuelo = await pool.query('SELECT * FROM vuelo');
    res.render('./links/vuelos', {aeropuerto, modelo, vuelo});
});

router.post('/add-vuelo', async(req,res) => {
    const {
        numero_vuelo,
        hora_salida,
        hora_llegada,
        duracion_en_minutos,
        distancia_en_millas,
        nombre_aeropuerto1,
        nombre_aeropuerto2,
        nombre_avion_modelo
    } = req.body;

    const origen = await pool.query("SELECT id_aeropuerto FROM aeropuerto WHERE nombre_aeropuerto = ?", [nombre_aeropuerto1]);
    const ori = origen[0];
    const id_aeropuerto_salida = ori["id_aeropuerto"];
    const destino = await pool.query("SELECT id_aeropuerto FROM aeropuerto WHERE nombre_aeropuerto = ?", [nombre_aeropuerto2]);
    const dest = destino[0];
    const id_aeropuerto_llegada = ori["id_aeropuerto"];
    const avion = await pool.query("SELECT id_avion_modelo FROM avion_modelo WHERE nombre_avion_modelo = ?", [nombre_avion_modelo]);
    const ave = avion[0];
    const id_avion_modelo = ave["id_avion_modelo"];

    console.log( hora_salida);
    console.log( hora_llegada);
    console.log( id_aeropuerto_llegada);

    const newFlight = {
        numero_vuelo,
        hora_salida,
        hora_llegada,
        duracion_en_minutos,
        distancia_en_millas,
        id_aeropuerto_salida,
        id_aeropuerto_llegada,
        id_avion_modelo
    }

    try{
        await pool.query('INSERT INTO vuelo set ?', [newFlight]);
        req.flash('success','Se agrego vuelo de manera exitosa.');
        res.redirect('/links/vuelos');
    }catch(e){
        req.flash('success','No se pudo agregar el vuelo en este momento.');
        res.redirect('/links/vuelos');
        console.log(e);
    }
});

module.exports = router;