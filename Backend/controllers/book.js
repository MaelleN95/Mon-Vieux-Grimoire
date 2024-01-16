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
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    averageRating: bookObject.ratings[0].grade,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: 'Livre enregistré !' });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  // vérif si une img est à traiter ou non
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  // suppr l'userID
  delete bookObject._userId;

  // On recherche l'élément à modif
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // On vérif que la personne qui est connectée à le même userId que celui de l'objet
      if (book.userId != req.auth.userId) {
        // Si non, status 401
        res.status(401).json({ message: 'Non autorisé' });
      } else {
        // Si oui, update le livre avec bookObject et l'id
        // D'abord on supprime l'img qui était avant
        const outdatedFilename = book.imageUrl.split('/images/')[1];
        if (req.file) {
          fs.unlink(`images/${outdatedFilename}`, (error) => {
            if (error) {
              console.log(error);
            }
          });
        }

        // Puis on met à jour
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => {
            res.status(200).json({ message: 'Livre modifié !' });
          })
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Livre supprimé !' });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// exports.rateOneBook = (req, res, next) => {};
