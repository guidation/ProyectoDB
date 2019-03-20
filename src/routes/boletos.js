const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/pasajero', async  (req, res) => {
    const paises = await pool.query('SELECT * FROM pais');
    const pasajeros = await pool.query('SELECT * FROM pasajero');
    res.render('links/pasajero', { paises, pasajeros});
});

router.get('/boleto', async  (req, res) => {
    const aeropuerto = await pool.query('SELECT * FROM aeropuerto');
    const pasajeros = await pool.query('SELECT * FROM pasajero');
    const vuelosf = await pool.query('SELECT * FROM vuelo_fecha');
    const vuelos = await pool.query('SELECT * FROM vuelo');
    const clientes = await pool.query('SELECT * FROM cliente'); 
    res.render('links/boleto', { aeropuerto, pasajeros, vuelosf, vuelos, clientes});
});


/* borrar factura detalle y agregar id-boleto a factura
borrar boleto detalle y agregar id-clase-asiento y id-vuelo-fecha a boleto
*/


router.post('/add-boleto', async (req, res) =>{
    const {
        id_boleto,
        numero_boleto,
        fecha_boleto,
        precio,
        impuesto,
        numero_asiento,
        nombre,
        nombre_aeropuerto_llegada,
        nombre_aeropuerto_salida,
        equipaje, 
        nombre_vuelo_fecha,
        tipo_asiento,
    } = req.body;

    

    const pasajero = await pool.query('SELECT id_pasajero FROM pasajero WHERE nombre = ?', [nombre]);
    const idpas = pasajero[0];
    const id_pasajero = idpas["id_pasajero"];
    const aeropuerto = await pool.query('SELECT id_aeropuerto FROM aeropuerto WHERE nombre_aeropuerto = ?', [nombre_aeropuerto_llegada]);
    const aeropuerto2 = await pool.query('SELECT id_aeropuerto FROM aeropuerto WHERE nombre_aeropuerto = ?', [nombre_aeropuerto_salida]);
    const ida = aeropuerto[0];
    const ida2 = aeropuerto2[0];
    const id_aeropuerto_llegada = ida["id_aeropuerto"];
    const id_aeropuerto_salida = ida2["id_aeropuerto"];
   

    const newBoleto = {
        id_pasajero,
        id_boleto,
        numero_boleto,
        fecha_boleto,
        precio,
        impuesto,
        numero_asiento,
        id_aeropuerto_salida,
        id_aeropuerto_llegada,
        equipaje, 
        nombre_vuelo_fecha,
        tipo_asiento,
    }
    try{
        await pool.query("INSERT INTO boleto set ?", [newBoleto]);
        req.flash('success', 'Se ha agregado un boleto con exito');
        res.redirect('/links/boleto');
    }catch(e){
        console.log(e);
    }
});


router.post('/add-factura', async (req, res) =>{
    const {
        id_boleto,
        numero_factura,
        fecha_factura,
        monto,
        impuesto,
        id_factura,
        id_cliente,
    } = req.body;

    const newFactura = {
        id_boleto,
        numero_factura,
        fecha_factura,
        monto,
        impuesto,
        id_factura,
        id_cliente,
    }
    try{
        await pool.query("INSERT INTO factura set ?", [newFactura]);
        req.flash('success', 'Se ha agregado una factura con exito');
        res.redirect('/links/boleto');
    }catch(e){
        console.log(e);
    }
});

router.post('/add-pasajero', async (req, res) =>{
    const {
        id_pasajero,
        nombre,
        apellido,
        sexo,
        numero_pasaporte,
        fecha_nacimiento,
        nombre_pais,
    } = req.body;

    const pais = await pool.query('SELECT id_pais FROM pais WHERE nombre_pais = ?', [nombre_pais]);
    const idp = pais[0];
    const id_pais = idp["id_pais"];
   

    const newPasajero = {
        id_pasajero,
        nombre,
        apellido,
        sexo,
        id_pais,
        numero_pasaporte,
        fecha_nacimiento,
    }
    try{
        await pool.query("INSERT INTO pasajero set ?", [newPasajero]);
        req.flash('success', 'Se ha agregado un pasajero con exito');
        res.redirect('/links/pasajero');
    }catch(e){
        console.log(e);
    }
});



module.exports = router;