const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const layouts = require("express-ejs-layouts");


const mongoose = require( 'mongoose' );
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
const User = require('./models/User');
const Meeting = require('./models/Meeting');
const Question=require('./models/Question');
const Answer=require('./models/Answer');

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


app.get('/addMeeting',(req,res)=>{
  res.render('addMeeting')
})

app.post('/addMeeting',
  async(req,res,next)=>{
    try{
      let name=req.body.name
      let date=req.body.date
      let link=req.body.link
      let author=req.user._id
      let detail=req.body.detail
      let newMeeting=new Meeting({author:author,name:name,date:date,link:link,detail:detail})
      await newMeeting.save()
      req.user.meetings.push(newMeeting)
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
      res.locals.meetings = await Meeting.find({author:req.user._id})
      res.render('showMeeting')
    } catch (e) {
      next(e)
    }
  }
);

app.get('/deleteMeeting/:itemId',
  isLoggedIn,
  async(req,res,next)=>{
      console.log("inside /meeting/remove/:itemId")
      await Meeting.remove({_id:req.params.itemId});
      res.redirect('/showMeeting')
  });


app.get('/editMeeting/:itemId',
  isLoggedIn,
  async(req, res, next)=>{
    try{
      res.locals.meeting=await Meeting.findOne({_id:req.params.itemId})
      console.log(res.locals)
      res.render('editMeeting')
    }catch(e){
      next(e)
    }
})

app.post('/editMeeting/:itemId',
async(req,res,next)=>{
  let meeting=await Meeting.findOne({_id:req.params.itemId})
  meeting.name=req.body.name
  meeting.date=req.body.date
  meeting.link=req.body.link
  meeting.detail=req.body.detail
  await meeting.save()
  res.redirect('/showMeeting')
})


app.get('/addQuestion',(req,res)=>{
    res.render('addQuestion');
})


app.post('/addQuestion',
  async(req,res,next)=>{
    try{
      let subject=req.body.subject
      let author=req.user._id
      let name=req.user.googlename
      let date=new Date()
      let question=req.body.question
      let newQuestion=new Question({subject:subject,author:author,date:date,question:question,name:name})
      await newQuestion.save()
      res.redirect(`/showQuestions`)
    }
    catch(e){
      next(e)
    }
})

app.get('/showQuestions',
  async(req, res,next) => {
    try {
      res.locals.questions = await Question.find({})
      res.render('showQuestion')
    } catch (e) {
      next(e)
    }
  }
)

app.get('/deleteQuestion/:itemId',
async(req,res,next)=>{
  await Question.remove({_id:req.params.itemId})
  res.redirect('/showQuestions')
})

app.get('/addAnswer/:itemId',
async(req,res,next)=>{
  res.locals.question=await Question.findOne({_id:req.params.itemId})
  const query={
    question:req.params.itemId
  }
  res.locals.answers=await Answer.find(query)
  res.render('addAnswer')
})

app.post('/addAnswer/:itemId',
  async(req,res,next)=>{
    try{
      let author=req.user.googlename
      let date=new Date()
      let question=req.params.itemId
      let answer=req.body.answer
      let newAnswer=new Answer({author:author,date:date,question:question,answer:answer})
      await newAnswer.save()
      let q=await Question.findOne({_id:req.params.itemId})
      q.answers.push(newAnswer)
      res.redirect(`/addAnswer/${req.params.itemId}`)
    }
    catch(e){
      next(e)
    }
})

app.get('/showAnswer/:itemId',
  async(req,res,next)=>{
  try{
    const query={
      questionID:req.params.itemId
    }
    res.locals.ID=req.params.itemId
    res.locals.question=await Question.find({_id:req.params.itemId})
    res.locals.answers=await Answer.find(query)
    res.render('showAnswer')
}catch(e){
  next(e)
}
})

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
