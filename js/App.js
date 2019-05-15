$(function () {
  const gameNode = document.getElementById('header');
  let currentGame = new Board(10);
  console.log(currentGame);

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

  let turn = 0;

  $('header').click(function (e) {
    switch (turn) {
      case 0:
        // move player
        movePlayer(turn, e);

        // check if player collected any new weapons on his way
        // swapWeapon();

        // swap weapons if yes
        // check abs value between players, if it's 1 enter fight mode
        // when fight is over, display winners name and quit = true;



        turn++;
        break;
      case 1:
        movePlayer(turn, e);





        turn--;
        break;
    }
  });

  function movePlayer(playerNumber, e) {
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
      let startLocation = currentGame.gameData[currentGame.players[playerNumber]._locationY][currentGame.players[playerNumber]._locationX];

      // pick up new weapon if there is any on players way
      console.log('locationX: ' + currentGame.players[playerNumber]._locationX);
      console.log('clickedCol: ' + clickedCol);
      console.log('locationY: ' + currentGame.players[playerNumber]._locationY);
      console.log('clickedRow: ' + clickedRow);
      let movingUp = (clickedCol === currentGame.players[playerNumber]._locationX) && (clickedRow < currentGame.players[playerNumber]._locationY);

      console.log('up' + movingUp);
      let movingDown = (clickedCol === currentGame.players[playerNumber]._locationX) && (clickedRow > currentGame.players[playerNumber]._locationY);
      console.log('down' + movingDown);
      let movingRight = false;
      let movingLeft = false;

      if(movingUp) {
        console.log('going up');
      } else if(movingDown) {
        console.log('going down');
      } else if(movingLeft) {
        console.log('going left');
      } else if(movingRight) {
        console.log('going right');
      }

      // clean data in start location
      startLocation.player = null;
      currentGame.players[playerNumber]._locationY = clickedRow;
      currentGame.players[playerNumber]._locationX = clickedCol;
      currentGame.drawPlayersPath(startLocation, false);

      // fill end location with new data
      endLocation.player = currentGame.players[playerNumber];

      // draw other players movement grid
      if (playerNumber === 0) {
        let otherPlayerLocation = getCurrentPlayerLocation(1);
        currentGame.drawPlayersPath(otherPlayerLocation, true);
      } else {
        let otherPlayerLocation = getCurrentPlayerLocation(0);
        currentGame.drawPlayersPath(otherPlayerLocation,true);
      }

      // currentGame.drawPlayersPath(endLocation, true);

      gameNode.removeChild(gameNode.childNodes[0]);
      gameNode.prepend(currentGame.createGameNode());

      // empty variables for next move
      endLocation = null;
      startLocation = null;
    }

  }

  function getCurrentPlayerLocation(playerNumber) {
    let y = currentGame.players[playerNumber]._locationY;
    let x = currentGame.players[playerNumber]._locationX;
    return currentGame.gameData[y][x];
  }

  console.log(getCurrentPlayerLocation(0));
  console.log(getCurrentPlayerLocation(1));

});

