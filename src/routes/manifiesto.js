const express = require('express');
const router = express.Router();
const pool = require('../database');


router.get('/manifiestoc', async  (req, res) => {
    const vuelof = await pool.query('SELECT * FROM vuelo');
    res.render('links/manifiestoc', { vuelof});
});

router.get('/manifiestod', async  (req, res) => {
    const vuelof = await pool.query('SELECT * FROM vuelo');
    const api = await pool.query('SELECT * FROM aeropuerto');
    const avion = await pool.query('SELECT id_avion FROM avion WHERE es_alquilado = 1');
    const chart = await pool.query('SELECT * FROM proveedor_charter');
    const tabla = await pool.query('SELECT vuelo.numero_vuelo, vuelo.hora_llegada, vuelo.hora_salida, avion_modelo.nombre_avion_modelo, aeropuerto.nombre_aeropuerto, aeropuerto.nombre_aeropuerto FROM vuelo INNER JOIN avion_modelo ON vuelo.id_avion_modelo = avion_modelo.id_avion_modelo INNER JOIN aeropuerto ON vuelo.id_aeropuerto_llegada = aeropuerto.id_aeropuerto');
    res.render('links/manifiestod', { vuelof, api, avion, chart, tabla});
});


router.post('/add-manifiestocancel', async (req, res) =>{
    const {
        fecha_cancelacion,
        id_manifiesto_cancelacion,
        numero_vuelo,
        motivo_cancelacion,
        
    } = req.body;

    

    const idv = await pool.query('SELECT id_vuelo FROM vuelo WHERE numero_vuelo = ?', [numero_vuelo]);
    const idvv = idv[0];
    const id_vuelo_cancelado = idvv["id_vuelo"];
    

    const newManifiestoc = {
        fecha_cancelacion,
        id_manifiesto_cancelacion,
        motivo_cancelacion,
        id_vuelo_cancelado,
    }
    try{
        await pool.query("INSERT INTO manifiesto_cancelacion set ?", [newManifiestoc]);
        req.flash('success', 'Se ha agregado un manifiesto de cancelacion con exito');


    res.render('./links/reportes');
    }catch(e){
     
        console.log(e);
        
    }
});

router.post('/add-manifiestodesvio', async (req, res) =>{
    const {
        fecha_desvio,
        id_manifiesto_desvio,
        numero_vuelo,
        motivo_desvio,
        nombre_aeropuerto,
        nombre_proveedor_charter,
        id_avion,
    } = req.body;

    
    console.log(nombre_aeropuerto);
    const idv = await pool.query('SELECT id_vuelo FROM vuelo WHERE numero_vuelo = ?', [numero_vuelo]);
    const idvv = idv[0];
    const id_vuelo_desviado = idvv["id_vuelo"];
    
    const ial = await pool.query('SELECT id_aeropuerto FROM aeropuerto WHERE nombre_aeropuerto = ?', [nombre_aeropuerto]);
    const ial2 = ial[0];
    const id_aeropuerto_desvio = ial2["id_aeropuerto"];


    const npc = await pool.query('SELECT id_proveedor_charter FROM proveedor_charter WHERE nombre_proveedor_charter = ?', [nombre_proveedor_charter]);
    const npc2 = npc[0];
    const id_proveedor_charter= npc2["id_proveedor_charter"];
 
    const newManifiestod = {
        fecha_desvio,
        id_manifiesto_desvio,
        id_vuelo_desviado,
        motivo_desvio,
        id_aeropuerto_desvio,
        id_proveedor_charter,
        id_avion,
    }
    try{
        await pool.query("INSERT INTO manifiesto_desvio set ?", [newManifiestod]);
        req.flash('success', 'Se ha agregado un manifiesto de desvio con exito');


    res.render('./links/reportes');
    }catch(e){
     
        console.log(e);
        
    }
});

module.exports = router;