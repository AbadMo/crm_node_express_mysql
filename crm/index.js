//# dependencies
const session = require('express-session'); //import express-session dependency as session
const bodyParser = require('body-parser'); //import body-parser dependency as bodyParser
const express = require('express'); //import express dependency as express
let conn = require('./keys.js'); //declare conn variable to require file mysql.js
const morgan = require('morgan');
const path = require('path');
const validator = require('express-validator');
var expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);

const { database } = require('./keys');
// Intializations
const app = express(); //declare app variable as express
require('./lib/passport');
//# settings
//environment settings & db connect
// Settings
app.set('port', process.env.PORT || 9090);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //set web templating engine as ejs
app.use(express.static('public')); //set public as the css/js express static folder
// Middlewares
app.use(morgan('dev'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(
  session({             //initialize session to be used with specified settings
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());
// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});

/*Routes */
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));
app.use('/admin', require('./routes/admin'));
// Public
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.send('404 - Page not found'); //set other unknown pages as 404
});


//# middleware port
// Starting
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});
