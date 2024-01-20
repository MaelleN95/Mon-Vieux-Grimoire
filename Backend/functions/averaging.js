// Creation of a function to calculate the average rating of a book
const averaging = (ratings) => {
  try {
    if (ratings.length === 0) {
      return 0;
    }
    // Sum of all ratings
    const sum = ratings.reduce((acc, rating) => acc + rating.grade, 0);
    if (sum === 0) {
      return 0;
    }
    // Divide the sum of the ratings by the number of ratings
    const averageRating = sum / ratings.length;

    return averageRating;
  } catch (error) {
    console.error('Error when calculating the average rating : ', error);
  }
};

module.exports = averaging;
