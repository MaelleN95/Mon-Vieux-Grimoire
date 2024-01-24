const sharp = require('sharp');
const fs = require('fs');

// Middleware for resizing images and converting them to WebP
const resizeAndConvertToWebp = (req, res, next) => {
  // Check if a file has really been downloaded with Multer
  if (!req.file) {
    // If no file, go to the next middleware
    return next();
  }

  // Original path of downloaded file
  const originalPath = req.file.path;

  // New name & path for resized file converted to WebP
  const newFileName = req.file.filename.split('.')[0] + '_resized.webp';
  const newPath = 'images/' + newFileName;

  // Updating request data
  req.file.filename = newFileName;
  req.file.path = newPath;

  // Disable Sharp's cache to inform Sharp not to save the original file in memory
  sharp.cache(false);

  // Using Sharp
  sharp(originalPath)
    // To resized
    .resize({ height: 600 })
    // And convert
    .toFormat('webp')
    .toFile(newPath)
    .then(() => {
      // Delete previous file
      fs.unlink(originalPath, (error) => {
        if (error) {
          console.log('Error when delete original file : ', error);
          return next(error);
        }
      });
    })
    .catch((error) => {
      console.log('Error when using sharp : ', error);
      return next(error);
    });

  next();
};

module.exports = resizeAndConvertToWebp;
