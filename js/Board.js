class Board {
  constructor(size) {
    this.size = size;
    this.gameData = [];
    this.weaponStorage = [{name: 'Weapon 1', damage: 20, src: 'img/weapon/sword.png'},
                          {name: 'Weapon 2', damage: 30, src: 'img/weapon/shotgun.png'},
                          {name: 'Weapon 3', damage: 40, src: 'img/weapon/granade.png'},
                          {name: 'Weapon 4', damage: 50, src: 'img/weapon/rifle.png'}];
    this.players = [new Player(1), new Player(2)];
    this.spawnFlag = true;
    this.initializeGameData();
    this.addBlockedLocations(17);
    this.addWeapons(4);
    this.addPlayers(this.players);
    // as a final step
    this.createGameNode();
  }

  // populate gameData array with new Location objects
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
        i++
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
        console.log('y'+randomLocation._locationY + ',' + 'x'+randomLocation._locationX + ' = ' + randomLocation.weapon.name + " - " + randomLocation.weapon.damage);
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
        this.drawPlayersPath(randomLocation,true);
        flag = !flag;
      }
    }
  }

  drawPlayersPath(squareObject, value, playerNumber) {
    for (let i = 0; i < 4; i++) {
       start: for (let j = 1; j < 4; j++) {

        // create imgNode to inject
        const imgNode = document.createElement('img');
        imgNode.setAttribute('width','50');
        imgNode.setAttribute('height','50');
        imgNode.classList.add('half-opacity');
        imgNode.setAttribute('id','ghostPlayer');

        switch (i) {
          case 0: // moving up
            if ((squareObject._locationY - j) < 0) {
              // console.log('squareObject: ' + (squareObject._locationY - j) + ':' + squareObject._locationX + ' does no exist. Skipping direction');
              break start;
            } else {
              if(!(this.gameData[squareObject._locationY - j][squareObject._locationX].isBlocked)) {
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
              if(!(this.gameData[squareObject._locationY + j][squareObject._locationX].isBlocked)) {
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
              if(!(this.gameData[squareObject._locationY][squareObject._locationX - j].isBlocked)) {
                // change data
                this.gameData[squareObject._locationY][squareObject._locationX - j].isAvailable = value;
                // change display
                let idString = '#loc_' + (squareObject._locationY) + '_' + (squareObject._locationX  - j);
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
              if(!(this.gameData[squareObject._locationY][squareObject._locationX + j].isBlocked)) {
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
    gameNode.setAttribute('id','gameTable');

    for (let i = 0; i < this.size; i++) {
      let tr = document.createElement('tr');
      for (let j = 0; j < this.size; j++) {
        tr.appendChild(this.gameData[i][j].addLocationNode());
      }
      gameNode.appendChild(tr);
    }
    return gameNode;
  }

  movePlayer(playerNumber, e) {
    let startLocationID;
    let endLocationID;

    // making sure we capture endY and endX even if you click on child node of 'TD' element
    if ((e.target.nodeName === 'P') || (e.target.nodeName === 'IMG')) {
      endLocationID = e.target.parentNode.id;
    } else if (e.target.nodeName === 'TD') {
      endLocationID = e.target.id;
    }

    // creating endLocation (arrray) and endLocationID (jquery front target)
    let endX = parseInt(endLocationID[6]);
    let endY = parseInt(endLocationID[4]);
    endLocationID = '#' + endLocationID;

    let endLocation = this.gameData[endY][endX];

    // creating startLocation (array) and startLocationID (jQuery front target)
    let startX = this.players[playerNumber]._playerLocationX;
    let startY = this.players[playerNumber]._playerLocationY;
    startLocationID = '#loc_' + startY + '_' + startX;

    let startLocation = this.gameData[startY][startX];

    // if user clicked on a "good" square..
    if (endLocation.isAvailable) {

      // pick up new weapon if there is any on players way

      // checking players direction
      let movingUp = ((endX === startX) && (endY < startY));
      let movingDown = (endX === startX) && (endY > startY);
      let movingRight = ((endY === startY) && (endX > startX));
      let movingLeft = ((endY === startY) && (endX < startX));

      if(movingUp) {
        console.log('going up');
        for (let i = 1; i < (startY - endY + 1); i++) {
          if(this.gameData[startY - i][endX].weapon !== null) {
            console.log('location: y' + (startY - i) + ', x' + endX + ' contains weapon');

            // swap weapons
            let tempWeapon = this.players[playerNumber]._weapon; // temporarily storing players weapon
            this.players[playerNumber]._weapon = this.gameData[startY - i][endX].weapon; // moving field weapon to player
            this.gameData[startY - i][endX].weapon = tempWeapon; // asigning temporary weapon to field

            // empty weaponImgNode to swap weapons
            let weaponImgNode = document.createElement('img');
            weaponImgNode.setAttribute('width','50');
            weaponImgNode.setAttribute('height','50');
            weaponImgNode.classList.add('weapon');

            // re-draw nodes
            let weaponLocationID = '#loc_'+ (startY - i) + '_' + endX;
            console.log('player weapon src: ' + tempWeapon.src);
            weaponImgNode.setAttribute('src', tempWeapon.src);
            console.log(weaponLocationID + ' .weapon');
            $(weaponLocationID + ' .weapon').replaceWith(weaponImgNode);
            // tempWeapon = null;
          }
        }
      } else if(movingDown) {
        console.log('going down');
        for (let i = 1; i < (endY - startY + 1); i++) {
          if(this.gameData[startY + i][endX].weapon !== null) {
            console.log('location: y' + (startY + i) + ', x' + endX + ' contains weapon');

            //swap weapons
            let tempWeapon = this.players[playerNumber]._weapon;
            this.players[playerNumber]._weapon = this.gameData[startY + i][endX].weapon;
            this.gameData[startY + i][endX].weapon= tempWeapon;

            //re-draw nodes
            let weaponLocationID = '#loc_' + (startY + i) + '_' + endX;
            let pNode = document.createElement('p');
            pNode.innerText = this.gameData[startY + i][endX].weapon.name[0] + '-' + this.gameData[startY + i][endX].weapon.name[7];
            $(weaponLocationID + '>p').replaceWith(pNode);
          }
        }
      } else if(movingLeft) {
        console.log('going left');
        for (let i = 1; i < (startX - endX + 1); i++) {
          if(this.gameData[endY][startX - i].weapon !== null) {
            console.log('location: y' + (endY) + ', x' + (startX - i) + ' contains weapon');

            //swap weapons
            let tempWeapon = this.players[playerNumber]._weapon;
            this.players[playerNumber]._weapon = this.gameData[endY][startX - i].weapon;
            this.gameData[endY][startX - i].weapon= tempWeapon;

            //re-draw nodes
            let weaponLocationID = '#loc_' + endY + '_' + (startX - i);
            let pNode = document.createElement('p');
            pNode.innerText = this.gameData[endY][startX - i].weapon.name[0] + '-' + this.gameData[endY][startX - i].weapon.name[7];
            $(weaponLocationID + '>p').replaceWith(pNode);
          }
        }
      } else if(movingRight) {
        console.log('going right');
        for (let i = 1; i < (endX - startX + 1); i++) {
          if(this.gameData[endY][startX + i].weapon !== null) {
            console.log('location: y' + (endY) + ', x' + (startX + i) + ' contains weapon');

            //swap weapons
            let tempWeapon = this.players[playerNumber]._weapon;
            this.players[playerNumber]._weapon = this.gameData[endY][startX + i].weapon;
            this.gameData[endY][startX + i].weapon= tempWeapon;

            //re-draw nodes
            let weaponLocationID = '#loc_' + endY + '_' + (startX + i);
            let pNode = document.createElement('p');
            pNode.innerText = this.gameData[endY][startX + i].weapon.name[0] + '-' + this.gameData[endY][startX + i].weapon.name[7];
            $(weaponLocationID + '>p').replaceWith(pNode);
          }
        }

      }

      // clean data in start location
      startLocation.player = null;
      this.drawPlayersPath(startLocation, false, playerNumber);

      // change players location fields
      this.players[playerNumber]._playerLocationY = endY;
      this.players[playerNumber]._playerLocationX = endX;

      // move player object to new location
      endLocation.player = this.players[playerNumber];

      // enable movement for next player
      if (playerNumber === 0) {
        let nextPlayerLocation = this.getCurrentPlayerLocation(1);
        this.drawPlayersPath(nextPlayerLocation, true, playerNumber);
      } else {
        let nextPlayerLocation = this.getCurrentPlayerLocation(0);
        this.drawPlayersPath(nextPlayerLocation,true, playerNumber);
      }

      // blink current player from start to end location
      $(startLocationID + ' .player').fadeOut(250, () => {
        $(endLocationID).prepend($(startLocationID + ' .player'));
        $(endLocationID + ' .player').fadeIn(250);
      });
    }
  }

  // Helper Methods

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

  modifySquareImg(idString, playerNumber, value, imgNode) {
    if (playerNumber === 1) {
      // modifies player one - (checks current player and modifies second for next round)
      if (value) {
        imgNode.setAttribute('src','img/yoda_sm.jpg');
        $(idString).prepend(imgNode);
      } else {
        $('#ghostPlayer').remove();
      }
    } else {
      // modifies player two
      if (value) {
        imgNode.setAttribute('src','img/vader_sm.jpg');
        $(idString).prepend(imgNode);
      } else {
        $('#ghostPlayer').remove();
      }
    }
  }

  getCurrentPlayerLocation(playerNumber) {
    let y = this.players[playerNumber]._playerLocationY;
    let x = this.players[playerNumber]._playerLocationX;
    return this.gameData[y][x];
  }

  isAvailable(e) {
    let idString = '';

    if ((e.target.nodeName === 'P') || (e.target.nodeName === 'IMG')) {
      idString = e.target.parentNode.id;
    } else if (e.target.nodeName === 'TD') {
      idString = e.target.id;
    }

    let clickedX = idString[6];
    let clickedY = idString[4];

    let clickedLocation = currentGame.gameData[clickedY][clickedX];

    return clickedLocation.isAvailable;

  }

}