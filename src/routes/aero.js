const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

////Aeropuertos
router.get('/aeropuertos', async  (req, res) => {
    const pais = await pool.query('SELECT * FROM pais');
    const ciudad = await pool.query('SELECT * FROM ciudad');
    const aeropuerto = await pool.query('SELECT * FROM aeropuerto');
    res.render('links/aeropuertos', { pais, ciudad, aeropuerto });
});
router.get('/ver-aeropuertos', async  (req, res) => {
    const pais = await pool.query('SELECT * FROM pais');
    const ciudad = await pool.query('SELECT * FROM ciudad');
    const aeropuerto = await pool.query('SELECT * FROM aeropuerto');
    const pistas = await pool.query('SELECT * FROM pista_aterrizaje');
    res.render('links/ver-aeropuertos', { pais, ciudad, aeropuerto });
});
router.get('/delete-pais/:id', async (req, res) => {
    const { id } = req.params;
    try{
        await pool.query('DELETE FROM pais WHERE id_pais = ?', [id]);
        req.flash('success', 'Link Removed Successfully');
        res.redirect('/links/ver-aeropuertos');
    }
    catch(e){
        req.flash('success', 'No se puede borrar un pais si existe referencia a una ciudad dentro del mismo.');
        res.redirect('/links/ver-aeropuertos');
    }
});
router.get('/delete-ciudad/:id', async (req, res) => {
    const { id } = req.params;
    try{
        await pool.query('DELETE FROM ciudad WHERE id_ciudad = ?', [id]);
        req.flash('success', 'Link Removed Successfully');
        res.redirect('/links/ver-aeropuertos');
    }
    catch(e){
        req.flash('success', 'No se puede borrar una ciudad si existe referencia a un aeropuerto dentro de la misma.');
        res.redirect('/links/ver-aeropuertos');
    }
});
router.get('/delete-aeropuerto/:id', async (req, res) => {
    const { id } = req.params;
    try{
        await pool.query('DELETE FROM aeropuerto WHERE id_aeropuerto = ?', [id]);
        req.flash('success', 'Link Removed Successfully');
        res.redirect('/links/ver-aeropuertos');
    }
    catch(e){
        req.flash('success', 'No se puede borrar el aeropuerto ahora mismo.');
        res.redirect('/links/ver-aeropuertos');
    }
});

router.post('/aeropuertos-pais', async(req, res) =>{
    const {
        nombre_pais,
        codigo_iata_pais
    } =req.body;
    const newCountry = { 
        codigo_iata_pais,
        nombre_pais 
    };
    try{
        await pool.query('INSERT INTO pais set ?', [newCountry]);
        req.flash('success', 'Pais agregado con exito');
        res.redirect('/links/aeropuertos');
    } catch (e){
        req.flash('success','ERROR: Pais no pudo ser agregado con exito');
        res.redirect('/links/aeropuertos');
        console.log(e);
    }
    
});
router.post('/aeropuertos-ciudad', async(req, res) =>{
    const {
        nombre_ciudad,
        codigo_iata_ciudad,
        nombre_pais
    } =req.body;

    const country = await pool.query("SELECT id_pais FROM pais WHERE nombre_pais = ?", [nombre_pais]);
    const count = country[0];
    const id_pais = count["id_pais"];

    const newCity = { 
        codigo_iata_ciudad,
        nombre_ciudad,
        id_pais 
    };
    try{
        await pool.query('INSERT INTO ciudad set ?', [newCity]);
        req.flash('success', 'Ciudad agregada con exito');
        res.redirect('/links/aeropuertos');
    } catch (e){
        req.flash('success','ERROR: Ciudad no pudo ser agregada con exito');
        res.redirect('/links/aeropuertos');
        console.log(e);
    }
    
});
router.post('/aeropuertos-aeropuerto', async(req, res) =>{
    const {
        nombre_aeropuerto,
        codigo_iata_aeropuerto,
        nombre_ciudad
    } = req.body;
    const city = await pool.query('SELECT id_ciudad FROM ciudad WHERE nombre_ciudad = ?', [nombre_ciudad]);
    const cit = city[0];
    const id_ciudad = cit["id_ciudad"];
    const newAirport = {
        nombre_aeropuerto,
        codigo_iata_aeropuerto,
        id_ciudad
    }
    try{
        await pool.query('INSERT INTO aeropuerto set ?', [newAirport]);
        req.flash('success', 'Se agrego con exito un aeropuerto');
        res.redirect('/links/aeropuertos');
    }
    catch(e){
        req.flash('success','ERROR: Aeropuerto no pudo ser agregado con exito');
        res.redirect('/links/aeropuertos');
        console.log(e);
    }
});
router.post('/aeropuertos-pista', async(req, res) =>{
    const {
        nombre_pista_aterrizaje,
        longitud_pista_aterrizaje,
        nombre_aeropuerto
    } = req.body;
    const airport = await pool.query('SELECT id_aeropuerto FROM aeropuerto WHERE nombre_aeropuerto = ?', [nombre_aeropuerto]);
    const aero = airport[0];
    const id_aeropuerto = aero["id_aeropuerto"];
    const newTrack = {
        nombre_pista_aterrizaje,
        longitud_pista_aterrizaje,
        id_aeropuerto
    }
    try{
        await pool.query('INSERT INTO pista_aterrizaje set ?', [newTrack]);
        req.flash('success', 'Se agrego con exito una pista');
        res.redirect('/links/aeropuertos');
    }
    catch(e){
        req.flash('success','ERROR: Pista no pudo ser agregada con exito');
        res.redirect('/links/aeropuertos');
        console.log(e);
    }
});


module.exports = router;