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
  const books = await Book.find({ author: author.id });
  if (books.length > 0) {
    const err = new Error('This author has books still');
    return next(err);
  }
  next();
});

authorSchema.methods.remove = async function () {
  await this.model('Author').deleteOne({ _id: this._id });
};

module.exports = mongoose.model('Author', authorSchema);
