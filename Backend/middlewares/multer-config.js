const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const storage = multer.diskStorage({
  // Destination directory where downloaded files will be saved
  destination: (req, file, callback) => {
    callback(null, 'images');
  },

  // File name after saving :
  filename: (req, file, callback) => {
    // Split to remove the extension, and remove the spaces
    const name = file.originalname.split('.')[0].split(' ').join('_');
    // Define extension with extension dictionary (variable MIME_TYPES)
    const extension = MIME_TYPES[file.mimetype];

    callback(null, name + Date.now() + '.' + extension);
  },
});

module.exports = multer({ storage: storage }).single('image');
