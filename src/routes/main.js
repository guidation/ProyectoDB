const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/reportes', async(req,res) =>{
    try{
        const pvendidos = await pool.query('SELECT COUNT(id_boleto) from boleto; ');
        const pven = pvendidos[0];
        const ven = pven['COUNT(id_boleto)'];
        const visitado = await pool.query('SELECT COUNT(boleto.id_aeropuerto_salida), aeropuerto.nombre_aeropuerto, boleto.id_boleto FROM boleto INNER JOIN aeropuerto ON boleto.id_aeropuerto_llegada = aeropuerto.id_aeropuerto GROUP by boleto.id_aeropuerto_llegada ORDER BY COUNT(boleto.id_aeropuerto_salida) DESC;');
        const vis = visitado[0];
        const xxx = vis['COUNT(boleto.id_aeropuerto_salida)'];
        const pesoPromedio = await pool.query('SELECT AVG(peso_vuelo) FROM vuelo_fecha;');
        const pesoProm = pesoPromedio[0];
        const peso = pesoProm['AVG(peso_vuelo)'];
        const originado = await pool.query('SELECT COUNT(boleto.id_aeropuerto_llegada), aeropuerto.nombre_aeropuerto, boleto.id_boleto FROM boleto INNER JOIN aeropuerto ON boleto.id_aeropuerto_llegada = aeropuerto.id_aeropuerto GROUP by boleto.id_aeropuerto_llegada ORDER BY COUNT(boleto.id_aeropuerto_salida) DESC;');
        const mostU = await pool.query("SELECT COUNT(avion.id_avion), avion.matricula_avion FROM vuelo_fecha INNER JOIN avion ON vuelo_fecha.id_avion = avion.id_avion GROUP BY avion.matricula_avion ORDER BY ( COUNT(avion.id_avion)) DESC;");
        const most = mostU[0];
        const numMAS = most['COUNT(avion.id_avion)'];
        const matMAS = most['matricula_avion'];
        const leastU = await pool.query("SELECT COUNT(avion.id_avion), avion.matricula_avion FROM vuelo_fecha INNER JOIN avion ON vuelo_fecha.id_avion = avion.id_avion GROUP BY avion.matricula_avion ORDER BY ( COUNT(avion.id_avion)) ASC;");
        const least = leastU[0];
        const numMIN = least['COUNT(avion.id_avion)'];
        const matMIN = least['matricula_avion'];
        const sobreVent = await pool.query("SELECT COUNT(porcentaje_sobreventa) FROM vuelo_fecha WHERE porcentaje_sobreventa > 0;");
        const  svent = sobreVent[0];
        const sv = svent['COUNT(porcentaje_sobreventa)'];
        const numVuelos = await pool.query("SELECT COUNT(id_vuelo_fecha) FROM vuelo_fecha;");
        const numv = numVuelos[0];
        const nv = numv['COUNT(id_vuelo_fecha)'];
        const promedio = sv/nv*100;
    

        res.render('./links/reportes', {ven, visitado, peso, originado, numMAS, matMAS, numMIN, matMIN, sv, promedio});
    }catch(e){
        console.log(e);
    }
});

router.post('/ver-ganancias', async(req,res) =>{
    const {
        fecha_inicio,
        fecha_final
    } = req.body;
    try{
        console.log(fecha_inicio);
        const dates = await pool.query("SELECT SUM(precio) FROM boleto WHERE fecha_boleto between ? and DATE_ADD(?, INTERVAL 1 day)",[fecha_inicio, fecha_final]);
        const dat = dates[0];
        const fechagan = dat['SUM(precio)'];
        
        res.render('./links/ganancias', {fechagan});
        
        console.log(fechagan);
    }catch(e){
        console.log(e);
        res.redirect('/links/reportes');
    }
    
});
module.exports = router;