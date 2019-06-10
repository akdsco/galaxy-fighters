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
    // as a final step
    this.createGameNode();
    this.setPlayerStats();
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

  addBlockedLocations(quantity) {
    let i = 0;
    while (i < quantity) {
      let randomLocation = this.randomLocation();
      if (!randomLocation.isBlocked) {
        randomLocation.isBlocked = true;
        i++;
      }
      randomLocation = null;
    }
  }

  addWeapons(quantity) {
    let i = 0;
    while (i < quantity) {
      let randomLocation = this.randomLocation();
      if (!randomLocation.isBlocked && randomLocation.weapon === null) {
        randomLocation.weapon = this.weaponStorage[i];
        // print distribution of weapons to console for testing
        console.log('y' + randomLocation._locationY + ',' + 'x' + randomLocation._locationX + ' = ' + randomLocation.weapon.name + " - " + randomLocation.weapon.damage);
        i++;
      }
    }
  }

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
              if ((this.gameData[squareObject._locationY - j][squareObject._locationX].isBlocked) || (this.gameData[squareObject._locationY - j][squareObject._locationX].player !== null)) {
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
              if ((this.gameData[squareObject._locationY + j][squareObject._locationX].isBlocked) || (this.gameData[squareObject._locationY + j][squareObject._locationX].player !== null)) {
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
              if ((this.gameData[squareObject._locationY][squareObject._locationX - j].isBlocked) || (this.gameData[squareObject._locationY][squareObject._locationX - j].player !== null)) {
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
              if ((this.gameData[squareObject._locationY][squareObject._locationX + j].isBlocked) || (this.gameData[squareObject._locationY][squareObject._locationX + j].player !== null)) {
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
        tr.appendChild(this.gameData[i][j].addLocationNode());
      }
      gameNode.appendChild(tr);
    }
    return gameNode;
  }

  setPlayerStats() {
    let id = 'One';
    for (let i = 0; i < 2; i++){
      console.log('been here');
      console.log(id);
      $('#player' + id + 'Name').text(this.players[i]._name);
      $('#player' + id + 'Health').text('Health: ' + this.players[i]._health);
      $('#player' + id + 'WeaponName').text(this.players[i]._weapon.name);
      $('#player' + id + 'Damage').text('Damage: ' + this.players[i]._weapon.damage);

      id = 'Two';
    }
  }

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
      this.migratePlayer(playerNumber, direction, i);
      await this.sleep(400);
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

  migratePlayer(playerNumber, direction, i) {
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
      $('#fightBody').replaceWith($('#fightBox'));
      // erase game board
      $('main').fadeOut(300);
      await this.sleep(500);
      $('main').remove();

      // make sure CSS will work as intended afterwards
      // $('body').css({'background':'url(\'../img/bckgd-trooper.jpg\')','background-size':'cover'});
      $('.player-container-stats').css({'position':'relative','margin':'auto'})
      $('.statsBox').css({'border':'20px solid #989898'})
      // open modal without option of closing it down by clicking away from it
      $('#fightMode').modal({
        backdrop: 'static'
      });
      this.fight(playerNumber);
    }
  }

  fight(playerNumber) {
    let attackingID;
    let defendingID;

    if(playerNumber === 0) {
      attackingID = 'One';
      defendingID = 'Two';
    } else {
      attackingID = 'Two';
      defendingID = 'One';
    }

    // set up css for turn (depending on who attacked, gets to attack or block first)
    $('#player' + attackingID + 'Box').css({'border':'20px solid green'});
    $('#player' + defendingID + 'Block').prop('disabled', true);
    $('#player' + defendingID + 'Attack').prop('disabled', true);

    let bothPlayersBreathe = () => {
      let result = 2;
      for (let i = 0; i < 2; i++) {
        if (this.players[i]._health < 0) {
          result = i;
          return result;
        }
      }
      return result
    }

    let turn = playerNumber;
    console.log('turn: ' + turn);

    console.log('BPB: ' + (bothPlayersBreathe() === 2));
    while (bothPlayersBreathe === 2) {
      switch (turn) {
        case 0:
          this.attack(turn);
          console.log('inside case 0');
          turn++;
          break;
        case 1:
          this.attack(turn);
          console.log('inside case 1');
          turn--;
          break;
      }
    }

    // one player has less than 0 health.. and we can find out which by running bothPlayersBreathe

  }

  attack(playerNumber) {
    console.log('anythigm?');
    let attackingID;
    let defendingID;

    if(playerNumber === 1) {
      attackingID = 'One';
      defendingID = 'Two';
    } else {
      attackingID = 'Two';
      defendingID = 'One';
    }
    console.log(attackingID);

    $('#player' + attackingID + 'Block').on('click', (e) =>  {
      console.log('clicked Block');
      this.players[playerNumber]._isFortified = true;
      $('#player' + attackingID + 'Box').css({'border':'20px solid blue'});
    });

    $('#player' + attackingID + 'Attack').on('click', (e) => {
      console.log('clicked Attack');

    });
  }

  // Helper Methods

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
    if (playerNumber === 0) {
      $('#playerOneWeaponImg').attr('src',this.players[playerNumber]._weapon.src);
      $('#playerOneDamage').html('Damage: ' + this.players[playerNumber]._weapon.damage);
      $('#playerOneWeaponName').html(this.players[playerNumber]._weapon.name);
    } else {
      $('#playerTwoWeaponImg').attr('src',this.players[playerNumber]._weapon.src);
      $('#playerTwoDamage').html('Damage: ' + this.players[playerNumber]._weapon.damage);
      $('#playerTwoWeaponName').html(this.players[playerNumber]._weapon.name);
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
        if (randomLocation.isBlocked === false && randomLocation.weapon === null) {
          return randomLocation;
        }
      }
    } else {
      let min = (0.6 * this.size);
      let max = this.size - 1;
      this.spawnFlag = !this.spawnFlag;
      while (true) {
        let randomLocation = this.gameData[Math.floor(Math.random() * (max - min + 1)) + min][Math.floor(Math.random() * (max - min + 1)) + min];
        if (randomLocation.isBlocked === false && randomLocation.weapon === null) {
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
    if (playerNumber === 1) {
      // modifies player one - (checks current player and modifies second for next round)
      if (value) {
        imgNode.setAttribute('src', 'img/yoda-sm.jpg');
        $(idString).append(imgNode);
      } else {
        $('.half-opacity').remove();
      }
    } else {
      // modifies player two
      if (value) {
        imgNode.setAttribute('src', 'img/vader-sm.jpg');
        $(idString).append(imgNode);
      } else {
        $('.half-opacity').remove();
      }
    }
  }

  getCurrentPlayerLocation(playerNumber) {
    const y = this.players[playerNumber]._playerLocationY;
    const x = this.players[playerNumber]._playerLocationX;
    return this.gameData[y][x];
  }

  resetPlayersStats() {
    let number = 'One';
    for (let i = 0; i < 2; i++) {
      $('#player' + number + 'WeaponImg').attr('src', this.players[i]._weapon.src);
      $('#player' + number + 'Damage').html('Damage: ' + this.players[i]._weapon.damage);
      $('#player' + number + 'WeaponName').html(this.players[i]._weapon.name);
      number = 'Two';
    }
  }

}