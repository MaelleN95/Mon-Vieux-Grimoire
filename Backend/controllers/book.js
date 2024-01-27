const Book = require('../models/Book');
const fs = require('fs');
const averaging = require('../functions/averaging');

exports.getBooks = (req, res, next) => {
  // Get all the books
  Book.find()
    // .sort({ title: 1 })  // To sort the library alphabetically by title
    .then((Books) => {
      res.status(200).json(Books);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  // Get the book with the same id as the one in params
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

exports.getBestiestBooks = (req, res, next) => {
  // Get all the books
  Book.find()
    // Order them from largest to smallest by average score
    .sort({ averageRating: -1 })
    // Limit them to 3
    .limit(3)
    .then((bestiestBooks) => {
      res.status(200).json(bestiestBooks);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.createBook = (req, res, next) => {
  // transform the request body (which is a JSON string) into a JavaScript object
  const bookObject = JSON.parse(req.body.book);

  delete bookObject._id;
  // Delete the user ID because you can't trust the client because client-side data can be manipulated or tampered with by users
  delete bookObject._userId;

  const book = new Book({
    // Book creation with parsed data
    ...bookObject,
    // User id added by auth middleware
    userId: req.auth.userId,
    // Add a url to image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    // AverageRating takes the value of the first rating given by the user
    averageRating: bookObject.ratings[0].grade,
  });

  // Save the book in the DB
  book
    .save()
    .then(() => {
      res.status(201).json({ message: 'Livre enregistré !' });
    })
    .catch((error) => {
      res.status(400).json({ error });
      console.log(error);
    });
};

exports.modifyBook = (req, res, next) => {
  // Check if an img is to be processed or not
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  // Delete the user ID for better security
  delete bookObject._userId;

  // Search for the book to modify by the id defined in params
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Check that the person connected has the same userId as the object
      if (book.userId != req.auth.userId) {
        // If no, status 403
        res.status(403).json({ message: 'Non autorisé' });
      } else {
        // If yes, update the book

        // First, delete the img that was before :
        // Get the image
        const outdatedFilename = book.imageUrl.split('/images/')[1];
        // If the request includes an image
        if (req.file) {
          // Delete the outdated file with fs
          fs.unlink(`images/${outdatedFilename}`, (error) => {
            if (error) {
              console.log(error);
            }
          });
        }

        // Afterwards, update the book with bookObject
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => {
            res.status(200).json({ message: 'Livre modifié !' });
          })
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteOneBook = (req, res, next) => {
  // Search for the book to delete by the id defined in params
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Check that the person connected has the same userId as the object
      if (book.userId != req.auth.userId) {
        // If no, status 403
        res.status(403).json({ message: 'Non autorisé' });
      } else {
        // If yes, delete the book

        // First, delete the img :
        // Get the image
        const filename = book.imageUrl.split('/images/')[1];
        // Delete the file with fs
        fs.unlink(`images/${filename}`, () => {
          // And as a callback to fs.unlink, delete the book
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Livre supprimé !' });
            })
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.rateOneBook = (req, res, next) => {
  // Search for the book to be rated by the id defined in params
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Check if the user has already rated the book
      const alreadyRated = false;
      book.ratings.forEach((rate) => {
        if (rate.userId === req.auth.userId) {
          alreadyRated = true;
        }
      });
      alreadyRated
        ? // If the user has already rated this book :
          res
            .status(403)
            .json("Non autorisé - l'utilisateur a déjà évalué le livre")
        : // If the user has never rated this book,
          // Add to the ratings table the userId from auth, and the grade from the request body
          book.ratings.push({
            userId: req.auth.userId,
            grade: req.body.rating,
          });

      // Add average rating refresh with averaging function
      const updatedAverageRating = averaging(book.ratings);
      book.averageRating = updatedAverageRating;

      // Save the book in the DB
      book
        .save()
        .then((updateBook) => {
          res.status(201).json(updateBook);
        })
        .catch((error) => {
          res.status(401).json({ error });
          console.log(error);
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
