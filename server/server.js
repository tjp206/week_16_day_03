const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');
const User = require('./models/User.js');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

mongoose.connect('mongodb://localhost:27017/signups')

const secretKey = 'kdjhfsdljnkljjnvfghfhnhryj'

app.get('/', (req, res) => {
  res.send("Hello World")
})

app.post('/signup', (req, res) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  })
  newUser.save(err => {
    if(err) {
      return res.status(400).json({
        title: 'error',
        error: 'email already in use'
      })
    }
    return res.status(200).json({
      title: 'signup successful'
    })
  })
})

app.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if(err) return res.status(500).json({
      title: 'server error',
      error: err
    })
    if(!user) return res.status(401).json({
      title: 'user not found',
      error: 'invalid credentials'
    })
    if(!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        title: 'login failed',
        error: 'invalid credentials'
      })
    }
    let token = jwt.sign({ userId: user._id }, secretKey)
    return res.status(200).json({
      title: 'login successful',
      token: token
    })
  })
})

app.get('/user', (req, res) => {
  let token = req.headers.token;
  jwt.verify(token, secretKey, (err, decoded) => {
    if(err) return res.status(401).json({
      title: 'unauthorised'
    })
    User.findOne({_id: decoded.userId}, (err, user) => {
      if(err) return console.log(err);
      return res.status(200).json({
        title: 'user found',
        user: {
          name: user.name,
          email: user.email
        }
      })
    })
  })
})

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if(err) return console.log(err);
  console.log('server running at port ' + port);
})
