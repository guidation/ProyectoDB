const express = require('express');
const router = express.Router();
const pool = require('../database');


router.get('/manifiestoc', async  (req, res) => {
    const vuelof = await pool.query('SELECT * FROM vuelo');
    res.render('links/manifiestoc', { vuelof});
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

module.exports = router;