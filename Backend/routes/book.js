const express = require('express');
const router = express.Router();

// Import middlewares
const multer = require('../middlewares/multer-config');
const sharp = require('../middlewares/sharp-config');
const auth = require('../middlewares/auth');

// Import book controller
const bookCtrl = require('../controllers/book');

// get
router.get('/', bookCtrl.getBooks);
router.get('/bestrating', bookCtrl.getBestiestBooks);
router.get('/:id', bookCtrl.getOneBook);

// post
router.post('/', auth, multer, sharp, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.rateOneBook);

// put
router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook);

// delete
router.delete('/:id', auth, bookCtrl.deleteOneBook);

module.exports = router;
