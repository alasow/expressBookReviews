const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});




//Return books
function getBooks() {
  return new Promise((resolve, reject) => {
      resolve(books);
  });
}



function getByISBN(isbn) {
  return new Promise((resolve, reject) => {
      let isbnNumber = parseInt(isbn);
      if (books[isbnNumber]) {
          resolve(books[isbnNumber]);
      } else {
          reject({status:404, message:`ISBN ${isbn} not found`});
      }
  })
}





// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getBooks().then((bks) => res.send(JSON.stringify(bks)));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  getByISBN(req.params.isbn)
  .then(
      result => res.send(result.reviews),
      error => res.status(error.status).json({message: error.message}));   
 });
 
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;  
  getBooks()
  .then((bookEntries) => Object.values(bookEntries))
  .then((books) => books.filter((book) => book.author === author))
  .then((filteredBooks) => res.send(filteredBooks));

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  getBooks()
  .then((bookEntries) => Object.values(bookEntries))
  .then((books) => books.filter((book) => book.title === title))
  .then((filteredBooks) => res.send(filteredBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});

  getByISBN(req.params.isbn)
  .then(
      result => res.send(result.reviews),
      error => res.status(error.status).json({message: error.message})
  );
});

module.exports.general = public_users;
