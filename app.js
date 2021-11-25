//declarations and imports
const express = require('express')
const bodyParser = require('body-parser')


const app = express()
const port = 3000

const mongoose = require('mongoose')

const User = require('./user.js')


app.use(bodyParser.urlencoded({extended:false}))

app.get('/user', (req, res) => {
  User.find((err, users) => {
    if(err){
      res.send("Error occured, no user retrieved")
      return
    }
    res.send(users)
    console.log(users)
  })
  
})

app.get('/user/:id', (req, res) => {
  const id = req.params.id;

  User.findById(id, (err, user) => {
    if(err) {
      res.send("User not found")
      return
    }
    res.send(user)
    console.log(user)
  })
})


app.post('/user', (req, res) =>{
  //insert using post!
  console.log("Inserting an User in the database")

  let isLoggedIn = false;
  if(req.body.isLoggedIn === 'true') {
    isLoggedIn = true;
  }

  let user = new User({
    id: parseInt(req.body.id),
    name: req.body.name,
    age: parseInt(req.body.age),
    isLoggedIn: isLoggedIn
  });

  user.save(err => {
    if(err) {
      res.send(`User not inserted into the database, error is: ${err}`)
      return
    }
    res.send("User inserted into the database")
    console.log("User is in the database")
  })
  return
  
})

app.put('/user/:id', (req, res) => {
  console.log("Trying to edit user")
  console.log(parseInt(req.body.id))

  User.updateOne({id: req.params.id}, {
    id: ((parseInt(req.body.id) == NaN) ? 0 : parseInt(req.body.id)),
    name: req.body.name,
    age: parseInt(req.body.age),
    isLoggedIn: (req.body.isLoggedIn === 'true')
  }, err => {
    if(err) {
      res.send("it didn't edit. The erros is: " + err)
      return;
    }
    res.send("It did edit")
  })
})

app.delete('/user/:id', (req, res) =>{
 
  User.deleteOne({id: req.params.id}, err => {
    if(err) {
      res.send("User did not delete")
      return
    }
    res.send("User deleted")
    console.log(`User with id ${req.params.id} is now deleted`)
  })
})

app.listen(port, () => {
  mongoose.connect('mongodb+srv://admin:admin@userapi.xwksy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').
  catch(error => console.log(error));

  console.log(`Example app listening at http://localhost:${port}`)
})