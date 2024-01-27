const emailValidator = require('email-validator');
const pwValidator = require('password-validator');

exports.checkEmail = (req, res, next) => {
  // Check email input with email-validator
  emailCheck = emailValidator.validate(req.body.email);
  if (!emailCheck) {
    return res.status(400).json({ message: 'Unauthorized e-mail format' });
  }
  next();
};

// Creation of a security password schema
const pwSchema = new pwValidator();
pwSchema
  .is().min(5) // Min length 5
  .is().max(60) // Max length 60
  .has().uppercase() // Must have uppercase letters
  .has().lowercase() // Must have lowercase letters
  .has().digits(2) // Must have at least 2 digits
  .has().not().spaces() // Shouldn't have spaces
  .is().not().oneOf(
    ['password', 
    'azerty123', 
    'azertyuiop'
  ]);

exports.checkPw = (req, res, next) => {
  // Check password input with password-validator
  pwCheck = pwSchema.validate(req.body.password);
  if (!pwCheck) {
    return res.status(400).json({ message: 'Unauthorized password format' });
  }
  next();
};
