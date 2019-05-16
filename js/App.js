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
    console.log('restart, player: ' + (turn + 1));
  });

  let turn = 0;

  $('header').click(function (e) {
    if ((e.target.nodeName === 'P') || (e.target.nodeName === 'TD')) {
      if (isClicable(e)) {
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
            console.log('next player: ' + (turn + 1));
            break;
          case 1:
            movePlayer(turn, e);


            turn--;
            console.log('next player: ' + (turn + 1));
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

    let clickedX = idString[6];
    let clickedY = idString[4];

    // debug for now
    // console.log('clickedY: ' + clickedY);
    // console.log('clickedX: ' + clickedX);

    let endLocation = currentGame.gameData[clickedY][clickedX];

    // check if user clicked on a "good" cell
    if (endLocation.isAvailable) {
      let startLocation = currentGame.gameData[currentGame.players[playerNumber]._playerLocationY][currentGame.players[playerNumber]._playerLocationX];

      // pick up new weapon if there is any on players way
      let currentX = currentGame.players[playerNumber]._playerLocationX;
      let currentY = currentGame.players[playerNumber]._playerLocationY;
      console.log('currentX: ' + currentX);
      console.log('clickedX: ' + clickedX);
      console.log('currentY: ' + currentY);
      console.log('clickedY: ' + clickedY);

      let movingUp = (clickedX === currentX) && (clickedY < currentY);
      console.log('up ' + movingUp);
      let movingDown = (clickedX === currentX) && (clickedY > currentY);
      console.log('down ' + movingDown);
      let movingRight = false;
      let movingLeft = false;

      if(movingUp) {
        console.log('going up');
        for (let i = 0; i < (currentY - clickedY); i++) {
          if(currentGame.gameData[currentY][currentX - i].weapon !== null) {
            console.log('location: ' + currentY + ',' + (currentX - i) + ' contains weapon');
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

  function isClicable(e) {
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

