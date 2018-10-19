// const scrape = require('../utils/api.js');
// // const db = require("../models");
// module.exports = function (app) {
//   // Route for retrieving all articles from the db
//   app.get("/articles", function(req, res) {
  
//     let articles = scrape();
//     // find all articles
//     articles.find({})
//       .then(function(dbArticle) {
//         // if the articles are successfully found, send them back fo the client
//         res.render('index', {articles: dbArticle});
//       })
//       .catch(function(err) {
//         // if error occurs, send the error back to the client
//         res.json(err);
//       });      
//   })
// }