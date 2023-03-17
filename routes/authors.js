const express = require('express');
const router = express.Router();
const Author = require('../models/author');

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
    // res.redirect(`authors/${newAuthor.id}`);
    res.redirect('/authors');
  } catch (error) {
    console.error(error);
    res.render('authors/new', {
      author,
      errorMessage: 'Error creating Author',
    });
  }
});

module.exports = router;
