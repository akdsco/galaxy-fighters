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
    turn = 0;
  });

  $('#restart-button').on('click', function () {
    gameNode.removeChild(gameNode.childNodes[0]);
    currentGame = new Board(10);
    gameNode.prepend(currentGame.createGameNode());
    turn = 0;
  });

  let turn = 0;

  $('header').click(function (e) {
    if ((e.target.nodeName === 'P') || (e.target.nodeName === 'TD')) {
      if (isAvailable(e)) {
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
      }
    }
  });

  function movePlayer(playerNumber, e) {
    let idString;

    // making sure we capture clickedY and clickedX even if you click on child node of 'TD' element
    if (e.target.nodeName === 'P') {
      idString = e.target.parentNode.id;
    } else if (e.target.nodeName === 'TD') {
      idString = e.target.id;
    }

    let clickedX = parseInt(idString[6]);
    let clickedY = parseInt(idString[4]);

    // debug for now
    // console.log('clickedY: ' + clickedY);
    // console.log('clickedX: ' + clickedX);

    let endLocation = currentGame.gameData[clickedY][clickedX];

    // check if user clicked on a "good" cell
    if (endLocation.isAvailable) {
      let currentX = currentGame.players[playerNumber]._playerLocationX;
      let currentY = currentGame.players[playerNumber]._playerLocationY;

      let startLocation = currentGame.gameData[currentY][currentX];

      // pick up new weapon if there is any on players way
      console.log('currentX: ' + currentX);
      console.log('clickedX: ' + clickedX);
      console.log('currentY: ' + currentY);
      console.log('clickedY: ' + clickedY);

      let movingUp = ((clickedX === currentX) && (clickedY < currentY));
      let movingDown = (clickedX === currentX) && (clickedY > currentY);
      let movingRight = ((clickedY === currentY) && (clickedX > currentX));
      let movingLeft = ((clickedY === currentY) && (clickedX < currentX));

      if(movingUp) {
        console.log('going up');
        for (let i = 1; i < (currentY - clickedY + 1); i++) {
          if(currentGame.gameData[currentY][clickedX - i].weapon !== null) {
            console.log('location: ' + currentY + ',' + (clickedX - i) + ' contains weapon');
          }
        }
      } else if(movingDown) {
        console.log('going down');
      } else if(movingLeft) {
        console.log('going left');
      } else if(movingRight) {
        console.log('going right');
      }

      // clean data in start location
      startLocation.player = null;
      currentGame.players[playerNumber]._playerLocationY = clickedY;
      currentGame.players[playerNumber]._playerLocationX = clickedX;
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
    let y = currentGame.players[playerNumber]._playerLocationY;
    let x = currentGame.players[playerNumber]._playerLocationX;
    return currentGame.gameData[y][x];
  }

  console.log(getCurrentPlayerLocation(0));
  console.log(getCurrentPlayerLocation(1));

  function isAvailable(e) {
    let idString = '';

    if (e.target.nodeName === 'P') {
      idString = e.target.parentNode.id;
    } else if (e.target.nodeName === 'TD') {
      idString = e.target.id;
    }

    let clickedX = idString[6];
    let clickedY = idString[4];

    let clickedLocation = currentGame.gameData[clickedY][clickedX];

    return clickedLocation.isAvailable;

  }

});

