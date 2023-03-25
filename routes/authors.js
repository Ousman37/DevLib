const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

// All Authors Route
router.get('/', async (req, res) => {
  const searchOptions = {};
  if (req.query.name !== null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render('authors/index', { authors, searchOptions: req.query });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// New Author Route
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() });
});

// Create Author Route
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`);
  } catch (error) {
    console.error(error);
    res.render('authors/new', {
      author,
      errorMessage: 'Error creating Author',
    });
  }
});

// Show Author Router
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(6).exec();
    res.render('authors/show', {
      author: author,
      booksByAuthor: books,
    });
  } catch (error) {
    res.redirect('/');
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render('authors/edit', { author: author });
  } catch (error) {
    res.redirect('/authors');
  }
});

// Update author Router
router.put('/:id', async (req, res) => {
  let author;

  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name; // Update the author's name
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (error) {
    if (author === null) {
      res.redirect('/');
    } else {
      res.render('authors/edit', {
        author,
        errorMessage: 'Error Updating  Author',
      });
    }
  }
});

// Delete  author Router
router.delete('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).send('Author not found');
    }
    await author.remove();
    res.redirect('/authors');
  } catch (error) {
    console.error(error);
    res.redirect(`/authors/${req.params.id}`);
  }
});

module.exports = router;
