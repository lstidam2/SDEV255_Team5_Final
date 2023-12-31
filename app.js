const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const classRoutes = require('./routes/classRoutes')
const authRoutes= require('./routes/authRoutes')
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser, instructorOnly} = require('./middleware/authMiddleware')

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = 'mongodb+srv://test:test123@cluster0.9mvksbm.mongodb.net/node-tuts'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});
app.use(express.json());
app.use(cookieParser());

// routes

//auth routes


app.get('*', checkUser);
app.get('/', (req, res) => {
  res.redirect('/classes');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});


app.get('/login', (req, res)=>{
  res.render('login', {title: 'Login'})
})

app.get('/signup', (req, res)=>{
  res.render('signup', {title: 'Signup'})
})

app.get('/classes/create', instructorOnly, (req,res)=>{
  res.render('classes/create', {title: "create class"})
})

app.get('/classes/cart', (req, res)=>{
  res.render('classes/cart', {title: "cart"})
})


app.use(authRoutes);
// class routes
app.use('/classes', classRoutes);



// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});


