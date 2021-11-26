//declarations and imports
//express for server and routes
const express = require('express')
//bodyParser for x-www-urlencoded (html form like) variables
const bodyParser = require('body-parser')

// defining the actual app to handle the requests (e.g. push, get, etc.)
const app = express()
const port = 3000
// require the driver to connect to the database
const mongoose = require('mongoose')
// require the class constructor from different file
const User = require('./user.js')


app.use(bodyParser.urlencoded({extended:false}))
//API ROUTES
//show all users from the database using GET request
app.get('/user', (req, res) => {
   //find all users in the database and store them in the "result" variable
   //use the Model created in the user.js file to retrieve all user entries from the database
  User.find((err, users) => {
    //in case there is an error with the User model, we we will send it to the user(postman)
    if(err){
      res.send("Error occured, no user retrieved")
      return
    }
    //if no error send the array conting users to the user/postman
    res.send(users)
    //log the result in the console as well
    console.log(users)
  })
  
})
// FIND ONE BY ID, using a GET REQUEST and A PARAMETER (id)
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

//insert request using POST to add a user into the database
app.post('/user', (req, res) =>{
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
  //inserting a user and checking to see if any errors occured
  user.save(err => {
    if(err) {
      // if error send a message to let the user know
      res.send(`User not inserted into the database, error is: ${err}`)
      //return to be used in order to not send to res.send and crash the program
      return
    }
    //send a message to the user with the result
    res.send("User inserted into the database")
    console.log("User is in the database")
  })
  //if return runs, code will start from here
  return
  
})
// PUT request to update or modify one user from the database
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
//delete request using DELETE and a PARAMETER (id)
app.delete('/user/:id', (req, res) =>{
 
  User.deleteOne({id: req.params.id}, err => {
    if(err) {
      res.send("User did not delete")
      return
    }
    res.send("User deleted")
    console.log(`User with id ${req.params.id} is now deleted`)
    // console.log("User with id "+req.params.id + "is now deleted")
  })
})
//start the server
app.listen(port, () => {
  mongoose.connect('mongodb+srv://admin:admin@userapi.xwksy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').
  catch(error => console.log(error));

  console.log(`Example app listening at http://localhost:${port}`)
})