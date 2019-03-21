const express = require('express');
const router = express.Router();
const pool = require('../database');


router.get('/pasajero', async  (req, res) => {
    const paises = await pool.query('SELECT * FROM pais');
    const pasajeros = await pool.query('SELECT * FROM pasajero');
    res.render('links/pasajero', { paises, pasajeros});
});

router.get('/boleto-previo', async  (req, res) => {
    const aeropuerto = await pool.query('SELECT * FROM aeropuerto');
    const pasajeros = await pool.query('SELECT * FROM pasajero');
    const asientos = await pool.query('SELECT * FROM clase_asiento');
    const vuelosf = await pool.query('SELECT * FROM vuelo_fecha');
    const vuelos = await pool.query('SELECT * FROM vuelo');
    const tabla = await pool.query('SELECT vuelo.numero_vuelo, vuelo.hora_llegada, vuelo.hora_salida, avion_modelo.nombre_avion_modelo, aeropuerto.nombre_aeropuerto, aeropuerto.nombre_aeropuerto FROM vuelo INNER JOIN avion_modelo ON vuelo.id_avion_modelo = avion_modelo.id_avion_modelo INNER JOIN aeropuerto ON vuelo.id_aeropuerto_llegada = aeropuerto.id_aeropuerto');
    res.render('links/boleto-previo', { aeropuerto, pasajeros, vuelosf, vuelos, tabla, asientos});
});

/* borrar factura detalle y agregar id-boleto a factura
borrar boleto detalle y agregar id-clase-asiento y id-vuelo-fecha a boleto
*/


router.post('/add-boleto', async (req, res) =>{
    const {
        id_boleto,
        numero_boleto,
        precio,
        impuesto,
        numero_asiento,
        nombre,
        equipaje, 
        id_vuelo_fecha,
        nombre_clase_asiento,
        id_aeropuerto_salida,
        id_aeropuerto_llegada,

        
    } = req.body;

    

    const pasajero = await pool.query('SELECT id_pasajero FROM pasajero WHERE nombre = ?', [nombre]);
    const idpas = pasajero[0];
    const id_pasajero = idpas["id_pasajero"];
    const asiento = await pool.query('SELECT id_clase_asiento FROM clase_asiento WHERE nombre_clase_asiento = ?', [nombre_clase_asiento]);
    const idas = asiento[0];
    const id_clase_asiento = idas["id_clase_asiento"];
    const fecha1 = await pool.query('SELECT fecha FROM vuelo_fecha WHERE id_vuelo_fecha = ?', [id_vuelo_fecha]);
    const fech = fecha1[0];
    const fecha_boleto = fech["fecha"];

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
        id_vuelo_fecha,
        id_clase_asiento,
    }
    try{
        await pool.query("INSERT INTO boleto set ?", [newBoleto]);
        req.flash('success', 'Se ha agregado un boleto con exito');
        const id_boleto = await pool.query('SELECT id_boleto FROM boleto WHERE numero_boleto = ?', [numero_boleto]);
        const fecha = await pool.query('SELECT fecha_boleto FROM boleto WHERE numero_boleto = ?', [numero_boleto]);
        const precio = await pool.query('SELECT precio FROM boleto WHERE numero_boleto = ?', [numero_boleto]);
        const impuesto = await pool.query('SELECT impuesto FROM boleto WHERE numero_boleto = ?', [numero_boleto]);
        const clientes = await pool.query('SELECT * FROM cliente');


    res.render('./links/factura', {id_boleto, fecha,  precio, impuesto, clientes});
   console.log(fecha);
    }catch(e){
     
        console.log(e);
        
    }
});
router.post('/add-boleto-previo', async (req, res) =>{
    const {
        numero_vuelo,
    } = req.body;

    
    try{
        const vuelo = await pool.query('SELECT id_vuelo FROM vuelo WHERE numero_vuelo = ?', [numero_vuelo]);
    const idvuelo = vuelo[0];
    const id_vuelo = idvuelo["id_vuelo"];
    const vuelof = await pool.query('SELECT id_vuelo_fecha FROM vuelo_fecha WHERE id_vuelo = ?', [id_vuelo]);
    const idvf = vuelof[0];
    const id_vuelo_fecha = idvf["id_vuelo_fecha"];
    const aeropt1 = await pool.query('SELECT id_aeropuerto_salida FROM vuelo WHERE numero_vuelo = ?', [numero_vuelo]);
    const aeropt2 = await pool.query('SELECT id_aeropuerto_llegada FROM vuelo WHERE numero_vuelo= ?', [numero_vuelo]);
    const fecha = await pool.query('SELECT fecha FROM vuelo_fecha WHERE id_vuelo_fecha = ?', [id_vuelo_fecha]);
    const asientos = await pool.query('SELECT * FROM clase_asiento');
    const precio = await pool.query('SELECT precio_base FROM vuelo_precio WHERE id_vuelo_fecha = ?', [id_vuelo_fecha]);
    const pasajeros = await pool.query('SELECT * FROM pasajero');


    res.render('./links/boleto', {id_vuelo_fecha, aeropt2, aeropt1, fecha, precio, pasajeros, asientos});

    }catch(e){
        console.log(e);

    }
});

router.post('/add-factura', async (req, res) =>{
    const {
        nombre,
        numero_factura,
        monto,
        id_factura,
        id_boleto, 
        impuesto,
    } = req.body;

    console.log(impuesto);
    const fecha12 = await pool.query('SELECT fecha_boleto FROM boleto WHERE id_boleto = ?', [id_boleto]);
    const fechaa = fecha12[0];
    const fecha_factura = fechaa["fecha_boleto"];
    const nombre1 = await pool.query('SELECT id_cliente FROM cliente WHERE nombre = ?', [nombre]);
    const nom = nombre1[0];
    const id_cliente = nom["id_cliente"];

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
        res.redirect('/links/boleto-previo');
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