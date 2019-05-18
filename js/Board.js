class Board {
  constructor(size) {
    this.size = size;
    this.gameData = [];
    this.weaponStorage = [{name: 'Weapon 1', damage: 20},
                          {name: 'Weapon 2', damage: 30},
                          {name: 'Weapon 3', damage: 40},
                          {name: 'Weapon 4', damage: 50}];
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

  drawPlayersPath(squareObject, value) {
    for (let i = 0; i < 4; i++) {
       start: for (let j = 1; j < 4; j++) {
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

}