const exp = require('express');
const bodyParser = require('body-parser');

const app = exp();

const PORT = process.env.PORT || 3000;

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

// Require the routes in our controllers js file
require("./controllers/articleController.js")(app);

app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });