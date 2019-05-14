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
        console.log(randomLocation.row + ',' + randomLocation.col + ' = ' + randomLocation.weapon.name + " - " + randomLocation.weapon.damage);
        i++;
      }
    }
  }

  addPlayers(array) {
    for (let i = 0; i < array.length; i++) {
      let randomLocation = this.randomStartLocation();
      randomLocation.player = array[i];
      array[i].locationX = randomLocation.row;
      array[i].locationY = randomLocation.col;
      this.drawPlayersPath(randomLocation,true);
    }
  }

  drawPlayersPath(location, value) {
    for (let i = 0; i < 4; i++) {
       start: for (let j = 1; j < 4; j++) {
        switch (i) {
          case 0: // moving up
            if ((location.row - j) < 0) {
              // console.log('location: ' + (location.row - j) + ':' + location.col + ' does no exist. Skipping direction');
              break start;
            } else {
              if(!(this.gameData[location.row - j][location.col].isBlocked)) {
                this.gameData[location.row - j][location.col].isAvailable = value;
              } else {
                break start;
              }
            }
            break;
          case 1: // moving down
            if ((location.row + j) > (this.size - 1)) {
              // console.log('location: ' + (location.row + j) + ':' + location.col + ' does no exist. Skipping direction');
              break start;
            } else {
              if(!(this.gameData[location.row + j][location.col].isBlocked)) {
                this.gameData[location.row + j][location.col].isAvailable = value;
              } else {
                break start;
              }
            }
            break;
          case 2: // moving left
            if ((location.col - j) < 0) {
              // console.log('location: ' + location.row + ':' + (location.col - j) + ' does no exist. Skipping direction');
              break start;
            } else {
              if(!(this.gameData[location.row][location.col - j].isBlocked)) {
                this.gameData[location.row][location.col - j].isAvailable = value;
              } else {
                break start;
              }
            }
            break;
          case 3: // moving right
            if ((location.col + j) > (this.size - 1)) {
              // console.log('location: ' + location.row + ':' + (location.col + j) + ' does no exist. Skipping direction');
              break start;
            } else {
              if(!(this.gameData[location.row][location.col + j].isBlocked)) {
                this.gameData[location.row][location.col + j].isAvailable = value;
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