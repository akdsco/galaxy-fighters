class Board {
  constructor(size) {
    this.size = size;
    this.gameData = [];
    this.weaponStorage = [{name: 'Red Saber', damage: 20, src: 'img/weapon/red-saber.png'},
      {name: 'Sword', damage: 30, src: 'img/weapon/sword.png'},
      {name: 'Shotgun', damage: 40, src: 'img/weapon/shotgun.png'},
      {name: 'Rifle', damage: 50, src: 'img/weapon/rifle.png'}];
    this.players = [new Player(1, 'Yoda'), new Player(2, 'Vader')];
    this.spawnFlag = true;
    this.stoppedOnWeapon = ['', ''];
    this.initializeGameData();
    this.addBlockedLocations(17);
    this.addWeapons(4);
    this.addPlayers(this.players);
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

        // create imgNode with halp-opacity player img
        const imgNode = document.createElement('img');
        imgNode.classList.add('half-opacity');

        switch (i) {
          case 0: // moving up
            if ((squareObject._locationY - j) < 0) {
              // console.log('squareObject: ' + (squareObject._locationY - j) + ':' + squareObject._locationX + ' does no exist. Skipping direction');
              break start;
            } else {
              if (!(this.gameData[squareObject._locationY - j][squareObject._locationX].isBlocked)) {
                // change data
                this.gameData[squareObject._locationY - j][squareObject._locationX].isAvailable = value;
                // change display
                let idString = '#loc_' + (squareObject._locationY - j) + '_' + squareObject._locationX;
                $(idString).toggleClass('available');
                this.modifySquareImg(idString, playerNumber, value, imgNode);
              } else {
                break start;
              }
            }
            break;
          case 1: // moving down
            if ((squareObject._locationY + j) > (this.size - 1)) {
              // console.log('squareObject: ' + (squareObject._locationY + j) + ':' + squareObject._locationX + ' does no exist. Skipping direction');
              break start;
            } else {
              if (!(this.gameData[squareObject._locationY + j][squareObject._locationX].isBlocked)) {
                // change data
                this.gameData[squareObject._locationY + j][squareObject._locationX].isAvailable = value;
                // change display
                let idString = '#loc_' + (squareObject._locationY + j) + '_' + squareObject._locationX;
                $(idString).toggleClass('available');
                this.modifySquareImg(idString, playerNumber, value, imgNode);
              } else {
                break start;
              }
            }
            break;
          case 2: // moving left
            if ((squareObject._locationX - j) < 0) {
              // console.log('squareObject: ' + squareObject._locationY + ':' + (squareObject._locationX - j) + ' does no exist. Skipping direction');
              break start;
            } else {
              if (!(this.gameData[squareObject._locationY][squareObject._locationX - j].isBlocked)) {
                // change data
                this.gameData[squareObject._locationY][squareObject._locationX - j].isAvailable = value;
                // change display
                let idString = '#loc_' + (squareObject._locationY) + '_' + (squareObject._locationX - j);
                $(idString).toggleClass('available');
                this.modifySquareImg(idString, playerNumber, value, imgNode);
              } else {
                break start;
              }
            }
            break;
          case 3: // moving right
            if ((squareObject._locationX + j) > (this.size - 1)) {
              // console.log('squareObject: ' + squareObject._locationY + ':' + (squareObject._locationX + j) + ' does no exist. Skipping direction');
              break start;
            } else {
              if (!(this.gameData[squareObject._locationY][squareObject._locationX + j].isBlocked)) {
                // change data
                this.gameData[squareObject._locationY][squareObject._locationX + j].isAvailable = value;
                // change display
                let idString = '#loc_' + (squareObject._locationY) + '_' + (squareObject._locationX + j);
                $(idString).toggleClass('available');
                this.modifySquareImg(idString, playerNumber, value, imgNode);
              } else {
                break start;
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

  async movePlayer(playerNumber, endLocationID) {

    let endX = parseInt(endLocationID[6]);
    let endY = parseInt(endLocationID[4]);

    let startX = this.players[playerNumber]._playerLocationX;
    let startY = this.players[playerNumber]._playerLocationY;

    const movingUp = ((endX === startX) && (endY < startY));
    const movingDown = (endX === startX) && (endY > startY);
    const movingRight = ((endY === startY) && (endX > startX));
    const movingLeft = ((endY === startY) && (endX < startX));

    let movePlayer = 1;

    // disable current players available fields
    let startLocation = this.gameData[startY][startX];
    this.drawPlayersPath(startLocation, false, playerNumber);



    if(movingUp) {
      movePlayer += (startY - endY);
      for (let i = 1; i < movePlayer; i++) {
        this.migratePlayer(playerNumber, 0, i);
        // console.log(i + ' going to sleep');
        await this.sleep(500);
        // console.log(i + ' wake up');
      }
    }else if(movingDown) {
      movePlayer += (endY - startY);
      for (let i = 1; i < movePlayer; i++) {
        this.migratePlayer(playerNumber, 1, i);
        await this.sleep(500);
      }
    }else if(movingRight) {
      movePlayer += (endX - startX);
      for (let i = 1; i < movePlayer; i++) {
        this.migratePlayer(playerNumber, 2, i);
        await this.sleep(500);
      }
    }else if(movingLeft) {
      movePlayer += (startX - endX);
      for (let i = 1; i < movePlayer; i++) {
        this.migratePlayer(playerNumber, 3, i);
        await this.sleep(500);
      }
    }

    // enable movement for next player
    if (playerNumber === 0) {
      let nextPlayerLocation = this.getCurrentPlayerLocation(1);
      this.drawPlayersPath(nextPlayerLocation, true, playerNumber);
    } else {
      let nextPlayerLocation = this.getCurrentPlayerLocation(0);
      this.drawPlayersPath(nextPlayerLocation, true, playerNumber);
    }

    /*
    // figure out what to do with below...

    let endLocation = this.gameData[endY][endX];

    endLocationID = '#' + endLocationID;


    let startLocationID = '#loc_' + startY + '_' + startX;

    // ..................................................................



    // empty weaponImgNode to swap weapons
    let weaponImgNode = document.createElement('img');
    weaponImgNode.classList.add('weapon');

    // move player depending on direction
    if (movingUp) {
      console.log('going up');
      for (let i = 1; i < movePlayer; i++) {
        // if player is to reveal weapon which he stands on, show it
        if (this.stoppedOnWeapon[playerNumber] !== '') {
          let locationID = this.stoppedOnWeapon[playerNumber];
          setTimeout(() => {
            $(locationID + ' .weapon-container img').show(300);
          }, 500);
          this.stoppedOnWeapon[playerNumber] = '';
        }

        // setting up next location
        let nextLocation = this.gameData[startY - i][endX];
        let nextLocationID = '#loc_' + (startY - i) + '_' + endX;
        console.log('nextLocationID: ' + nextLocationID);

        // if next location has weapon, swap them
        if (nextLocation.weapon !== null) {
          console.log('location: y' + (startY - i) + ', x' + endX + ' contains weapon');
          console.log('swapping...');

          // swap weapons
          let tempWeapon = this.players[playerNumber]._weapon; // temporarily storing players weapon
          this.players[playerNumber]._weapon = nextLocation.weapon; // moving field weapon to player
          nextLocation.weapon = tempWeapon; // asigning temporary weapon to field

          // re-draw nodes
          // let weaponLocationID = '#loc_'+ (startY - i) + '_' + endX;
          weaponImgNode.setAttribute('src', tempWeapon.src);
          $(nextLocationID + ' .weapon-container img').replaceWith(weaponImgNode);

          // if player lands on a weapon field, swap weapons img to new and hide old weapon
          if (nextLocationID === endLocationID) {
            // $(nextLocationID + ' .weapon-container img').hide();
            this.stoppedOnWeapon[playerNumber] = nextLocationID;
          }
        }
        // // change players endY location as he moves up
        // this.players[playerNumber]._playerLocationY = (endY - i);
        //
        // // move player object to next location
        // nextLocation.player = this.players[playerNumber];
        //
        // // disapaer player in start location and appear in next location
        // $(startLocationID + ' .player-container').fadeOut(250, () => {
        //   $(nextLocationID).prepend($(startLocationID + ' .player-container'));
        //   $(nextLocationID + ' .player-container').fadeIn(250);
        // });
        //
        // // next location becomes new start location
        // startLocationID = '#loc_' + (startY - i) + '_' + startX;
        // startLocation = this.gameData[startY - i][startX];
      }
    } else if (movingDown) {
      // console.log('going down');
      // if player is to reveal weapon which he stands on, show it
      if (this.stoppedOnWeapon[playerNumber] !== '') {
        let locationID = this.stoppedOnWeapon[playerNumber];
        setTimeout(() => {
          $(locationID + ' .weapon').show(300);
        }, 500);
        this.stoppedOnWeapon[playerNumber] = '';
      }

      for (let i = 1; i < movePlayer; i++) {
        if (this.gameData[startY + i][endX].weapon !== null) {
          console.log('location: y' + (startY + i) + ', x' + endX + ' contains weapon');

          //swap weapons
          let tempWeapon = this.players[playerNumber]._weapon;
          this.players[playerNumber]._weapon = this.gameData[startY + i][endX].weapon;
          this.gameData[startY + i][endX].weapon = tempWeapon;

          //re-draw nodes
          let weaponLocationID = '#loc_' + (startY + i) + '_' + endX;
          weaponImgNode.setAttribute('src', tempWeapon.src);
          $(weaponLocationID + ' .weapon').replaceWith(weaponImgNode);

          // if player lands on a weapon field, hide weapon
          if (weaponLocationID === endLocationID) {
            $(weaponLocationID + ' .weapon').hide();
            this.stoppedOnWeapon[playerNumber] = weaponLocationID;
          }
        }
      }
    } else if (movingLeft) {
      // console.log('going left');
      // if player is to reveal weapon which he stands on, show it
      if (this.stoppedOnWeapon[playerNumber] !== '') {
        let locationID = this.stoppedOnWeapon[playerNumber];
        setTimeout(() => {
          $(locationID + ' .weapon').show(300);
        }, 500);
        this.stoppedOnWeapon[playerNumber] = '';
      }

      for (let i = 1; i < movePlayer; i++) {
        if (this.gameData[endY][startX - i].weapon !== null) {
          console.log('location: y' + (endY) + ', x' + (startX - i) + ' contains weapon');

          //swap weapons
          let tempWeapon = this.players[playerNumber]._weapon;
          this.players[playerNumber]._weapon = this.gameData[endY][startX - i].weapon;
          this.gameData[endY][startX - i].weapon = tempWeapon;

          //re-draw nodes
          let weaponLocationID = '#loc_' + endY + '_' + (startX - i);
          weaponImgNode.setAttribute('src', tempWeapon.src);
          $(weaponLocationID + ' .weapon').replaceWith(weaponImgNode);

          // if player lands on a weapon field, hide weapon
          if (weaponLocationID === endLocationID) {
            $(weaponLocationID + ' .weapon').hide();
            this.stoppedOnWeapon[playerNumber] = weaponLocationID;
          }
        }
      }
    } else if (movingRight) {
      // console.log('going right');
      // if player is to reveal weapon which he stands on, show it
      if (this.stoppedOnWeapon[playerNumber] !== '') {
        let locationID = this.stoppedOnWeapon[playerNumber];
        setTimeout(() => {
          $(locationID + ' .weapon').show(300);
        }, 500);
        this.stoppedOnWeapon[playerNumber] = '';
      }

      for (let i = 1; i < movePlayer; i++) {
        if (this.gameData[endY][startX + i].weapon !== null) {
          console.log('location: y' + (endY) + ', x' + (startX + i) + ' contains weapon');

          //swap weapons
          let tempWeapon = this.players[playerNumber]._weapon;
          this.players[playerNumber]._weapon = this.gameData[endY][startX + i].weapon;
          this.gameData[endY][startX + i].weapon = tempWeapon;

          //re-draw nodes
          let weaponLocationID = '#loc_' + endY + '_' + (startX + i);
          weaponImgNode.setAttribute('src', tempWeapon.src);
          $(weaponLocationID + ' .weapon').replaceWith(weaponImgNode);

          // if player lands on a weapon field, hide weapon
          if (weaponLocationID === endLocationID) {
            $(weaponLocationID + ' .weapon').hide();
            this.stoppedOnWeapon[playerNumber] = weaponLocationID;
          }
        }
      }

    }


    // now decide about how to move player erase and move each square ?


    // change players location fields
    this.players[playerNumber]._playerLocationY = endY;
    this.players[playerNumber]._playerLocationX = endX;

    // move player object to new location
    endLocation.player = this.players[playerNumber];

    // disapaer player in start location and appear in end location
    $(startLocationID + ' .player-container').fadeOut(250, () => {
      $(endLocationID).prepend($(startLocationID + ' .player-container'));
      $(endLocationID + ' .player-container').fadeIn(250);
    });

    // enable movement for next player
    if (playerNumber === 0) {
      let nextPlayerLocation = this.getCurrentPlayerLocation(1);
      this.drawPlayersPath(nextPlayerLocation, true, playerNumber);
    } else {
      let nextPlayerLocation = this.getCurrentPlayerLocation(0);
      this.drawPlayersPath(nextPlayerLocation, true, playerNumber);
    }
    */

  }

  migratePlayer(playerNumber, direction, i) {
    if(direction === 0) {
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
          $(locationID + ' .weapon-container').show(300);
        }, 300);
        this.stoppedOnWeapon[playerNumber] = '';
      }

      // if next location has weapon, swap them
      if (endLocation.weapon !== null) {
        // hide weapon when stepping on it
        $(endLocationID + ' .weapon-container').hide();
        this.stoppedOnWeapon[playerNumber] = endLocationID;

        // $(startLocationID + ' .weapon-container img').hide();
        console.log(endLocationID + ' has weapon');
        console.log('swapping...');

        // swap weapons
        let tempWeapon = this.players[playerNumber]._weapon; // temporarily storing players weapon
        this.players[playerNumber]._weapon = endLocation.weapon; // moving field weapon to player
        endLocation.weapon = tempWeapon; // asigning temporary weapon to field

        // re-draw nodes
        let weaponImgNode = document.createElement('img');
        weaponImgNode.classList.add('weapon');
        weaponImgNode.setAttribute('src', tempWeapon.src);
        $(endLocationID + ' .weapon-container img').replaceWith(weaponImgNode);

        // change players weapon in hand

      }

      // setTimeout(() => {
      //   console.log('time');
      // }, 500);



      // move player container
      console.log('i ' + i + ' - tried.. ');
      $(startLocationID + ' .player-container').fadeOut(200, () => {
        $(endLocationID).prepend($(startLocationID + ' .player-container'));
        $(endLocationID + ' .player-container').fadeIn(200);
        console.log('i ' + i + ' - done');
      });

      // adjust Y location
      this.players[playerNumber]._playerLocationY--;


        // if player lands on a weapon field, swap weapons img to new and hide old weapon
        // if (nextLocationID === endLocationID) {
        //   // $(nextLocationID + ' .weapon-container img').hide();
        //   this.stoppedOnWeapon[playerNumber] = nextLocationID;
        // }



      // // change players endY location as he moves up
      // this.players[playerNumber]._playerLocationY = (endY - i);
      //
      // // move player object to next location
      // nextLocation.player = this.players[playerNumber];
      //
      // // disapaer player in start location and appear in next location
      // $(startLocationID + ' .player-container').fadeOut(250, () => {
      //   $(nextLocationID).prepend($(startLocationID + ' .player-container'));
      //   $(nextLocationID + ' .player-container').fadeIn(250);
      // });
      //
      // // next location becomes new start location
      // startLocationID = '#loc_' + (startY - i) + '_' + startX;
      // startLocation = this.gameData[startY - i][startX];

    }else if(direction === 1){

    }else if(direction === 2){

    }else if(direction === 3){

    }

    // moves player one field at a time
    // if next location has weapon
    // - assign new weapon to player
    // - assing players weapon to location
    // - draw player with new weapon (add relevant pictures together)
    // - update player stats
    // - if last itearation - hide swapped weapon
    // - blink out old player + weapon
    // - blink in player icon + new weapon

    // if player keep on switching weapons through squares animations
    // happen as he 'goes'


    // if player is to reveal weapon which he stands on, show it
    //       if (this.stoppedOnWeapon[playerNumber] !== '') {
    //         let locationID = this.stoppedOnWeapon[playerNumber];
    //         setTimeout(() => {
    //           $(locationID + ' .weapon-container img').show(300);
    //         }, 500);
    //         this.stoppedOnWeapon[playerNumber] = '';
    //       }


  }

  // Helper Methods

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

  /* TODO mofity square erases all instances of 'half-opacity' the first time it goes over. It's not needed to do it
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

}