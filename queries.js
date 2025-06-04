//Task 1
 use plp_bookstore;
db.createCollection("books");

//Task 2
//Crud operations
//Book Documents
db.books.insertMany([
  {
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "genre": "Fiction",
    "published_year": 1960,
    "price": 12.99,
    "in_stock": true,
    "pages": 336,
    "publisher": "J. B. Lippincott & Co."
  },
  {
    "title": "1984",
    "author": "George Orwell",
    "genre": "Dystopian",
    "published_year": 1949,
    "price": 10.99,
    "in_stock": true,
    "pages": 328,
    "publisher": "Secker & Warburg"
  },
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "published_year": 1925,
    "price": 9.99,
    "in_stock": true,
    "pages": 180,
    "publisher": "Charles Scribner's Sons"
  },
  {
    "title": "Brave New World",
    "author": "Aldous Huxley",
    "genre": "Dystopian",
    "published_year": 1932,
    "price": 11.50,
    "in_stock": false,
    "pages": 311,
    "publisher": "Chatto & Windus"
  },
  {
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "genre": "Fantasy",
    "published_year": 1937,
    "price": 14.99,
    "in_stock": true,
    "pages": 310,
    "publisher": "George Allen & Unwin"
  },
  {
    "title": "The Catcher in the Rye",
    "author": "J.D. Salinger",
    "genre": "Fiction",
    "published_year": 1951,
    "price": 8.99,
    "in_stock": true,
    "pages": 224,
    "publisher": "Little, Brown and Company"
  },
  {
    "title": "Pride and Prejudice",
    "author": "Jane Austen",
    "genre": "Romance",
    "published_year": 1813,
    "price": 7.99,
    "in_stock": true,
    "pages": 432,
    "publisher": "T. Egerton, Whitehall"
  },
  {
    "title": "The Lord of the Rings",
    "author": "J.R.R. Tolkien",
    "genre": "Fantasy",
    "published_year": 1954,
    "price": 19.99,
    "in_stock": true,
    "pages": 1178,
    "publisher": "Allen & Unwin"
  },
  {
    "title": "Animal Farm",
    "author": "George Orwell",
    "genre": "Political Satire",
    "published_year": 1945,
    "price": 8.50,
    "in_stock": false,
    "pages": 112,
    "publisher": "Secker & Warburg"
  },
  {
    "title": "The Alchemist",
    "author": "Paulo Coelho",
    "genre": "Fiction",
    "published_year": 1988,
    "price": 10.99,
    "in_stock": true,
    "pages": 197,
    "publisher": "HarperOne"
  },
  {
    "title": "Moby Dick",
    "author": "Herman Melville",
    "genre": "Adventure",
    "published_year": 1851,
    "price": 12.50,
    "in_stock": false,
    "pages": 635,
    "publisher": "Harper & Brothers"
  },
  {
    "title": "Wuthering Heights",
    "author": "Emily Brontë",
    "genre": "Gothic Fiction",
    "published_year": 1847,
    "price": 9.99,
    "in_stock": true,
    "pages": 342,
    "publisher": "Thomas Cautley Newby"
  }
]);

//Query to find books in criteria
//Genre
db.books.find({ genre: "Fantasy" });

//Published Year
db.books.find({ published_year: { $gt: 1950 } });

//Author
db.books.find({ author: "George Orwell" });

//Update book price
db.books.updateOne(
  { title: "The Hobbit" },
  { $set: { price: 15.99 } }
);

//Delete a book by Title
db.books.deleteOne({ title: "Animal Farm" });


//Task 3
//Write a query to find books that are both in stock and published after 2010
db.books.find(
  { 
    in_stock: true,
    published_year: { $gt: 2010 }
  },
  { 
    title: 1, 
    author: 1, 
    price: 1, 
    _id: 0 
  }
);

//Use projection to return only the title, author, and price fields in your queries
// Ascending (cheapest first)
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })
       .sort({ price: 1 });

// Descending (most expensive first)
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })
       .sort({ price: -1 });

//- Use the `limit` and `skip` methods to implement pagination (5 books per page)
// Page 1 (first 5 books)
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })
       .sort({ price: 1 })
       .limit(5)
       .skip(0);

// Page 2 (next 5 books)
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })
       .sort({ price: 1 })
       .limit(5)
       .skip(5);

// Task 4       
//Average Price by Genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" },
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      genre: "$_id",
      averagePrice: { $round: ["$averagePrice", 2] },
      count: 1,
      _id: 0
    }
  },
  { $sort: { averagePrice: -1 } }
]);

//Author with Most Books
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  { $sort: { bookCount: -1 } },
  { $limit: 1 },
  {
    $project: {
      author: "$_id",
      bookCount: 1,
      _id: 0
    }
  }
]);

//Books Count by Publication Decade
db.books.aggregate([
  {
    $addFields: {
      decade: {
        $subtract: [
          "$published_year",
          { $mod: ["$published_year", 10] }
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      bookCount: { $sum: 1 },
      sampleTitles: { $push: "$title" }
    }
  },
  {
    $project: {
      decade: "$_id",
      bookCount: 1,
      sampleTitles: { $slice: ["$sampleTitles", 3] }, // Show 3 sample titles
      _id: 0
    }
  },
  { $sort: { decade: 1 } }
]);

// Task 5
 //Create Index on title Field
db.books.createIndex({ title: 1 });
db.books.getIndexes();

//Create Compound Index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });
db.books.getIndexes();

// Performance Comparison with explain()
db.books.find({ 
  author: "George Orwell",
  published_year: { $gt: 1940 }
}).explain("executionStats");

