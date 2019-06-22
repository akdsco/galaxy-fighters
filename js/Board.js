class Board {
  constructor(size) {
    this._size = size;
    this._gameData = [];
    this._playerData = [];
    this._weaponStorage = [{name: 'Red Saber', damage: 20, src: 'img/weapon/red-saber.png'},
                          {name: 'Mighty Sword', damage: 30, src: 'img/weapon/sword.png'},
                          {name: 'Long Rifle', damage: 40, src: 'img/weapon/rifle.png'},
                          {name: 'Machine Gun', damage: 50, src: 'img/weapon/m42.png'}];
    this._players = [new Player('Yoda'),
                    new Player('Vader')];
    this._spawnFlag = true;
    this._stoppedOnWeapon = ['',''];
    this._initializeGameData();
    this._addBlockedLocations(17);
    this._addWeapons(this._weaponStorage.length);
    this._addPlayers(this._players);
    this._addPlayerStats();
    // as a final step
    this.createGameNode();
  }

  // populate _gameData array with Location objects
  _initializeGameData() {
    for (let i = 0; i < this._size; i++) {
      this._gameData[i] = [];
      for (let j = 0; j < this._size; j++) {
        this._gameData[i][j] = new Location(i,j);
      }
    }
  }

  // block random locations (creating field with obstacles)
  _addBlockedLocations(quantity) {
    let i = 0;
    while (i < quantity) {
      let randomLocation = this._randomLocation();
      if (!randomLocation.isBlocked) {
        randomLocation.isBlocked = true;
        i++;
      }
      randomLocation = null;
    }
  }

  // adding weapons from _weaponStorage to randomly selected, available locations
  _addWeapons(quantity) {
    let i = 0;
    while (i < quantity) {
      let randomLocation = this._randomLocation();
      if (!randomLocation.isBlocked && randomLocation.weapon === null) {
        randomLocation.weapon = this._weaponStorage[i];
        // print distribution of weapons to console for testing
        // console.log('locY' + _randomLocation.locY + ',' + 'x' + _randomLocation.locX + ' = ' + _randomLocation.weapon.name + " - " + _randomLocation.weapon.damage);
        i++;
      }
    }
  }

  // adding _players to random locations in top left and bottom right corners (away from each other)
  _addPlayers(array) {
    let flag = true;
    for (let i = 0; i < array.length; i++) {
      this._playerData[i] = [];
      let randomLocation = this._randomStartLocation();
      for (let j = 0; j < array.length; j++) {
        switch (j) {
          case 0:
            this._playerData[i][j] = randomLocation.locY;
            break;
          case 1:
            this._playerData[i][j] = randomLocation.locX;
            break;
        }
      }
      randomLocation.player = array[i];
      if (flag) {
        this._drawPlayersPath(randomLocation, true);
        flag = !flag;
      }
    }
  }

  // drawing or erasing _players available 'walk' path
  _drawPlayersPath(startLocation, value, playerNumber) {
    for (let i = 0; i < 4; i++) {
      start: for (let j = 1; j < 4; j++) {

        // empty imgNode with half-opacity player img
        const imgNode = document.createElement('img');
        imgNode.classList.add('half-opacity');

        switch (i) {
          case 0: // moving up
            if ((startLocation.locY - j) < 0) {
              // if player is currently at top border of board, skip direction
              break start;
            } else {
              // if location above is blocked or occupied by other player, skip direction
              if ((this._gameData[startLocation.locY - j][startLocation.locX].isBlocked) || (this._gameData[startLocation.locY - j][startLocation.locX].player !== null)) {
                break start;
              } else {
                // location is available, add half-opacity player img and toggle class 'available'
                this._gameData[startLocation.locY - j][startLocation.locX].isAvailable = value;
                // change display
                let idString = '#loc_' + (startLocation.locY - j) + '_' + startLocation.locX;
                $(idString).toggleClass('available');
                this._modifySquareImg(idString, playerNumber, value, imgNode);
              }
            }
            break;
          case 1: // moving down
            if ((startLocation.locY + j) > (this._size - 1)) {
              // if player is currently at bottom border of board, skip direction
              break start;
            } else {
              // if location below is blocked or occupied by other player, skip direction
              if ((this._gameData[startLocation.locY + j][startLocation.locX].isBlocked) || (this._gameData[startLocation.locY + j][startLocation.locX].player !== null)) {
                break start;
              } else {
                // location is available, add half-opacity player img and toggle class 'available'
                this._gameData[startLocation.locY + j][startLocation.locX].isAvailable = value;
                // change display
                let idString = '#loc_' + (startLocation.locY + j) + '_' + startLocation.locX;
                $(idString).toggleClass('available');
                this._modifySquareImg(idString, playerNumber, value, imgNode);
              }
            }
            break;
          case 2: // moving left
            if ((startLocation.locX - j) < 0) {
              // if player is currently at left border of board, skip direction
              break start;
            } else {
              // if location on left is blocked or occupied by other player, skip direction
              if ((this._gameData[startLocation.locY][startLocation.locX - j].isBlocked) || (this._gameData[startLocation.locY][startLocation.locX - j].player !== null)) {
                break start;
              } else {
                // location is available, add half-opacity player img and toggle class 'available'
                this._gameData[startLocation.locY][startLocation.locX - j].isAvailable = value;
                // change display
                let idString = '#loc_' + (startLocation.locY) + '_' + (startLocation.locX - j);
                $(idString).toggleClass('available');
                this._modifySquareImg(idString, playerNumber, value, imgNode);
              }
            }
            break;
          case 3: // moving right
            if ((startLocation.locX + j) > (this._size - 1)) {
              // if player is currently at right border of board, skip direction
              break start;
            } else {
              // if location on right is blocked or occupied by other player, skip direction
              if ((this._gameData[startLocation.locY][startLocation.locX + j].isBlocked) || (this._gameData[startLocation.locY][startLocation.locX + j].player !== null)) {
                break start;
              } else {
                // location is available, add half-opacity player img and toggle class 'available'
                this._gameData[startLocation.locY][startLocation.locX + j].isAvailable = value;
                // change display
                let idString = '#loc_' + (startLocation.locY) + '_' + (startLocation.locX + j);
                $(idString).toggleClass('available');
                this._modifySquareImg(idString, playerNumber, value, imgNode);
              }
            }
        }
      }
    }
  }

  // draw board based on array and return html NODE to inject to index
  createGameNode() {
    let gameNode = document.createElement('table');
    gameNode.setAttribute('id', 'gameTable');

    for (let i = 0; i < this._size; i++) {
      let tr = document.createElement('tr');
      for (let j = 0; j < this._size; j++) {
        tr.appendChild(this._gameData[i][j].createLocationNode());
      }
      gameNode.appendChild(tr);
    }
    return gameNode;
  }

  // fill stats box with relevant data
  _addPlayerStats() {
    for (let i = 0; i < 2; i++){
      $('#player-' + i + '-Name').text(this._players[i].name);
      $('#player-' + i + '-Health').text('Health: ' + this._players[i].health);
      $('#player-' + i + '-WeaponName').text(this._players[i].weapon.name);
      $('#player-' + i + '-Damage').text('Damage: ' + this._players[i].weapon.damage);
    }
  }

  // move player from start to end square
  async movePlayer(playerNumber, endLocationID) {

    let endX = parseInt(endLocationID[6]);
    let endY = parseInt(endLocationID[4]);

    let startX = this._playerData[playerNumber][1];
    let startY = this._playerData[playerNumber][0];

    let direction = '';
    let movePlayer = 1;

    if((endX === startX) && (endY < startY)) {
      direction = 'up';
      movePlayer += (startY - endY);
    }else if((endX === startX) && (endY > startY)) {
      direction = 'down';
      movePlayer += (endY - startY);
    }else if((endY === startY) && (endX < startX)) {
      direction = 'left';
      movePlayer += (startX - endX);
    }else if((endY === startY) && (endX > startX)) {
      direction = 'right';
      movePlayer += (endX - startX);
    }

    // disable current _players available fields
    let startLocation = this._gameData[startY][startX];
    this._drawPlayersPath(startLocation, false, playerNumber);

    for (let i = 1; i < movePlayer; i++) {
      this._migratePlayer(playerNumber, direction);
      await sleep(400);
    }

    // move _players data to new square
    this._gameData[endY][endX].player = startLocation.player;
    startLocation.player = null;

    if (playerNumber === 0) {
      let nextPlayerLocation = this._getCurrentPlayerLocation(1);
      this._drawPlayersPath(nextPlayerLocation, true, playerNumber);
    } else {
      let nextPlayerLocation = this._getCurrentPlayerLocation(0);
      this._drawPlayersPath(nextPlayerLocation, true, playerNumber);
    }

  }

  // migrates data and changes visual representation on table
  _migratePlayer(playerNumber, direction) {
    if (direction === 'up'){
      this._migrateUp(playerNumber,direction);
    }else if(direction === 'down'){
      this._migrateDown(playerNumber,direction);
    }else if(direction === 'right'){
      this._migrateRight(playerNumber,direction);
    }else if(direction === 'left'){
      this._migrateLeft(playerNumber,direction);
    }
  }

  _migrateUp(playerNumber, direction) {
    if (direction === 'up') {
      let startLocation = this._getCurrentPlayerLocation(playerNumber);
      let startLocationID = '#loc_' + this._playerData[playerNumber][0] + '_' + this._playerData[playerNumber][1];
      let endLocation = this._gameData[this._playerData[playerNumber][0] - 1][this._playerData[playerNumber][1]];
      let endLocationID = '#loc_' + (this._playerData[playerNumber][0] - 1) + '_' + this._playerData[playerNumber][1];

      // debug
      // console.log(startLocationID,endLocationID);

      // if player is to reveal weapon which he stands on, show it
      if (this._stoppedOnWeapon[playerNumber] !== '') {
        let locationID = this._stoppedOnWeapon[playerNumber];
        setTimeout(() => {
          $(locationID + ' .weapon-container').show(200);
        }, 300);
        this._stoppedOnWeapon[playerNumber] = '';
      }

      // empty weapon node
      let weaponImgNode = document.createElement('img');
      weaponImgNode.classList.add('weapon');

      // if next location has weapon, swap them
      if (endLocation.weapon !== null) {
        $(endLocationID + ' .weapon-container img').replaceWith(this._swapWeapons(endLocationID, endLocation, playerNumber, weaponImgNode));
      }

      // move player container
      $(startLocationID + ' .player-container').fadeOut(200, () => {
        $(endLocationID).prepend($(startLocationID + ' .player-container'));

        // change _players weapon in hand
        let weaponImgNodeClone = weaponImgNode.cloneNode(false);
        weaponImgNodeClone.setAttribute('src', this._players[playerNumber].weapon.src);
        weaponImgNodeClone.setAttribute('title', this._players[playerNumber].weapon.name + ' does ' + this._players[playerNumber].weapon.damage + ' damage.');

        // continue moving player
        $(endLocationID + ' .player-container .weapon').replaceWith(weaponImgNodeClone);
        $(endLocationID + ' .player-container').fadeIn(200);
      });

      // adjust Y location
      this._playerData[playerNumber][0]--;
      this._enterFight(playerNumber);
    }
  }

  _migrateDown(playerNumber, direction) {
    let startLocation = this._getCurrentPlayerLocation(playerNumber);
    let startLocationID = '#loc_' + this._playerData[playerNumber][0] + '_' + this._playerData[playerNumber][1];
    let endLocation = this._gameData[this._playerData[playerNumber][0] + 1][this._playerData[playerNumber][1]];
    let endLocationID = '#loc_' + (this._playerData[playerNumber][0] + 1) + '_' + this._playerData[playerNumber][1];

    // debug
    // console.log(startLocationID,endLocationID);

    // if player is to reveal weapon which he stands on, show it
    if (this._stoppedOnWeapon[playerNumber] !== '') {
      let locationID = this._stoppedOnWeapon[playerNumber];
      setTimeout(() => {
        $(locationID + ' .weapon-container').show(200);
      }, 300);
      this._stoppedOnWeapon[playerNumber] = '';
    }

    // empty weapon node
    let weaponImgNode = document.createElement('img');
    weaponImgNode.classList.add('weapon');

    // if next location has weapon, swap them
    if (endLocation.weapon !== null) {
      $(endLocationID + ' .weapon-container img').replaceWith(this._swapWeapons(endLocationID,endLocation,playerNumber,weaponImgNode));
    }

    // move player container
    $(startLocationID + ' .player-container').fadeOut(200, () => {
      $(endLocationID).prepend($(startLocationID + ' .player-container'));

      // change _players weapon in hand
      let weaponImgNodeClone = weaponImgNode.cloneNode(false);
      weaponImgNodeClone.setAttribute('src', this._players[playerNumber].weapon.src);
      weaponImgNodeClone.setAttribute('title', this._players[playerNumber].weapon.name + ' does ' + this._players[playerNumber].weapon.damage + ' damage.');

      // continue moving player
      $(endLocationID + ' .player-container .weapon').replaceWith(weaponImgNodeClone);
      $(endLocationID + ' .player-container').fadeIn(200);
    });

    // adjust Y location
    this._playerData[playerNumber][0]++;
    this._enterFight(playerNumber);
  }

  _migrateRight(playerNumber, direction) {
    let startLocation = this._getCurrentPlayerLocation(playerNumber);
    let startLocationID = '#loc_' + this._playerData[playerNumber][0] + '_' + this._playerData[playerNumber][1];
    let endLocation = this._gameData[this._playerData[playerNumber][0]][this._playerData[playerNumber][1] + 1];
    let endLocationID = '#loc_' + this._playerData[playerNumber][0] + '_' + (this._playerData[playerNumber][1] + 1);

    // debug
    // console.log(startLocationID,endLocationID);

    // if player is to reveal weapon which he stands on, show it
    if (this._stoppedOnWeapon[playerNumber] !== '') {
      let locationID = this._stoppedOnWeapon[playerNumber];
      setTimeout(() => {
        $(locationID + ' .weapon-container').show(200);
      }, 300);
      this._stoppedOnWeapon[playerNumber] = '';
    }

    // empty weapon node
    let weaponImgNode = document.createElement('img');
    weaponImgNode.classList.add('weapon');

    // if next location has weapon, swap them
    if (endLocation.weapon !== null) {
      $(endLocationID + ' .weapon-container img').replaceWith(this._swapWeapons(endLocationID,endLocation,playerNumber,weaponImgNode));
    }

    // move _players container
    $(startLocationID + ' .player-container').fadeOut(200, () => {
      $(endLocationID).prepend($(startLocationID + ' .player-container'));

      // change _players weapon in hand
      let weaponImgNodeClone = weaponImgNode.cloneNode(false);
      weaponImgNodeClone.setAttribute('src', this._players[playerNumber].weapon.src);
      weaponImgNodeClone.setAttribute('title', this._players[playerNumber].weapon.name + ' does ' + this._players[playerNumber].weapon.damage + ' damage.');

      // continue moving player
      $(endLocationID + ' .player-container .weapon').replaceWith(weaponImgNodeClone);
      $(endLocationID + ' .player-container').fadeIn(200);
    });

    // adjust X location
    this._playerData[playerNumber][1]++;
    this._enterFight(playerNumber);
  }

  _migrateLeft(playerNumber, direction) {
    let startLocation = this._getCurrentPlayerLocation(playerNumber);
    let startLocationID = '#loc_' + this._playerData[playerNumber][0] + '_' + this._playerData[playerNumber][1];
    let endLocation = this._gameData[this._playerData[playerNumber][0]][this._playerData[playerNumber][1] - 1];
    let endLocationID = '#loc_' + this._playerData[playerNumber][0] + '_' + (this._playerData[playerNumber][1] - 1);

    // debug
    // console.log(startLocationID,endLocationID);

    // if player is to reveal weapon which he stands on, show it
    if (this._stoppedOnWeapon[playerNumber] !== '') {
      let locationID = this._stoppedOnWeapon[playerNumber];
      setTimeout(() => {
        $(locationID + ' .weapon-container').show(200);
      }, 300);
      this._stoppedOnWeapon[playerNumber] = '';
    }

    // empty weapon node
    let weaponImgNode = document.createElement('img');
    weaponImgNode.classList.add('weapon');

    // if next location has weapon, swap them
    if (endLocation.weapon !== null) {
      $(endLocationID + ' .weapon-container img').replaceWith(this._swapWeapons(endLocationID,endLocation,playerNumber,weaponImgNode));
    }

    // move player container
    $(startLocationID + ' .player-container').fadeOut(200, () => {
      $(endLocationID).prepend($(startLocationID + ' .player-container'));

      // change _players weapon in hand
      let weaponImgNodeClone = weaponImgNode.cloneNode(false);
      weaponImgNodeClone.setAttribute('src', this._players[playerNumber].weapon.src);
      weaponImgNodeClone.setAttribute('title', this._players[playerNumber].weapon.name + ' does ' + this._players[playerNumber].weapon.damage + ' damage.');

      // continue moving player
      $(endLocationID + ' .player-container .weapon').replaceWith(weaponImgNodeClone);
      $(endLocationID + ' .player-container').fadeIn(200);
    });

    // adjust X location
    this._playerData[playerNumber][1]--;
    this._enterFight(playerNumber);
  }

  // disable board and brings fight modal on
  async _enterFight(playerNumber) {
    const playerOneY = this._playerData[0][0];
    const playerTwoY = this._playerData[1][0];
    const playerOneX = this._playerData[0][1];
    const playerTwoX = this._playerData[1][1];

    // debug
    // console.log('X: ' + Math.abs(playerOneY - playerTwoY));
    // console.log('Y: ' + Math.abs(playerTwoX - playerOneX));

    if ((((Math.abs(playerOneY - playerTwoY)) === 0) && ((Math.abs(playerOneX - playerTwoX)) <= 1)) ||
        (((Math.abs(playerOneX - playerTwoX)) === 0) && ((Math.abs(playerOneY - playerTwoY)) <= 1))) {
      // move content from stats to modal
      $('#fightBody').append($('#fightBox'));
      // erase game board
      $('main').fadeOut(300);
      await sleep(500);
      // $('main').remove();

      // make sure CSS will work as intended afterwards
      $('.player-container-stats').css({'position':'relative','margin':'auto'});
      $('.statsBox').css({'border':'5px solid #989898'});
      // open modal without option of closing it down by clicking away from it
      $('#fightMode').modal({
        backdrop: 'static'
      });

      // set up css for turn (depending on who attacked, gets to attack or defend first)
      $('#player-' + playerNumber + '-Box').css({'border':'5px solid green'});
      if (playerNumber === 1) {
        playerNumber--;
      } else {
        playerNumber++;
      }
      $('#player-' + playerNumber + '-Defend').prop('disabled', true);
      $('#player-' + playerNumber + '-Attack').prop('disabled', true);

    }
  }

  // changes data after players attack
  attack(playerNumber,p0,p1) {

    if(playerNumber === 0) {

      // swap sides
      $(p0 + 'Box').css({'border':'5px solid green'});
      if (this._players[0].isDefending) {
        console.log('a');
        $(p0 + 'Defend').prop('disabled', false);
        $(p0 + 'Attack').prop('disabled', false);
      } else {
        $(p0 + 'Defend').prop('disabled', false);
        $(p0 + 'Attack').prop('disabled', false);
      }

      // calculate damage and adjust health level
      let damage = this._players[1].weapon.damage;
      if (this._players[0].isDefending) {
        damage /= 2;
        this._players[0].isDefending = false;
        $(p0 + 'Container ' + 'img:last-child').remove();
      }
      if (this._players[0].health <= damage) {
        this._players[0].health = 0;
      } else {
        this._players[0].health -= damage;
      }


      // check if player 1 won
      if (this._isPlayerOutOfBreath() === 0) {
        this._displayGameWinner(1);
      }

      // update front-end
      $(p0 + 'Health').text('Health: ' + this._players[0].health);
      $(p1 + 'Box').css({'border':'5px solid grey'});
      $(p1 + 'Defend').prop('disabled', true);
      $(p1 + 'Attack').prop('disabled', true);
    } else {

      // swap sides
      $(p1 + 'Box').css({'border':'5px solid green'});
      if (this._players[1].isDefending) {
        console.log('b');
        $(p1 + 'Defend').prop('disabled', false);
        $(p1 + 'Attack').prop('disabled', false);
      } else {
        $(p1 + 'Defend').prop('disabled', false);
        $(p1 + 'Attack').prop('disabled', false);
      }

      // calculate damage done by player one and adjust his health level
      let damage = this._players[0].weapon.damage;
      if (this._players[1].isDefending) {
        damage /= 2;
        this._players[1].isDefending = false;
        $(p1 + 'Container ' + 'img:last-child').remove();
      }
      if (this._players[1].health <= 0) {
        this._players[0].health = 0;
      } else {
        this._players[1].health -= damage;
      }

      // check if player 1 won
      if (this._isPlayerOutOfBreath() === 1) {
        this._displayGameWinner(0);
      }

      // update front-end
      $(p1 + 'Health').text('Health: ' + this._players[1].health);
      $(p0 + 'Box').css({'border':'5px solid grey'});
      $(p0 + 'Defend').prop('disabled', true);
      $(p0 + 'Attack').prop('disabled', true);
    }
  }

  // changes data after _players defense deployment
  defend(playerNumber, p0, p1) {

    // shield image node
    let shieldImgNode = document.createElement('img');
    shieldImgNode.setAttribute('src','../img/weapon/shield.png');
    shieldImgNode.setAttribute('display','none');
    shieldImgNode.classList.add('shield');

    if(playerNumber === 0) {
      console.log('turn on player 1 defense');

      // append shield
      $(p1 + 'Container').append(shieldImgNode);
      $(p1 + 'Defend').prop('disabled', true);
      $(p1 + 'Attack').prop('disabled', true);

      // switch isDefending flag
      this._players[1].isDefending = true;

      // swap sides
      $(p1 + 'Box').css({'border':'5px solid grey'});
      $(p0 + 'Box').css({'border':'5px solid green'});
      if(this._players[0].isDefending) {
        console.log('c');
        $(p0 + 'Defend').prop('disabled', true);
        $(p0 + 'Attack').prop('disabled', false);
      } else {
        $(p0 + 'Defend').prop('disabled', false);
        $(p0 + 'Attack').prop('disabled', false);
      }

    } else {
      console.log('turn on player 0 defense');

      // append shield
      $(p0 + 'Container').append(shieldImgNode);
      $(p0 + 'Defend').prop('disabled', true);
      $(p0 + 'Attack').prop('disabled', true);

      // switch isDefending flag
      this._players[0].isDefending = true;

      // swap sides
      $(p0 + 'Box').css({'border':'5px solid grey'});
      $(p1 + 'Box').css({'border':'5px solid green'});
      if(this._players[1].isDefending) {
        console.log('d');
        $(p1 + 'Defend').prop('disabled', true);
        $(p1 + 'Attack').prop('disabled', false);
      } else {
        $(p1 + 'Defend').prop('disabled', false);
        $(p1 + 'Attack').prop('disabled', false);
      }
    }

  }

  // Helper Methods

  _isPlayerOutOfBreath() {
    let result = 2;
    for (let i = 0; i < 2; i++) {
      if (this._players[i].health <= 0) {
        result = i;
        return result;
      }
    }
    return result;
  }

  _displayGameWinner(playerNumber) {
    // hide fight modal
    $('#fightMode').modal('hide');
    // update winners modal
    $('#winnersImg').attr('src','img/' + this._players[playerNumber].name.toLowerCase() + '-sm.jpg');
    $('#winnersHeader').text(this._players[playerNumber].name + ' wins !!!');
    // show winner modal
    $('#winnerModal').modal({
      backdrop: 'static'
    });
  }

  _swapWeapons(endLocationID, endLocation, playerNumber, weaponImgNode) {
    // hide weapon when stepping on it
    $(endLocationID + ' .weapon-container').hide();
    this._stoppedOnWeapon[playerNumber] = endLocationID;

    // debug
    // console.log(endLocationID + ' has weapon');
    // console.log('swapping...');

    // swap weapons
    let tempWeapon = this._players[playerNumber].weapon; // temporarily storing _players weapon
    this._players[playerNumber].weapon = endLocation.weapon; // moving weapon from square to _players hand
    endLocation.weapon = tempWeapon; // asigning temporary weapon to field

    // re-draw nodes
    weaponImgNode.setAttribute('src', tempWeapon.src);
    weaponImgNode.setAttribute('title',tempWeapon.name + ' does ' + tempWeapon.damage + ' damage.');

    //change _players weapon img, name and damage in stats box as well
    let selector = '#player-' + playerNumber + '-';
    if (playerNumber === 0) {
      $(selector + 'WeaponImg').attr('src',this._players[playerNumber].weapon.src);
      $(selector + 'Damage').html('Damage: ' + this._players[playerNumber].weapon.damage);
      $(selector + 'WeaponName').html(this._players[playerNumber].weapon.name);
    } else {
      $(selector + 'WeaponImg').attr('src',this._players[playerNumber].weapon.src);
      $(selector + 'Damage').html('Damage: ' + this._players[playerNumber].weapon.damage);
      $(selector + 'WeaponName').html(this._players[playerNumber].weapon.name);
    }

    return weaponImgNode;
  }

  _randomStartLocation() {
    if (this._spawnFlag) {
      let min = this._size - this._size;
      let max = this._size - (0.7 * this._size);
      this._spawnFlag = !this._spawnFlag;
      while (true) {
        let randomLocation = this._gameData[Math.floor(Math.random() * (max - min + 1)) + min][Math.floor(Math.random() * (max - min + 1)) + min];
        if (randomLocation.isBlocked === false && randomLocation.weapon === null) {
          return randomLocation;
        }
      }
    } else {
      let min = (0.6 * this._size);
      let max = this._size - 1;
      this._spawnFlag = !this._spawnFlag;
      while (true) {
        let randomLocation = this._gameData[Math.floor(Math.random() * (max - min + 1)) + min][Math.floor(Math.random() * (max - min + 1)) + min];
        if (randomLocation.isBlocked === false && randomLocation.weapon === null) {
          return randomLocation;
        }
      }
    }
  }

  _randomLocation() {
    return this._gameData[Math.floor((Math.random() * this._size))][Math.floor((Math.random() * this._size))];
  }

  /* TODO modify square erases all instances of 'half-opacity' the first time it goes over. It's not needed to do it
   * so many times.. how about you change this?
  */

  _modifySquareImg(idString, playerNumber, value, imgNode) {
    const selector = '.half-opacity';
    if (playerNumber === 1) {
      // modifies player one - (checks current player and modifies second for next round)
      if (value) {
        imgNode.setAttribute('src', 'img/yoda-sm.jpg');
        $(idString).append(imgNode);
      } else {
        $(selector).remove();
      }
    } else {
      // modifies player two
      if (value) {
        imgNode.setAttribute('src', 'img/vader-sm.jpg');
        $(idString).append(imgNode);
      } else {
        $(selector).remove();
      }
    }
  }
  _getCurrentPlayerLocation(playerNumber) {
    const y = this._playerData[playerNumber][0];
    const x = this._playerData[playerNumber][1];
    return this._gameData[y][x];
  }

  resetPlayersStats() {
    for (let i = 0; i < 2; i++) {
      $('#player-' + i + '-WeaponImg').attr('src', this._players[i].weapon.src);
      $('#player-' + i + '-Damage').html('Damage: ' + this._players[i].weapon.damage);
      $('#player-' + i + '-WeaponName').html(this._players[i].weapon.name);
    }
  }

}