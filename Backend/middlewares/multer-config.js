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
    // management of accents and special symbols
    const decodedName = Buffer.from(file.originalname, 'latin1')
      .toString('utf-8')
      .replace(/[éèëêÉÈÊË]/g, 'e')
      .replace(/[àäâÀÃ]/g, 'a')
      .replace(/[ùûüÙÛÜ]/g, 'u')
      .replace(/[ïîìÏÎ]/g, 'i')
      .replace(/[ôöòõÔ]/g, 'o')
      .replace(/[çÇ]/g, 'c')
      .replace(/[&~#€©§¶+=/!?£%;$,:*{[|`^\\@}()]/g, '');

    // Split to remove the extension, and remove the spaces
    const name = decodedName.split('.')[0].split(' ').join('_');

    // Define extension with extension dictionary (variable MIME_TYPES)
    const extension = MIME_TYPES[file.mimetype];

    // if (extension != 'png' || extension != 'jpg' || extension != 'webp') {
    //   console.error("Le format n'est pas accepté !");
    // }

    callback(null, name + Date.now() + '.' + extension);
  },
});

module.exports = multer({ storage: storage }).single('image');
