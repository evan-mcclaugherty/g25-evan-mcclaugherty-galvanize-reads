var knex = require('./dbConnection');

module.exports = {
    insertAuthorBook: (authorID, bookID) => {
        return knex('author_book').insert({
            author_id: authorID,
            book_id: bookID
        })
    },

    insertGenre: (genre) => {
        return knex('genre').insert({
            genre_name: genre
        }, 'id')
    },

    getBook: (id) => knex('book').where('id', id).first(),

    getAuthorsWithBooks: () => knex('book').map(ea => {
        return knex('author_book').where('book_id', ea.id).pluck('author_id').then(authorIds => {
            return knex('author').whereIn('author.id', authorIds).then(authors => {
                return Object.assign(ea, {
                    authors
                })
            })
        })
    }),

    getSingleBookWithAuthors: (id) => knex('book').where('id', id)
        .then(book => knex('author_book').where('book_id', id).pluck('author_id')
            .then(authorIds => {
                return knex('author').whereIn('author.id', authorIds).returning('first_name', 'last_name').then(authorNames => {
                    return {
                        book,
                        authorNames
                    }
                })
            })),

    getGenres: () => knex('genre').select(),

    deleteBook: (id) => knex('book').where('id', id).del(),

    editBook: function(id, data) {
        if (data.genre_id[1]) {
            return this.insertGenre(data.genre_id[1]).then(newId => {
                return knex('book').update({
                    title: data.title,
                    description: data.description,
                    cover_url: data.cover_url,
                    genre_id: newId[0]
                }).where('id', id)
            })
        } else {
            return knex('book').update({
                title: data.title,
                description: data.description,
                cover_url: data.cover_url,
                genre_id: data.genre_id[0]
            }).where('id', id)
        }
    },

    insertBook: function(data) {
        if (data.genre_id[1]) {
            return this.insertGenre(data.genre_id[1]).then(id => {
                return knex('book').insert({
                    title: data.title,
                    description: data.description,
                    cover_url: data.cover_url,
                    genre_id: id[0]
                }, 'id').then(id => {
                    return this.insertAuthorBook(data.author_id, id[0])
                })
            })
        } else {
            return knex('book').insert({
                title: data.title,
                description: data.description,
                cover_url: data.cover_url,
                genre_id: data.genre_id[0]
            }, 'id').then(id => {
                return this.insertAuthorBook(data.author_id, id[0])
            })
        }
    }
}
