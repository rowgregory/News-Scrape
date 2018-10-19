// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 450; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append(`<p data-id='${data[i]._id}'> ${data[i].title} <br /> ${data[i].link} <br /> ${data[i].summary} </p>`);
    }
  });

  //get new articles when the button is clicked
  $("#scrape").on("click", function(event) {
    event.preventDefault();
    $.get("/scrape", function(data) {
      $('#articles').empty();
      window.location.reload();
    });
  });