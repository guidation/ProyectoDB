const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');



router.get('/vuelos', async(req, res)=>{
    const aeropuerto = await pool.query('SELECT * FROM aeropuerto');
    const modelo = await pool.query('SELECT * FROM avion_modelo');
    const vuelo = await pool.query('SELECT * FROM vuelo');
    const tabla = await pool.query('SELECT vuelo.numero_vuelo, vuelo.hora_llegada, vuelo.hora_salida, avion_modelo.nombre_avion_modelo, aeropuerto.nombre_aeropuerto, aeropuerto.nombre_aeropuerto FROM vuelo INNER JOIN avion_modelo ON vuelo.id_avion_modelo = avion_modelo.id_avion_modelo INNER JOIN aeropuerto ON vuelo.id_aeropuerto_llegada = aeropuerto.id_aeropuerto');
    res.render('./links/vuelos', {aeropuerto, modelo, vuelo, tabla});
});

router.get('/vuelo-fecha', async(req, res)=>{
    const avion = await pool.query('SELECT avion.matricula_avion, avion_modelo.nombre_avion_modelo FROM avion INNER JOIN avion_modelo ON avion.id_avion_modelo = avion_modelo.id_avion_modelo');
    const vuelo = await pool.query('SELECT * FROM vuelo');
    const tabla = await pool.query('SELECT vuelo.numero_vuelo, vuelo.hora_llegada, vuelo.hora_salida, avion_modelo.nombre_avion_modelo, aeropuerto.nombre_aeropuerto, aeropuerto.nombre_aeropuerto FROM vuelo INNER JOIN avion_modelo ON vuelo.id_avion_modelo = avion_modelo.id_avion_modelo INNER JOIN aeropuerto ON vuelo.id_aeropuerto_llegada = aeropuerto.id_aeropuerto');

    res.render('./links/vuelo-fecha', { avion, vuelo, tabla});
});

router.post('/add-vuelo-fecha', async (req, res) =>{
    const {
        fecha,
        porcentaje_sobreventa,
        peso_vuelo,
        matricula_avion,
        numero_vuelo
    } = req.body;

    const avion = await pool.query("SELECT id_avion FROM avion WHERE matricula_avion = ?", [matricula_avion]);
    const ave = avion[0];
    const id_avion = ave["id_avion"];
    const vuelo = await pool.query("SELECT id_vuelo FROM vuelo WHERE numero_vuelo = ?", [numero_vuelo]);
    const vue = vuelo[0];
    const id_vuelo = vue["id_vuelo"];

    console.log(id_avion);

    const newFD ={
        fecha,
        porcentaje_sobreventa,
        peso_vuelo,
        id_avion,
        id_vuelo
    }
    try{
        await pool.query('INSERT INTO vuelo_fecha set ?', [newFD]);
        req.flash('success','Se agrego exitosamente una fecha de vuelo.');
        res.redirect('/links/vuelo-fecha');
    }
    catch(e){
        req.flash('success','No se pudo agregar una fecha de vuelo.');
        res.redirect('/links/vuelo-fecha');
        console.log(e);
    }
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

    const dur = hora_llegada - hora_salida;
    const origen = await pool.query("SELECT id_aeropuerto FROM aeropuerto WHERE nombre_aeropuerto = ?", [nombre_aeropuerto1]);
    const ori = origen[0];
    const id_aeropuerto_salida = ori["id_aeropuerto"];
    const destino = await pool.query("SELECT id_aeropuerto FROM aeropuerto WHERE nombre_aeropuerto = ?", [nombre_aeropuerto2]);
    const dest = destino[0];
    const id_aeropuerto_llegada = dest["id_aeropuerto"];
    const avion = await pool.query("SELECT id_avion_modelo FROM avion_modelo WHERE nombre_avion_modelo = ?", [nombre_avion_modelo]);
    const ave = avion[0];
    const id_avion_modelo = ave["id_avion_modelo"];

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