const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const layouts = require("express-ejs-layouts");
//const auth = require('./config/auth.js');


const mongoose = require( 'mongoose' );
//mongoose.connect( `mongodb+srv://${auth.atlasAuth.username}:${auth.atlasAuth.password}@cluster0-yjamu.mongodb.net/authdemo?retryWrites=true&w=majority`);
//mongoose.connect( 'mongodb://localhost/authDemo');
const mongoDB_URI = process.env.MONGODB_URI
mongoose.connect(mongoDB_URI)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});

const authRouter = require('./routes/authentication');
const isLoggedIn = authRouter.isLoggedIn
const loggingRouter = require('./routes/logging');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const toDoRouter = require('./routes/todo');
const toDoAjaxRouter = require('./routes/todoAjax');



const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(layouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRouter)
app.use(loggingRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/todo',toDoRouter);
app.use('/todoAjax',toDoAjaxRouter);


app.get('/profiles',
    isLoggedIn,
    async (req,res,next) => {
      try {
        res.locals.profiles = await User.find({})
        res.render('profiles')
      }
      catch(e){
        next(e)
      }
    }
  )

app.use('/publicprofile/:userId',
    async (req,res,next) => {
      try {
        let userId = req.params.userId
        res.locals.profile = await User.findOne({_id:userId})
        res.render('publicprofile')
      }
      catch(e){
        console.log("Error in /profile/:userId")
        next(e)
      }
    }
)


app.get('/profile',
    isLoggedIn,
    (req,res) => {
      res.render('profile')
    })

app.get('/editProfile',
    isLoggedIn,
    (req,res) => res.render('editProfile'))

app.post('/editProfile',
    isLoggedIn,
    async (req,res,next) => {
      try {
        let username = req.body.username
        let age = req.body.age
        req.user.username = username
        req.user.age = age
        req.user.imageURL = req.body.imageURL
        await req.user.save()
        res.redirect('/profile')
      } catch (error) {
        next(error)
      }

    })

const User = require('./models/User');

app.get("/test",async (req,res,next) => {
  try{
    const u = await User.find({})
    console.log("found u "+u)
  }catch(e){
    next(e)
  }
})

const Meeting = require('./models/Meeting');

app.get('/addMeeting',(req,res)=>{
  res.render('addMeeting')
})

app.post('/addMeeting',
  async(req,res,next)=>{
    try{
      let name=req.body.name
      let date=req.body.date
      let link=req.body.link
      let newMeeting=new Meeting({name:name,date:date,link:link})
      await newMeeting.save()
      req.user.meeting.push(newMeeting)
      res.redirect('/showMeeting')
    }
    catch(e){
      next(e)
    }
  }
)

app.get('/showMeeting',
  async(req, res,next) => {
    try {
      res.locals.meetings = req.user.meeting
      res.render('showMeeting')
    } catch (e) {
      next(e)
    }
  }
)

const Question=require('./models/Question');

app.get('/addQuestion',(req,res)=>{
  res.render('addQuestion');
})

app.post('/addQuestion',
  async(req,res,next)=>{
    try{
      let subject=req.body.subject
      let author=req.user._id
      let date=new Date()
      let question=req.body.question
      let newQuestion=new Question({subject:subject,author:author,date:date,question:question})
      await newQuestion.save()
      res.redirect('/showQuestion')
    }
    catch(e){
      next(e)
    }
})

app.get('/showQuestion',
  async(req, res,next) => {
    try {
      res.locals.questions = await Question.find({})
      res.render('showQuestion')
    } catch (e) {
      next(e)
    }
  }
)

app.get('/about',(req,res)=>{
  res.render('about')
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
