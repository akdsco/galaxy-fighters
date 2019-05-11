$(function () {
  const gameNode = document.getElementById('header');
  let currentGame = new Board(10);

  $('#play-button').on('click', function () {
    gameNode.prepend(currentGame.createGameNode());
    $('#restart-button').show();
    $('#header').css("padding-top", ".3%");
    $('#title-h1').hide();
    $('#play-button').hide();
  });

  $('#restart-button').on('click', function () {
    gameNode.removeChild(gameNode.childNodes[0]);
    currentGame = new Board(10);
    gameNode.prepend(currentGame.createGameNode());
  });

  // Create event handle to listen for clicks on a table and when user does click, get back with information about
  // which field user selected (clicked)

  $('header').click(function (e) {
    let idString;
    // making sure we don't capture any other clicks other than on 'TD' elements
    if (e.target.nodeName === 'TD') {
      // making sure we capture row and col even if you click on child node of 'TD' element
      if (e.target.nodeName === 'P') {
        idString = e.target.parentNode.id;
      } else {
        idString = e.target.id;
      }

      let row = idString[4];
      let col = idString[6];
      // debug for now
      console.log('row: ' + row);
      console.log('col: ' + col);

      let selectedLocation = currentGame.gameData[row][col];

      // check if user clicked on a "good" cell

      // if yes, change gameData

      // redraw the board so that it reflects new state after users choice

    }


  });






  if($('header').length) {
    console.log('passed header');
  }

  if($('td').length) {
    console.log('passed TR');
  }

});