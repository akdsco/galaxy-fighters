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

  // define game loop that keep on looping until game is over and alternates turns between players
  let quit = false; // not in use for developing / testing time
  let i = 0;

  while (i < 4) {
    let activePlayer = 1;

    switch (activePlayer) {
      case 1:
        // move player
        // check if player collected any new weapons on a way
        // swap weapons if yes
        // check abs value between players, if it's 1 enter fight mode
        // when fight is over, display winners name and quit = true;

        activePlayer = 2;
        break;
      case 2:


        activePlayer = 1;
        break;
    }

    i++;
    // quit = true;
  }
  // Create event handler to listen for clicks on table and when user does click, get back with information about
  // which location user selected (clicked)
  $('header').click(function (e) {
    let idString;
    // making sure we capture clickedRow and clickedCol even if you click on child node of 'TD' element
    if (e.target.nodeName === 'P') {
      idString = e.target.parentNode.id;
    } else if (e.target.nodeName === 'TD') {
      idString = e.target.id;
    }

    let clickedRow = idString[4];
    let clickedCol = idString[6];

    // debug for now
    // console.log('clickedRow: ' + clickedRow);
    // console.log('clickedCol: ' + clickedCol);

    let endLocation = currentGame.gameData[clickedRow][clickedCol];

    // check if user clicked on a "good" cell
    if (endLocation.isAvailable) {
      console.log('can move there');
      let startLocation = currentGame.gameData[currentGame.players[0].locationX][currentGame.players[0].locationY];

      // clean data in start location
      startLocation.player = null;
      currentGame.players[0].locationX = clickedRow;
      currentGame.players[0].locationY = clickedCol;
      currentGame.drawPlayersPath(startLocation, false);

      // fill end location with new data
      endLocation.player = currentGame.players[0];
      currentGame.drawPlayersPath(endLocation, true);

      gameNode.removeChild(gameNode.childNodes[0]);
      gameNode.prepend(currentGame.createGameNode());

      // empty variables for next move
      endLocation = null;
      startLocation = null;
    }


    // if yes, change gameData

    // redraw the board so that it reflects new state after users choice

    // }


  });


  if ($('header').length) {
    console.log('passed header');
  }

  if ($('td').length) {
    console.log('passed TR');
  }

});