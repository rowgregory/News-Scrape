const exp = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const axios = require('axios');
const cheerio = require('cheerio');

const app = exp();



var db = require("./models");

const PORT = process.env.PORT || 3000;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://root:root@192.168.99.100/mongoHeadlines?authSource=admin";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// Serve static content for the app from the "public" directory in the application directory.
app.use(exp.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine(
  "handlebars", 
  exphbs({
     defaultLayout: "main"
  })
);

app.set("view engine", "handlebars");



app.get("/scrape", function(req, res){
  axios.get("http://www.nytimes.com/section/science").then(function (response) {
        var $ = cheerio.load(response.data);
        

        $("div.story-body").each(function (i, element) {

          var result = {};

          // Add the text and href of every link, and save them as properties of the result object
          result.title = $(this)
              .find("h2")
              .text().trim();
          result.link = $(this)
              .children("a")
              .attr("href");
          result.summary = $(this)
              .find(".summary")
              .text().trim()
          console.log('===================================')
          console.log(result.summary);

          db.Article.create(result)
            .then(function(dbArticle) {
              console.log(dbArticle);
            })
            .catch(function(err) {
              console.log(err);
            });  
        });
        res.send('Scrape Complete');
    });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      console.log(dbArticle);
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle) 
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  var id = req.params.id;
  // console.log('Pinged');
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findById(id)
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbNote) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/note/:id", function(req, res) {
  let {title, body, articleId} = req.body,
      note ={
        title,
        body

  }
  
  // Create a new note and pass the req.body to the entry
  db.Note.create(note)
    .then(function(dbNote) {
     
      db.Article.findOneAndUpdate(
        

        { _id: articleId}, 
        { $push: { note: dbNote._id }},
        { new: true }
       );
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/", function(req, res) {
  db.Article.find({}).then(function(dbArticles) {
    
    res.render("index", {
      articles: dbArticles
    })
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});

// save articles page
app.get('/saved', function(req, res) {
  db.Article.find({saved: true})
    .then(function(dbArticle) {
      var articleObj = {article: dbArticle};

      res.render('saved', articleObj)
    })
    .catch(function(err) {
      res.json(err);
    })
})

// save article
app.put('/article/:id', function(req, res) {
  var id = req.params.id;

  // $set will create the field if the field does not exist. See the individual update operator reference for details.
  db.Article.findByIdAndUpdate(id, {saved:true})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    })
})


app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});