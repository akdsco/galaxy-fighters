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
            console.log(currentGame.gameData);

            // check if player collected any new weapons on his way
            // swapWeapon();

            // swap weapons if yes
            // check abs value between players, if it's 1 enter fight mode
            // when fight is over, display winners name and quit = true;


            turn++;
            break;
          case 1:
            movePlayer(turn, e);
            console.log(currentGame.gameData);

            turn--;
            break;
        }
      }
    }
  });

  function movePlayer(playerNumber, e) {
    let startLocationID;
    let endLocationID;

    // making sure we capture endY and endX even if you click on child node of 'TD' element
    if (e.target.nodeName === 'P') {
      endLocationID = e.target.parentNode.id;
    } else if (e.target.nodeName === 'TD') {
      endLocationID = e.target.id;
    }

    let endX = parseInt(endLocationID[6]);
    let endY = parseInt(endLocationID[4]);
    endLocationID = '#' + endLocationID;

    // debug for now
    // console.log('endY: ' + endY);
    // console.log('endX: ' + endX);

    let endLocation = currentGame.gameData[endY][endX];

    // check if user clicked on a "good" cell
    let startX = currentGame.players[playerNumber]._playerLocationX;
    let startY = currentGame.players[playerNumber]._playerLocationY;
    startLocationID = '#loc_' + startY + '_' + startX;

    let startLocation = currentGame.gameData[startY][startX];

    if (endLocation.isAvailable) {

      // pick up new weapon if there is any on players way
      // console.log('startX: ' + startX);
      // console.log('startY: ' + startY);
      // console.log('endX: ' + endX);
      // console.log('endY: ' + endY);

      let movingUp = ((endX === startX) && (endY < startY));
      let movingDown = (endX === startX) && (endY > startY);
      let movingRight = ((endY === startY) && (endX > startX));
      let movingLeft = ((endY === startY) && (endX < startX));

      if(movingUp) {
        console.log('going up');
        for (let i = 1; i < (startY - endY + 1); i++) {
          if(currentGame.gameData[startY - i][endX].weapon !== null) {
            console.log('location: y' + (startY - i) + ', x' + endX + ' contains weapon');

            // swap weapons
            let tempWeapon = currentGame.players[playerNumber]._weapon;
            currentGame.players[playerNumber]._weapon = currentGame.gameData[startY - i][endX].weapon;
            currentGame.gameData[startY - i][endX].weapon = tempWeapon;

            // re-draw nodes
            let weaponLocation = '#loc_'+ (startY - i) + '_' + endX;
            let pNode = document.createElement('p');
            pNode.innerText = currentGame.gameData[startY - i][endX].weapon.name[0] + '-' + currentGame.gameData[startY - i][endX].weapon.name[7];
            $(weaponLocation + '>p').replaceWith(pNode);
          }
        }
      } else if(movingDown) {
        console.log('going down');
        for (let i = 1; i < (endY - startY + 1); i++) {
          if(currentGame.gameData[startY + i][endX].weapon !== null) {
            console.log('location: y' + (startY + i) + ', x' + endX + ' contains weapon');

            //swap weapons
            let tempWeapon = currentGame.players[playerNumber]._weapon;
            currentGame.players[playerNumber]._weapon = currentGame.gameData[startY + i][endX].weapon;
            currentGame.gameData[startY + i][endX].weapon= tempWeapon;

            //re-draw nodes
            let weaponLocation = '#loc_' + (startY + i) + '_' + endX;
            let pNode = document.createElement('p');
            pNode.innerText = currentGame.gameData[startY + i][endX].weapon.name[0] + '-' + currentGame.gameData[startY + i][endX].weapon.name[7];
            $(weaponLocation + '>p').replaceWith(pNode);
          }
        }
      } else if(movingLeft) {
        console.log('going left');
        for (let i = 1; i < (startX - endX + 1); i++) {
          if(currentGame.gameData[endY][startX - i].weapon !== null) {
            console.log('location: y' + (endY) + ', x' + (startX - i) + ' contains weapon');

            //swap weapons
            let tempWeapon = currentGame.players[playerNumber]._weapon;
            currentGame.players[playerNumber]._weapon = currentGame.gameData[endY][startX - i].weapon;
            currentGame.gameData[endY][startX - i].weapon= tempWeapon;

            //re-draw nodes
            let weaponLocation = '#loc_' + endY + '_' + (startX - i);
            let pNode = document.createElement('p');
            pNode.innerText = currentGame.gameData[endY][startX - i].weapon.name[0] + '-' + currentGame.gameData[endY][startX - i].weapon.name[7];
            $(weaponLocation + '>p').replaceWith(pNode);
          }
        }
      } else if(movingRight) {
        console.log('going right');
        for (let i = 1; i < (endX - startX + 1); i++) {
          if(currentGame.gameData[endY][startX + i].weapon !== null) {
            console.log('location: y' + (endY) + ', x' + (startX + i) + ' contains weapon');

            //swap weapons
            let tempWeapon = currentGame.players[playerNumber]._weapon;
            currentGame.players[playerNumber]._weapon = currentGame.gameData[endY][startX + i].weapon;
            currentGame.gameData[endY][startX + i].weapon= tempWeapon;

            //re-draw nodes
            let weaponLocation = '#loc_' + endY + '_' + (startX + i);
            let pNode = document.createElement('p');
            pNode.innerText = currentGame.gameData[endY][startX + i].weapon.name[0] + '-' + currentGame.gameData[endY][startX + i].weapon.name[7];
            $(weaponLocation + '>p').replaceWith(pNode);
          }
        }

      }

      // clean data in start location
      startLocation.player = null;
      currentGame.drawPlayersPath(startLocation, false);

      // change players location fields
      currentGame.players[playerNumber]._playerLocationY = endY;
      currentGame.players[playerNumber]._playerLocationX = endX;

      // move player object to new location
      endLocation.player = currentGame.players[playerNumber];

      // enable movement for next player
      if (playerNumber === 0) {
        let otherPlayerLocation = getCurrentPlayerLocation(1);
        currentGame.drawPlayersPath(otherPlayerLocation, true);
      } else {
        let otherPlayerLocation = getCurrentPlayerLocation(0);
        currentGame.drawPlayersPath(otherPlayerLocation,true);
      }

      if (playerNumber === 0) {
        $(startLocationID).toggleClass('playerOne');
        $(endLocationID).toggleClass('playerOne');
        $(startLocationID).remove($('p').remove('.playerNodeOne'));
        let pNode = document.createElement('p');
        pNode.innerText = currentGame.players[playerNumber]._name[0] + '' + currentGame.players[playerNumber]._number;
        pNode.classList.add('playerNodeOne');
        $(endLocationID).append(pNode);
      } else {
        $(startLocationID).toggleClass('playerTwo');
        $(endLocationID).toggleClass('playerTwo');
        $(startLocationID).remove($('p').remove('.playerNodeTwo'));
        let pNode = document.createElement('p');
        pNode.innerText = currentGame.players[playerNumber]._name[0] + '' + currentGame.players[playerNumber]._number;
        pNode.classList.add('playerNodeTwo');
        $(endLocationID).append(pNode);
      }

    }

  }

  function getCurrentPlayerLocation(playerNumber) {
    let y = currentGame.players[playerNumber]._playerLocationY;
    let x = currentGame.players[playerNumber]._playerLocationX;
    return currentGame.gameData[y][x];
  }

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

