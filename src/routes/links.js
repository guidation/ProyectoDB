const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', async  (req, res) => {
    const manufacturers = await pool.query('SELECT * FROM fabricante');
    const gasoline = await pool.query('SELECT * FROM tipo_combustible');
    res.render('links/add', { manufacturers, gasoline});
});

router.post('/add-manufac', async(req, res) =>{
    const {
        nombre_fabricante,
    } = req.body;
    const newFabr = {
        nombre_fabricante,
    };
    await pool.query('INSERT INTO fabricante set ?', [newFabr]);
    req.flash('success', 'Fabricante creado con exito');
    res.redirect('/links/add');
});

router.post('/add-gas', async(req, res) =>{
    const {
        nombre_tipo_combustible
    } = req.body;
    const newComb = {
        nombre_tipo_combustible
    };
    await pool.query('INSERT INTO tipo_combustible set ?', [newComb]);
    req.flash('success', 'Tipo gasolina agregado con exito');
    res.redirect('/links/add');
});




router.post('/add-model', async (req, res) => {
    const { 
        id_avion_modelo,
        nombre_avion_modelo,
        nombre_fabricante,
        nombre_tipo_combustible,
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
         } = req.body;
    
    const fabricante = await pool.query("SELECT id_fabricante FROM fabricante WHERE nombre_fabricante = ?", [nombre_fabricante]);
    const fab = fabricante[0];
    const id_fabricante = fab["id_fabricante"];
    const combustible = await pool.query("SELECT id_tipo_combustible FROM tipo_combustible WHERE nombre_tipo_combustible = ?", [nombre_tipo_combustible]);
    const comb = combustible[0];
    const id_tipo_combustible = comb["id_tipo_combustible"];

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
   
        await pool.query('INSERT INTO avion_modelo set ?', [newLink]);
        req.flash('success', 'Link Saved Successfully');
        res.redirect('/links');
    
});

router.get('/',  async (req, res) => {
    const fabricantes = await pool.query('SELECT * FROM fabricante');
    const modelos = await pool.query('SELECT * FROM avion_modelo');
    const gasolina = await pool.query('SELECT * FROM tipo_combustible');
    res.render('links/list', { fabricantes, modelos, gasolina });
});

router.get('/delete-fabricantes/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM fabricante WHERE id_fabricante = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links');
});

router.get('/edit-fabricantes/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM fabricante WHERE id_fabricante = ?', [id]);
    console.log(links);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit-fabricantes/:id',async (req, res) => {
    const { id } = req.params;
    const { nombre_fabricante } = req.body; 
    const newFab = {
        nombre_fabricante,
    };
    await pool.query('UPDATE fabricante set ? WHERE id_fabricante = ?', [newFab, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/links');
});

module.exports = router;