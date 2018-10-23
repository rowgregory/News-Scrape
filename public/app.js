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
        $('#comments').append(`<li><strong>${element.title}</strong><button id="deleteNote" class="delete btn btn-sm btn-danger m-1" data-id="${element._id}" data-article="${articleId}">remove</button><p>${element.body}</p></li>`);
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
        // Object.keys(data).forEach(function(element) {
      //   $('#comments').append(`<li><strong>${element.title}</strong><button class="delete btn btn-sm btn-danger m-1" data-id="${element._id}" data-article="${articleId}">remove</button><p>${element.body}</p></li>`);
      // });

      // // An input to enter a new title
      // $("#comments").append("<input id='titleinput' name='title' >");
      // // A textarea to add a new note body
      // $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      // // A button to submit a new note, with the id of the article saved to it
      // $("#comments").append("<button data-id='" + articleId + "' id='savenote'>Save Comment</button>");
      // create modal
      // $('.modal-content').html(`
      //      <div class="modal-header">
      //        <h5 class="modal-title">${data.title}</h5>
      //        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
      //          <span aria-hidden="true">&times;</span>
      //        </button>
      //      </div>
      //      <div class="modal-body">
      //         <ul class="list-group"></ul>
      //         <textarea name="note" class="note-content"></textarea>
      //      </div>
      //      <div class="modal-footer">
      //        <button type="button" id="btn-save-note" data-id="${data._id} class="btn btn-secondary ">Save note</button>
      //        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      //     </div>`
      // );

      // let totalNotes = data.note;
      // console.log(totalNotes);

     
      // console.log(`did we make it here${totalNotes}`);
      // if(data.note == 0) {
      //   var msg = `<small class="text-muted">This article doesn't have any notes yet.</small>`;
      //   $('.modal-body').prepend(msg);
      // } else {
      //   let notes = data.note;

      //   notes.forEach(function(note) {
      //     $('.list-group').append(`
      //       <li class="list-group-item justify-content-between">${note.body}</li>
      //     `)
      //   })
      // }

    })
  // $('.modal').modal('show');
}

// $('.btn-view-notes').on("click", function() {
//   var _thisID = $(this).attr("data-id");
//   getNotes(_thisID);
// })



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




  // Whenever someone clicks a p tag
// $(document).on("click", "p", function() {
//     // Empty the notes from the note section
//     $("#notes").empty();
//     // Save the id from the p tag
//     var thisId = $(this).attr("data-id");

//     // Now make an ajax call for the Article
//     $.ajax({
//       method: "GET",
//       url: "/articles/" + thisId
//     })
//       // With that done, add the note information to the page
//       .then(function(data) {
//         console.log(data);
//         // The title of the article
//         $("#notes").append("<h2>" + data.title + "</h2>");
//         // An input to enter a new title
//         $("#notes").append("<input id='titleinput' name='title' >");
//         // A textarea to add a new note body
//         $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//         // A button to submit a new note, with the id of the article saved to it
//         $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//         // If there's a note in the article
//         if (data.note) {
//           // Place the title of the note in the title input
//           $("#titleinput").val(data.note.title);
//           // Place the body of the note in the body textarea
//           $("#bodyinput").val(data.note.body);
//         }
//       });
//   });

  // // When you click the savenote button
  // $(document).on("click", "#note-button", function() {
  //   // Grab the id associated with the article from the submit button
  //   var thisId = $(this).attr("data-id");

  //   // Run a POST request to change the note, using what's entered in the inputs
  //   $.ajax({
  //     method: "POST",
  //     url: "/articles/" + thisId,
  //     data: {
  //       // Value taken from title input
  //       title: $("#titleinput").val(),
  //       // Value taken from note textarea
  //       body: $("#bodyinput").val()
  //     }
  //   })
  //     // With that done
  //     .then(function(data) {
  //       // Log the response
  //       console.log(data);
  //       // Empty the notes section
  //       $("#notes").empty();
  //     });

  //   // Also, remove the values entered in the input and textarea for note entry
  //   $("#titleinput").val("");
  //   $("#bodyinput").val("");
  // });

  // const getNotes = function(thisID) {
//   $("#notes").empty();
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisID
//   })
//     .then(function(data) {
//       console.log(data);
//       data.forEach(function(el) {
//         $('#notes').append(`<li><strong>${data.title}</strong></li>`)
//       })

//     })
// }






