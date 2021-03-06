var api = require('../db/api');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    api.author.getBooksWithAuthors().then(authors => {
        res.render('author/author', {
            author: authors
        })
    })
});

router.get('/specific/:id', (req, res, next) => {
    api.author.getSingleBookWithAuthors(req.params.id).then(data => {
        res.render('author/specificAuthor', {
            author: data.author[0],
            bookNames: data.bookNames
        })
    })
})

router.get('/new', function(req, res, next) {
    res.render('author/addAuthor');
});

router.post('/', (req, res, next) => {
    api.author.insertAuthor(req.body).then(() => {
        res.redirect('/author')
    })
})

router.get('/delete/:id', (req, res, next) => {
    api.author.getSingleBookWithAuthors(req.params.id).then(data => {
        res.render('author/deleteAuthor', {
            author: data.author[0],
            bookNames: data.bookNames
        })
    })
})

router.delete('/:id', (req, res, next) => {
    api.author.deleteAuthor(req.params.id).then(() => {
        res.redirect('/author')
    })
})

router.get('/edit/:id', (req, res, next) => {
    api.author.getAuthor(req.params.id).then(author => {
        res.render('author/editAuthor', {
            author: author
        })
    })
})

router.put('/:id', (req, res, next) => {
    api.author.editAuthor(req.params.id, req.body).then(() => res.redirect('/author'))
})

module.exports = router;
