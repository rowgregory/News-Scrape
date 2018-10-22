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
  var articleId = $(this).data('id');
  console.log('Pinged');
  $.ajax({
    url: `/articles/${articleId}`,
    method: 'GET',
  })
    .then(function (data) {
      console.log(data);
      // create modal
      $('.modal-content').html(`
           <div class="modal-header">
             <h5 class="modal-title">${data.title}</h5>
             <button type="button" class="close" data-dismiss="modal" aria-label="Close">
               <span aria-hidden="true">&times;</span>
             </button>
           </div>
           <div class="modal-body">
              <ul class="list-group"></ul>
              <textarea name="note" class="note-content"></textarea>
           </div>
           <div class="modal-footer">
             <button type="button" id="btn-save-note" data-id="${data._id} class="btn btn-secondary ">Save note</button>
             <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>`
      );

     
      // console.log(`did we make it here${totalNotes}`);
      if(data.note == 0) {
        var msg = `<small class="text-muted">This article doesn't have any notes yet.</small>`;
        $('.modal-body').prepend(msg);
      } else {
        let notes = data.note;

        // notes.forEach(function(note) {
        //   $('.list-group').append(`
        //     <li class="list-group-item justify-content-between">${note.body}</li>
        //   `)
        // })
      }

    })
  $('.modal').modal('show');
}



$('.btn-view-notes').on('click', getNotes);

$(document).on('click', '#btn-save-note', function() {;

  console.log('are we saving a note?');
  let id = $(this).attr('id');
  var content = $('.note-content').val().trim();

  if(content) {
    $.ajax({
      url: `/note/${id}`,
      method: 'POST',
      data: {body:content}
    })
    .then(function(data) {
      $('.note-content').val('');
      $('.modal').modal('hide');
    });
  } else {
    $('.note-content').val('');
    return;
  }
})




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



// $('li').on("click", function() {
//   var _thisID = $(this).attr("data-id");
//   getNotes(_thisID);
// })


