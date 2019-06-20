class Board {
  constructor(size) {
    this.size = size;
    this.gameData = [];
    this.weaponStorage = [{name: 'Red Saber', damage: 20, src: 'img/weapon/red-saber.png'},
                          {name: 'Mighty Sword', damage: 30, src: 'img/weapon/sword.png'},
                          {name: 'Long Rifle', damage: 40, src: 'img/weapon/rifle.png'},
                          {name: 'Machine Gun', damage: 50, src: 'img/weapon/m42.png'}];
    this.players = [new Player(1, 'Yoda'),
                    new Player(2, 'Vader')];
    this.spawnFlag = true;
    this.stoppedOnWeapon = ['',''];
    this.initializeGameData();
    this.addBlockedLocations(17);
    this.addWeapons(4);
    this.addPlayers(this.players);
    this.addPlayerStats();
    // as a final step
    this.createGameNode();
  }

  // populate gameData array with Location objects
  initializeGameData() {
    for (let i = 0; i < this.size; i++) {
      this.gameData[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.gameData[i][j] = new Location(i, j);
      }
    }
  }

  // block random locations (creating obstacles field)
  addBlockedLocations(quantity) {
    let i = 0;
    while (i < quantity) {
      let randomLocation = this.randomLocation();
      if (!randomLocation._isBlocked) {
        randomLocation._isBlocked = true;
        i++;
      }
      randomLocation = null;
    }
  }

  // adding weapons from weaponStorage to randomly selected, available locations
  addWeapons(quantity) {
    let i = 0;
    while (i < quantity) {
      let randomLocation = this.randomLocation();
      if (!randomLocation._isBlocked && randomLocation.weapon === null) {
        randomLocation.weapon = this.weaponStorage[i];
        // print distribution of weapons to console for testing
        console.log('y' + randomLocation._locationY + ',' + 'x' + randomLocation._locationX + ' = ' + randomLocation.weapon.name + " - " + randomLocation.weapon.damage);
        i++;
      }
    }
  }

  // adding players to random locations in top left and bottom right corners (away from each other)
  addPlayers(array) {
    let flag = true;

    for (let i = 0; i < array.length; i++) {
      let randomLocation = this.randomStartLocation();
      array[i]._playerLocationY = randomLocation._locationY;
      array[i]._playerLocationX = randomLocation._locationX;
      randomLocation.player = array[i];
      if (flag) {
        this.drawPlayersPath(randomLocation, true);
        flag = !flag;
      }
    }
  }

  // drawing or erasing players available 'walk' path
  drawPlayersPath(squareObject, value, playerNumber) {
    for (let i = 0; i < 4; i++) {
      start: for (let j = 1; j < 4; j++) {

        // empty imgNode with half-opacity player img
        const imgNode = document.createElement('img');
        imgNode.classList.add('half-opacity');

        switch (i) {
          case 0: // moving up
            if ((squareObject._locationY - j) < 0) {
              // if player is currently at top border of board, skip direction
              break start;
            } else {
              // if location above is blocked or occupied by other player, skip direction
              if ((this.gameData[squareObject._locationY - j][squareObject._locationX]._isBlocked) || (this.gameData[squareObject._locationY - j][squareObject._locationX].player !== null)) {
                break start;
              } else {
                // location is available, add half-opacity player img and toggle class 'available'
                this.gameData[squareObject._locationY - j][squareObject._locationX].isAvailable = value;
                // change display
                let idString = '#loc_' + (squareObject._locationY - j) + '_' + squareObject._locationX;
                $(idString).toggleClass('available');
                this.modifySquareImg(idString, playerNumber, value, imgNode);
              }
            }
            break;
          case 1: // moving down
            if ((squareObject._locationY + j) > (this.size - 1)) {
              // if player is currently at bottom border of board, skip direction
              break start;
            } else {
              // if location below is blocked or occupied by other player, skip direction
              if ((this.gameData[squareObject._locationY + j][squareObject._locationX]._isBlocked) || (this.gameData[squareObject._locationY + j][squareObject._locationX].player !== null)) {
                break start;
              } else {
                // location is available, add half-opacity player img and toggle class 'available'
                this.gameData[squareObject._locationY + j][squareObject._locationX].isAvailable = value;
                // change display
                let idString = '#loc_' + (squareObject._locationY + j) + '_' + squareObject._locationX;
                $(idString).toggleClass('available');
                this.modifySquareImg(idString, playerNumber, value, imgNode);
              }
            }
            break;
          case 2: // moving left
            if ((squareObject._locationX - j) < 0) {
              // if player is currently at left border of board, skip direction
              break start;
            } else {
              // if location on left is blocked or occupied by other player, skip direction
              if ((this.gameData[squareObject._locationY][squareObject._locationX - j]._isBlocked) || (this.gameData[squareObject._locationY][squareObject._locationX - j].player !== null)) {
                break start;
              } else {
                // location is available, add half-opacity player img and toggle class 'available'
                this.gameData[squareObject._locationY][squareObject._locationX - j].isAvailable = value;
                // change display
                let idString = '#loc_' + (squareObject._locationY) + '_' + (squareObject._locationX - j);
                $(idString).toggleClass('available');
                this.modifySquareImg(idString, playerNumber, value, imgNode);
              }
            }
            break;
          case 3: // moving right
            if ((squareObject._locationX + j) > (this.size - 1)) {
              // if player is currently at right border of board, skip direction
              break start;
            } else {
              // if location on right is blocked or occupied by other player, skip direction
              if ((this.gameData[squareObject._locationY][squareObject._locationX + j]._isBlocked) || (this.gameData[squareObject._locationY][squareObject._locationX + j].player !== null)) {
                break start;
              } else {
                // location is available, add half-opacity player img and toggle class 'available'
                this.gameData[squareObject._locationY][squareObject._locationX + j].isAvailable = value;
                // change display
                let idString = '#loc_' + (squareObject._locationY) + '_' + (squareObject._locationX + j);
                $(idString).toggleClass('available');
                this.modifySquareImg(idString, playerNumber, value, imgNode);
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

    for (let i = 0; i < this.size; i++) {
      let tr = document.createElement('tr');
      for (let j = 0; j < this.size; j++) {
        tr.appendChild(this.gameData[i][j].createLocationNode());
      }
      gameNode.appendChild(tr);
    }
    return gameNode;
  }

  // filling stats box with relevant data
  addPlayerStats() {
    for (let i = 0; i < 2; i++){
      $('#player-' + i + '-Name').text(this.players[i]._name);
      $('#player-' + i + '-Health').text('Health: ' + this.players[i]._health);
      $('#player-' + i + '-WeaponName').text(this.players[i]._weapon.name);
      $('#player-' + i + '-Damage').text('Damage: ' + this.players[i]._weapon.damage);
    }
  }

  // moving player from start to end square
  async movePlayer(playerNumber, endLocationID) {

    let endX = parseInt(endLocationID[6]);
    let endY = parseInt(endLocationID[4]);

    let startX = this.players[playerNumber]._playerLocationX;
    let startY = this.players[playerNumber]._playerLocationY;

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

    // disable current players available fields
    let startLocation = this.gameData[startY][startX];
    this.drawPlayersPath(startLocation, false, playerNumber);

    for (let i = 1; i < movePlayer; i++) {
      this.migratePlayer(playerNumber, direction);
      await sleep(400);
    }

    // move players data to new square
    this.gameData[endY][endX].player = startLocation.player;
    startLocation.player = null;

    // enable movement for next player
    if (playerNumber === 0) {
      let nextPlayerLocation = this.getCurrentPlayerLocation(1);
      this.drawPlayersPath(nextPlayerLocation, true, playerNumber);
    } else {
      let nextPlayerLocation = this.getCurrentPlayerLocation(0);
      this.drawPlayersPath(nextPlayerLocation, true, playerNumber);
    }

  }

  // migrates data and changes visual representation on table
  migratePlayer(playerNumber, direction) {
    if(direction === 'up') {
      let startLocation = this.getCurrentPlayerLocation(playerNumber);
      let startLocationID = '#loc_' + this.players[playerNumber]._playerLocationY + '_' + this.players[playerNumber]._playerLocationX;
      let endLocation = this.gameData[this.players[playerNumber]._playerLocationY - 1][this.players[playerNumber]._playerLocationX];
      let endLocationID = '#loc_' + (this.players[playerNumber]._playerLocationY - 1) + '_' + this.players[playerNumber]._playerLocationX;

      //debug for now
      // console.log(startLocationID,endLocationID);

      // if player is to reveal weapon which he stands on, show it
      if (this.stoppedOnWeapon[playerNumber] !== '') {
        let locationID = this.stoppedOnWeapon[playerNumber];
        setTimeout(() => {
          $(locationID + ' .weapon-container').show(200);
        }, 300);
        this.stoppedOnWeapon[playerNumber] = '';
      }

      // empty weapon node
      let weaponImgNode = document.createElement('img');
      weaponImgNode.classList.add('weapon');


      // if next location has weapon, swap them
      if (endLocation.weapon !== null) {
        $(endLocationID + ' .weapon-container img').replaceWith(this.swapWeapons(endLocationID,endLocation,playerNumber,weaponImgNode));
      }

      // move player container
      // console.log('i ' + i + ' - tried.. ');
      $(startLocationID + ' .player-container').fadeOut(200, () => {
        $(endLocationID).prepend($(startLocationID + ' .player-container'));

        // change players weapon in hand
        let weaponImgNodeClone = weaponImgNode.cloneNode(false);
        weaponImgNodeClone.setAttribute('src', this.players[playerNumber]._weapon.src);
        weaponImgNodeClone.setAttribute('title', this.players[playerNumber]._weapon.name + ' does ' + this.players[playerNumber]._weapon.damage + ' damage.');

        // continue moving player
        $(endLocationID + ' .player-container .weapon').replaceWith(weaponImgNodeClone);
        $(endLocationID + ' .player-container').fadeIn(200);
        // console.log('i ' + i + ' - done');
      });

      // adjust Y location
      this.players[playerNumber]._playerLocationY -= 1;
      this.enterFight(playerNumber);

    }else if(direction === 'down'){
      let startLocation = this.getCurrentPlayerLocation(playerNumber);
      let startLocationID = '#loc_' + this.players[playerNumber]._playerLocationY + '_' + this.players[playerNumber]._playerLocationX;
      let endLocation = this.gameData[this.players[playerNumber]._playerLocationY + 1][this.players[playerNumber]._playerLocationX];
      let endLocationID = '#loc_' + (this.players[playerNumber]._playerLocationY + 1) + '_' + this.players[playerNumber]._playerLocationX;

      //debug for now
      // console.log(startLocationID,endLocationID);

      // if player is to reveal weapon which he stands on, show it
      if (this.stoppedOnWeapon[playerNumber] !== '') {
        let locationID = this.stoppedOnWeapon[playerNumber];
        setTimeout(() => {
          $(locationID + ' .weapon-container').show(200);
        }, 300);
        this.stoppedOnWeapon[playerNumber] = '';
      }

      // empty weapon node
      let weaponImgNode = document.createElement('img');
      weaponImgNode.classList.add('weapon');


      // if next location has weapon, swap them
      if (endLocation.weapon !== null) {
        $(endLocationID + ' .weapon-container img').replaceWith(this.swapWeapons(endLocationID,endLocation,playerNumber,weaponImgNode));
      }

      // move player container
      // console.log('i ' + i + ' - tried.. ');
      $(startLocationID + ' .player-container').fadeOut(200, () => {
        $(endLocationID).prepend($(startLocationID + ' .player-container'));

        // change players weapon in hand
        let weaponImgNodeClone = weaponImgNode.cloneNode(false);
        weaponImgNodeClone.setAttribute('src', this.players[playerNumber]._weapon.src);
        weaponImgNodeClone.setAttribute('title', this.players[playerNumber]._weapon.name + ' does ' + this.players[playerNumber]._weapon.damage + ' damage.');


        // continue moving player
        $(endLocationID + ' .player-container .weapon').replaceWith(weaponImgNodeClone);
        $(endLocationID + ' .player-container').fadeIn(200);
        // console.log('i ' + i + ' - done');
      });

      // adjust Y location
      this.players[playerNumber]._playerLocationY += 1;
      this.enterFight(playerNumber);

    }else if(direction === 'right'){
      let startLocation = this.getCurrentPlayerLocation(playerNumber);
      let startLocationID = '#loc_' + this.players[playerNumber]._playerLocationY + '_' + this.players[playerNumber]._playerLocationX;
      let endLocation = this.gameData[this.players[playerNumber]._playerLocationY][this.players[playerNumber]._playerLocationX + 1];
      let endLocationID = '#loc_' + this.players[playerNumber]._playerLocationY + '_' + (this.players[playerNumber]._playerLocationX + 1);

      //debug for now
      // console.log(startLocationID,endLocationID);

      // if player is to reveal weapon which he stands on, show it
      if (this.stoppedOnWeapon[playerNumber] !== '') {
        let locationID = this.stoppedOnWeapon[playerNumber];
        setTimeout(() => {
          $(locationID + ' .weapon-container').show(200);
        }, 300);
        this.stoppedOnWeapon[playerNumber] = '';
      }

      // empty weapon node
      let weaponImgNode = document.createElement('img');
      weaponImgNode.classList.add('weapon');


      // if next location has weapon, swap them
      if (endLocation.weapon !== null) {
        $(endLocationID + ' .weapon-container img').replaceWith(this.swapWeapons(endLocationID,endLocation,playerNumber,weaponImgNode));
      }

      // move players container
      // console.log('i ' + i + ' - tried.. ');
      $(startLocationID + ' .player-container').fadeOut(200, () => {
        $(endLocationID).prepend($(startLocationID + ' .player-container'));

        // change players weapon in hand
        let weaponImgNodeClone = weaponImgNode.cloneNode(false);
        weaponImgNodeClone.setAttribute('src', this.players[playerNumber]._weapon.src);
        weaponImgNodeClone.setAttribute('title', this.players[playerNumber]._weapon.name + ' does ' + this.players[playerNumber]._weapon.damage + ' damage.');

        // continue moving player
        $(endLocationID + ' .player-container .weapon').replaceWith(weaponImgNodeClone);
        $(endLocationID + ' .player-container').fadeIn(200);
        // console.log('i ' + i + ' - done');
      });

      // adjust X location
      this.players[playerNumber]._playerLocationX += 1;
      this.enterFight(playerNumber);

    }else if(direction === 'left'){
      let startLocation = this.getCurrentPlayerLocation(playerNumber);
      let startLocationID = '#loc_' + this.players[playerNumber]._playerLocationY + '_' + this.players[playerNumber]._playerLocationX;
      let endLocation = this.gameData[this.players[playerNumber]._playerLocationY][this.players[playerNumber]._playerLocationX - 1];
      let endLocationID = '#loc_' + this.players[playerNumber]._playerLocationY + '_' + (this.players[playerNumber]._playerLocationX - 1);

      //debug for now
      // console.log(startLocationID,endLocationID);

      // if player is to reveal weapon which he stands on, show it
      if (this.stoppedOnWeapon[playerNumber] !== '') {
        let locationID = this.stoppedOnWeapon[playerNumber];
        setTimeout(() => {
          $(locationID + ' .weapon-container').show(200);
        }, 300);
        this.stoppedOnWeapon[playerNumber] = '';
      }

      // empty weapon node
      let weaponImgNode = document.createElement('img');
      weaponImgNode.classList.add('weapon');


      // if next location has weapon, swap them
      if (endLocation.weapon !== null) {
        $(endLocationID + ' .weapon-container img').replaceWith(this.swapWeapons(endLocationID,endLocation,playerNumber,weaponImgNode));
      }

      // move player container
      // console.log('i ' + i + ' - tried.. ');
      $(startLocationID + ' .player-container').fadeOut(200, () => {
        $(endLocationID).prepend($(startLocationID + ' .player-container'));

        // change players weapon in hand
        let weaponImgNodeClone = weaponImgNode.cloneNode(false);
        weaponImgNodeClone.setAttribute('src', this.players[playerNumber]._weapon.src);
        weaponImgNodeClone.setAttribute('title', this.players[playerNumber]._weapon.name + ' does ' + this.players[playerNumber]._weapon.damage + ' damage.');

        // continue moving player
        $(endLocationID + ' .player-container .weapon').replaceWith(weaponImgNodeClone);
        $(endLocationID + ' .player-container').fadeIn(200);
        // console.log('i ' + i + ' - done');
      });

      // adjust X location
      this.players[playerNumber]._playerLocationX -= 1;
      this.enterFight(playerNumber);
    }
  }

  // disables board and brings fight modal on
  async enterFight(playerNumber) {
    const playerOneY = this.players[0]._playerLocationY;
    const playerTwoY = this.players[1]._playerLocationY;
    const playerOneX = this.players[0]._playerLocationX;
    const playerTwoX = this.players[1]._playerLocationX;

    // debug
    // console.log('X: ' + Math.abs(playerOneY - playerTwoY));
    // console.log('Y: ' + Math.abs(playerTwoX - playerOneX));

    if ((((Math.abs(playerOneY - playerTwoY)) === 0) && ((Math.abs(playerOneX - playerTwoX)) <= 1)) ||
        (((Math.abs(playerOneX - playerTwoX)) === 0) && ((Math.abs(playerOneY - playerTwoY)) <= 1))) {
      // move content from stats to modal
      $('#fightBody').append($('#fightBox'));
      // erase game board
      $('main').fadeOut(300);
      await this.sleep(500);
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
      console.log('lower player 0 life');

      // swap sides
      $(p0 + 'Box').css({'border':'5px solid green'});
      if (this.players[0]._isDefending) {
        console.log('a');
        $(p0 + 'Defend').prop('disabled', false);
        $(p0 + 'Attack').prop('disabled', false);
      } else {
        $(p0 + 'Defend').prop('disabled', false);
        $(p0 + 'Attack').prop('disabled', false);
      }

      // calculate damage and adjust health level
      let damage = this.players[1]._weapon.damage;
      if (this.players[0]._isDefending) {
        damage /= 2;
        this.players[0]._isDefending = false;
        // $(p0 + 'Box').css({'background':'white'});
        $(p0 + 'Container ' + 'img:last-child').remove();
      }
      this.players[0]._health -= damage;

      // check if player 1 won
      if (this.isPlayerOutOfBreath() === 0) {
        this.displayGameWinner(1);
      }

      // update front-end
      $(p0 + 'Health').text('Health: ' + this.players[0]._health);
      $(p1 + 'Box').css({'border':'5px solid grey'});
      $(p1 + 'Defend').prop('disabled', true);
      $(p1 + 'Attack').prop('disabled', true);
    } else {
      console.log('lower player 1 life');

      // swap sides
      $(p1 + 'Box').css({'border':'5px solid green'});
      if (this.players[1]._isDefending) {
        console.log('b');
        $(p1 + 'Defend').prop('disabled', false);
        $(p1 + 'Attack').prop('disabled', false);
      } else {
        $(p1 + 'Defend').prop('disabled', false);
        $(p1 + 'Attack').prop('disabled', false);
      }

      // calculate damage done by player one and adjust his health level
      let damage = this.players[0]._weapon.damage;
      if (this.players[1]._isDefending) {
        damage /= 2;
        this.players[1]._isDefending = false;
        // $(p1 + 'Box').css({'background':'white'});
        $(p1 + 'Container ' + 'img:last-child').remove();
      }
      this.players[1]._health -= damage;

      // check if player 1 won
      if (this.isPlayerOutOfBreath() === 1) {
        this.displayGameWinner(0);
      }

      // update front-end
      $(p1 + 'Health').text('Health: ' + this.players[1]._health);
      $(p0 + 'Box').css({'border':'5px solid grey'});
      $(p0 + 'Defend').prop('disabled', true);
      $(p0 + 'Attack').prop('disabled', true);
    }
  }

  // changes data after players defense deployment
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
      // $(p1 + 'Box').css({'background':'rgba(51, 204, 255,.5)'});
      $(p1 + 'Defend').prop('disabled', true);
      $(p1 + 'Attack').prop('disabled', true);

      // switch isDefending flag
      this.players[1]._isDefending = true;

      // swap sides
      $(p1 + 'Box').css({'border':'5px solid grey'});
      $(p0 + 'Box').css({'border':'5px solid green'});
      if(this.players[0]._isDefending) {
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
      // $(p0 + 'Box').css({'background':'rgba(51, 204, 255,.5)'});
      $(p0 + 'Defend').prop('disabled', true);
      $(p0 + 'Attack').prop('disabled', true);

      // switch isDefending flag
      this.players[0]._isDefending = true;

      // swap sides
      $(p0 + 'Box').css({'border':'5px solid grey'});
      $(p1 + 'Box').css({'border':'5px solid green'});
      if(this.players[1]._isDefending) {
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

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  isPlayerOutOfBreath() {
    let result = 2;
    for (let i = 0; i < 2; i++) {
      if (this.players[i]._health <= 0) {
        result = i;
        return result;
      }
    }
    return result;
  }

  displayGameWinner(playerNumber) {
    // hide fight modal
    $('#fightMode').modal('hide');
    // update winners modal
    $('#winnersImg').attr('src','img/' + this.players[playerNumber]._name.toLowerCase() + '-sm.jpg');
    $('#winnersHeader').text(this.players[playerNumber]._name + ' wins !!!');
    // show winner modal
    $('#winnerModal').modal({
      backdrop: 'static'
    });
  }

  swapWeapons(endLocationID, endLocation, playerNumber, weaponImgNode) {
    // hide weapon when stepping on it
    $(endLocationID + ' .weapon-container').hide();
    this.stoppedOnWeapon[playerNumber] = endLocationID;

    // debug
    // console.log(endLocationID + ' has weapon');
    // console.log('swapping...');

    // swap weapons
    let tempWeapon = this.players[playerNumber]._weapon; // temporarily storing players weapon
    this.players[playerNumber]._weapon = endLocation.weapon; // moving weapon from square to players hand
    endLocation.weapon = tempWeapon; // asigning temporary weapon to field

    // re-draw nodes
    weaponImgNode.setAttribute('src', tempWeapon.src);
    weaponImgNode.setAttribute('title',tempWeapon.name + ' does ' + tempWeapon.damage + ' damage.');

    //change players weapon img, name and damage in stats box as well
    let selector = '#player-' + playerNumber + '-';
    if (playerNumber === 0) {
      $(selector + 'WeaponImg').attr('src',this.players[playerNumber]._weapon.src);
      $(selector + 'Damage').html('Damage: ' + this.players[playerNumber]._weapon.damage);
      $(selector + 'WeaponName').html(this.players[playerNumber]._weapon.name);
    } else {
      $(selector + 'WeaponImg').attr('src',this.players[playerNumber]._weapon.src);
      $(selector + 'Damage').html('Damage: ' + this.players[playerNumber]._weapon.damage);
      $(selector + 'WeaponName').html(this.players[playerNumber]._weapon.name);
    }

    return weaponImgNode;
  }

  randomStartLocation() {
    if (this.spawnFlag) {
      let min = this.size - this.size;
      let max = this.size - (0.7 * this.size);
      this.spawnFlag = !this.spawnFlag;
      while (true) {
        let randomLocation = this.gameData[Math.floor(Math.random() * (max - min + 1)) + min][Math.floor(Math.random() * (max - min + 1)) + min];
        if (randomLocation._isBlocked === false && randomLocation.weapon === null) {
          return randomLocation;
        }
      }
    } else {
      let min = (0.6 * this.size);
      let max = this.size - 1;
      this.spawnFlag = !this.spawnFlag;
      while (true) {
        let randomLocation = this.gameData[Math.floor(Math.random() * (max - min + 1)) + min][Math.floor(Math.random() * (max - min + 1)) + min];
        if (randomLocation._isBlocked === false && randomLocation.weapon === null) {
          return randomLocation;
        }
      }
    }
  }

  randomLocation() {
    return this.gameData[Math.floor((Math.random() * this.size))][Math.floor((Math.random() * this.size))];
  }

  /* TODO modify square erases all instances of 'half-opacity' the first time it goes over. It's not needed to do it
   * so many times.. how about you change this?
  */

  modifySquareImg(idString, playerNumber, value, imgNode) {
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

  getCurrentPlayerLocation(playerNumber) {
    const y = this.players[playerNumber]._playerLocationY;
    const x = this.players[playerNumber]._playerLocationX;
    return this.gameData[y][x];
  }

  resetPlayersStats() {
    for (let i = 0; i < 2; i++) {
      $('#player-' + i + '-WeaponImg').attr('src', this.players[i]._weapon.src);
      $('#player-' + i + '-Damage').html('Damage: ' + this.players[i]._weapon.damage);
      $('#player-' + i + '-WeaponName').html(this.players[i]._weapon.name);
    }
  }

}