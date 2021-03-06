const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

//aviones
router.get('/aviones', async  (req, res) => {
    const model = await pool.query('SELECT * FROM avion_modelo');
    const state = await pool.query('SELECT * FROM avion_estado');
    const plane = await pool.query('SELECT avion.id_avion, avion.matricula_avion, avion_estado.nombre_estado FROM avion INNER JOIN avion_estado ON avion.id_avion_estado = avion_estado.id_avion_estado;');

    res.render('links/aviones', { model, state, plane});
});
router.post('/aviones-add', async (req, res) =>{
    const {
        matricula_avion,
        es_alquilado,
        nombre_avion_modelo,
        nombre_estado
    } = req.body;

    const model = await pool.query('SELECT id_avion_modelo FROM avion_modelo WHERE nombre_avion_modelo = ?', [nombre_avion_modelo]);
    const mod = model[0];
    const id_avion_modelo = mod["id_avion_modelo"];
    const state = await pool.query('SELECT id_avion_estado FROM avion_estado WHERE nombre_estado = ?', [nombre_estado]);
    const sta = state[0];
    const id_avion_estado = sta["id_avion_estado"];

    const newPlane = {
        matricula_avion,
        es_alquilado,
        id_avion_estado,
        id_avion_modelo
    }
    try{
        await pool.query("INSERT INTO avion set ?", [newPlane]);
        req.flash('success', 'Se ha agregado un avion con exito');
        res.redirect('/links/aviones');
    }catch(e){
        console.log(e);
    }
});
router.get('/delete-avion/:id', async(req, res) =>{
    const {id} = req.params;
    try{
        await pool.query('DELETE FROM avion WHERE id_avion = ?', [id]);
        req.flash('success','Se elimino con exito el avion');
        res.redirect('/links/aviones');
    }catch(e)
    {
        req.flash('success','No se pudo eliminar el avion en estos momentos');
        res.redirect('/links/aviones');
    }
});

//modelos avion, fabricantes y gasolina
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
router.get('/delete-modelos/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM avion_modelo WHERE id_avion_modelo = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links');
});
router.get('/delete-combustible/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM tipo_combustible WHERE id_tipo_combustible = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links');
});

router.get('/edit-fabricantes/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM fabricante WHERE id_fabricante = ?', [id]);
    console.log(links);
    res.render('links/edit', {link: links[0]});
});
router.get('/edit-avion/:id', async (req, res) => {
    const { id } = req.params;
    const modAvion = await pool.query('SELECT * FROM avion_estado');
    res.render('links/edit-plane', {modAvion,id});
});
router.post('/edit-avion/:id', async (req, res) => {
    const { id } = req.params;
    const {
        nombre_estado
    } = req.body;
    const state = await pool.query('SELECT id_avion_estado FROM avion_estado WHERE nombre_estado = ?', [nombre_estado]);
    const sta = state[0];
    const id_avion_estado = sta["id_avion_estado"];
    const newPla = {
        id_avion_estado
    }
    try{
        await pool.query('UPDATE avion set ? WHERE id_avion = ?', [newPla, id]);
    req.flash('success', 'Modificacion exitosa');
    res.redirect('/links/aviones');
    }catch(e){
        console.log(e);
        req.flash('success', 'No se pudo cambiar');
    res.redirect('/links/aviones');
    }
    

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