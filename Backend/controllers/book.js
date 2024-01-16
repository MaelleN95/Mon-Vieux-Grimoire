const Book = require('../models/Book');
const fs = require('fs');

exports.getBooks = (req, res, next) => {
  Book.find()
    .then((Books) => {
      res.status(200).json(Books);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

// exports.getBestiestBooks = (req, res, next) => {};

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;

  const book = new Book({
    ...bookObject,
    imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })

  book.save()
  .then(() => {
    res.status(201).json({ message: 'Livre enregistré !' });
  })
  .catch((error) => {
      res.status(400).json({ error });
    });
};

// exports.modifyBook = (req, res, next) => {};

// exports.deleteOneBook = (req, res, next) => {};

// exports.rateOneBook = (req, res, next) => {};
