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

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Require the routes
require("./routes/htmlRoutes")(app);
// require("./routes/apiRoutes")(app);



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
          console.log(result);

          db.Article.create(result)
            .then(function(dbArticle) {
              console.log(dbArticle);
            })
            .catch(function(err) {
              return res.json(err);
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
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});











app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });