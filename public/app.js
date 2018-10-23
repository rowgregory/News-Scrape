//get new articles when the button is clicked
$("#scrape").on("click", function (event) {
  event.preventDefault();
  $.get("/scrape", function (data) {
    window.location.reload();
  });
});

const saveArticle = function () {
  var id = $(this).data('id');
  $.ajax({
    url: `/article/${id}`,
    method: 'PUT'
  })
    .then(function (data) {
      location.reload();
    })
}
$('.btn-save').on('click', saveArticle);

const getNotes = function () {
  $("#comments").empty();
  var articleId = $(this).data('id');
  console.log('Pinged');
  
  $.ajax({
    url: `/articles/${articleId}`,
    method: 'GET',
  })
    .then(function(data) {
      console.log('pinged 2');
      console.log(data);
      
      Object.keys(data).forEach(function(element) {
        $('#comments').append(`<li><strong>${element.title}</strong><button id="deleteNote" class="delete btn btn-sm btn-danger m-1" data-id="${element._id}" data-article="${articleId}"disabled>remove</button><p>${element.body}</p></li>`);
      });

        // The title of the article
        $("#comments").append("<h3 class='dataTitle'>" + data.title + "</h3>");
        // An input to enter a new title
        $("#comments").append("<input id='titleinput' name='title' placeholder='Title' class='form-group'>");
        // A textarea to add a new note body
        $("#comments").append("<textarea id='bodyinput' name='body' placeholder='Comment'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#comments").append("<button data-id='" + data._id + "' id='savenote' class='btn btn-success'>Save Note</button>");
      
      // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
    })
}

$('.btn-view-notes').on('click', getNotes);

const validation = () => {
  let valid = true;
  let $titleinput = $('#titleinput');
  let $bodyinput = $('#bodyinput')

  if (($titleinput).val() === '' || ($bodyinput).val() === '') {
    
    valid = false
  }
  return valid;
}

$(document).on('click', '#savenote', function() {;

  console.log('are we saving a note?');
  var thisId = $(this).attr('data-id');
  
  if(validation() == true) {
    $.ajax({
      url: `/note/${thisId}`,
      method: 'POST',
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function (data) {
        getComments(thisId);
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
    alert('Thank you for submitting your comment!')
    } else {
      alert('Please fill all entries');
    }
  });

  const deleteNote = function () {
    console.log("I clicked a button!");
    var noteId = $(this).attr("data-id");
    var articleId = $(this).attr("data-article");
    $.ajax({
      method: "DELETE",
      url: `/notes/${noteId}`
    }).then(function (data) {
      getNotes(articleId);
    })
  };

  $('#deleteNote').on('click', deleteNote)

  const removeArticle = function() {
    let id = $(this).data('id');
    
    $.ajax({
        url: `/article/remove/${id}`,
        method: 'PUT'
    })
    .then((data)=>{
        location.reload();
    });
};

$('.btn-remove').on('click', removeArticle);






