const mongoose = require('mongoose');
const Book = require('./book');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

authorSchema.pre('remove', async function (next) {
  const author = this;
  try {
    const books = await Book.find({ author: author.id });
    if (books.length > 0) {
      const err = new Error('This author has books still');
      return next(err);
    }
    next();
  } catch (err) {
    next(err);
  }
});

authorSchema.methods.deleteAuthor = async function () {
  const books = await Book.find({ author: this.id });
  if (books.length > 0) {
    const err = new Error('This author has books still');
    throw err;
  }
  await this.deleteOne();
};

module.exports = mongoose.model('Author', authorSchema);
