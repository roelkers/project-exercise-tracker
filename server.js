const express = require('express')
const app = express()
const exerciseModel = require('./exerciseModel')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userModel = require('./userModel')

mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

const db = mongoose.connection;

db.once('open', function() {
  console.log("connected!");
});
/*
exerciseModel.find({uid : 'BJEJB18GW'},function(err,exercise){
  if(err) console.log(err)
  console.log(exercise);
})
*/
app.use(cors())

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/api/exercise/new-user',function(req,res){
  const user = new userModel({
    name: req.body.username
  })
  user.save(function(err,data){
    if(err) console.log(err);
    else {
      console.log(data);
      res.json(data);
    }
  })
});

app.post('/api/exercise/add',function(req,res){
  userModel.find({ _id: req.body.userId
  }, function(err,data){
    if(err) console.log(err);
    console.log(data);
    exerciseModel.create({
      uid: req.body.userId,
      description: req.body.description,
      duration: req.body.duration,
      date: new Date(req.body.date)
    }, function(err,data){
      if(err) console.log(err);
      console.log(data);
    })
  })
})

//app.get('/api/exercise/log?:userId&:from*?&:to*?&:limit*?', (req,res) => {
app.get('/api/exercise/log?', (req,res) => {
  console.log(req.query);

  let query = exerciseModel.find({
    uid : req.query.userId,
  });

  if(req.query.from){
    const startDate = new Date(req.query.from);
    startDate.setHours(0,0,0,0);
    console.log('startDate: '+startDate.toISOString());
    query = query.where('date').gte(startDate.toISOString());
  }
  if(req.query.to){
    const endDate = new Date(req.query.to);
    endDate.setHours(23,59,59,59);
    console.log('endDate: '+endDate.toISOString());
    query = query.where('date').lte(endDate.toISOString());
  }
  if(req.query.limit)
    query.limit(req.query.limit);

  query.exec(function(err, exercises){
    if(err) console.log(err)
    res.send(exercises);
  });
});

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
