const express = require('express');
const multer = require('../middlewares/multer-config')

const router = express.Router();
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getBooks);
router.get("/:id", bookCtrl.getOneBook);
// router.get("/bestrating", bookCtrl.getBestiestBooks);
router.post("/", multer, bookCtrl.createBook);
// router.put("/:id", bookCtrl.modifyBook);
// router.delete("/:id", bookCtrl.deleteOneBook);
// router.post("/:id/rating", bookCtrl.rateOneBook);

module.exports = router;
