const express = require('express');
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/auth');

const router = express.Router();
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getBooks);
router.get('/:id', bookCtrl.getOneBook);
// router.get("/bestrating", bookCtrl.getBestiestBooks);
router.post('/', auth, multer, bookCtrl.createBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteOneBook);
// router.post("/:id/rating", auth, bookCtrl.rateOneBook);

module.exports = router;
