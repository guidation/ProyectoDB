const express = require('express');
const morgan = require('morgan');   //Muestra peticiones en consola
const exhbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const sesion = require('express-session');
const bd = require('express-mysql-session');
const {database } = require('./keys');
const passport = require('passport');
const bodyParser = require('body-parser');
const validator = require('express-validator');

// iniicializacion
const app = express();
require('./lib/passport');

// settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exhbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


//middleware
app.use(sesion({
    secret: "guido",
    resave: false,
    saveUninitialized: false,
    store: new bd(database),

}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(flash());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());



//globales
app.use((req, res, next) =>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();

});

//routes
app.use(require('./routes'));
app.use(require('./routes/aunthentication'));
app.use('/links',require('./routes/links'), require('./routes/aero'), require('./routes/fly'), require('./routes/boletos'));


//publicos
app.use(express.static(path.join(__dirname, 'public')));




//servidor
app.listen(app.get('port'), () =>{
    console.log('server on port', app.get('port'));

});