const sharp = require('sharp');
const fs = require('fs');

// Middleware for resizing images and converting them to WebP
const resizeAndConvertToWebp = (req, res, next) => {
  // Check if a file has really been downloaded with Multer
  if (!req.file) {
    // If no file, go to the next middleware
    return next();
  }

  // Original path & name of downloaded file
  const originalPath = req.file.path;
  const originalFileName = req.file.filename;

  // New name & path for resized file converted to WebP
  const newFileName = req.file.filename.split('.')[0] + '_resized.webp';
  req.file.filename = newFileName;
  req.file.path = 'images/' + newFileName;

  // Using Sharp
  sharp(originalPath)
    // To resized
    .resize({ height: 600 })
    // And convert
    .toFormat('webp')
    .toFile(req.file.path, (error) => {
      if (error) {
        return next(error);
      }

      // Delete previous file
      fs.unlink(`images/${originalFileName}`, (error) => {
        if (error) {
          console.log(error);
        }
      });

      next();
    });
};

module.exports = resizeAndConvertToWebp;
