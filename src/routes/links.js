const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add',  (req, res) => {
    res.render('links/add');
});





router.post('/add', async (req, res) => {
    const { 
        nombre_tipo_combustible,
        id_tipo_combustible,
        id_avion_modelo,
        nombre_avion_modelo,
        velocidad_maxima,
        velocidad_crucero,
        peso_vacion, 
        peso_maximo,
        carga_maxima_cabina ,
        carga_maxima_equipaje ,
        distancia_despegue_con_carga_maxima,
        tripulacion,
        capacidad_combustible, 
        bano,
        salida_emergencia,
        nombre_fabricante,
        id_fabricante,
         } = req.body;
    
    const newComb = {
        
        nombre_tipo_combustible,
        id_tipo_combustible,
    };
    
    const newFabr = {
        nombre_fabricante,
        id_fabricante,
    };
   
    
    const newLink = {
        id_avion_modelo,
        nombre_avion_modelo,
        id_fabricante,
        velocidad_maxima,
        velocidad_crucero,
        peso_vacion, 
        peso_maximo,
        carga_maxima_cabina ,
        carga_maxima_equipaje ,
        distancia_despegue_con_carga_maxima,
        tripulacion,
        id_tipo_combustible,
        capacidad_combustible, 
        bano,
        salida_emergencia
    };
    
    await pool.query('INSERT INTO fabricante set ?', [newFabr]);
    await pool.query('INSERT INTO tipo_combustible set ?', [newComb]);
    await pool.query('INSERT INTO avion_modelo set ?', [newLink]);
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/links');
});

router.get('/',  async (req, res) => {
    const links = await pool.query('SELECT * FROM avion_modelo');
    res.render('links/list', { links });
});

router.get('/delete/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links1 WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links1 WHERE id = ?', [id]);
    console.log(links);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links1 set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/links');
});

module.exports = router;