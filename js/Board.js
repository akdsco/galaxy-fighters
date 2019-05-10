class Board {
  constructor(size) {
    this.size = size;
    this.gameData = [];
    this.weaponStorage = [{name: 'Weapon 1', damage: 20},
                          {name: 'Weapon 2', damage: 30},
                          {name: 'Weapon 3', damage: 40},
                          {name: 'Weapon 4', damage: 50}];
    this.playerOne = new Player(1);
    this.playerTwo = new Player(2);
    this.flag = true;
    this.initializeGameData();
    this.addBlockedLocations(17);
    this.addWeapons(4);
    this.addPlayers();
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

  addPlayers() {
    // Using 'player' as parameter to specify range within opposite corners (i.e. making sure players don't spawn next each other)
    let startPlayerOne = this.randomLocation('player');
    let startPlayerTwo = this.randomLocation('player');
    startPlayerOne.player = this.playerOne;
    startPlayerTwo.player = this.playerTwo;
  }

  // draw board based on array and return html NODE to inject to index
  createGameNode() {
    let gameNode = document.createElement('table');

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

  randomLocation(text) {
    if ((typeof text === 'string') && (text === 'player')) {
      if (this.flag) {
        let min = 0;
        let max = 3;
        this.flag = !this.flag;
        while (true) {
          let randomLocation = this.gameData[Math.floor(Math.random() * (max - min + 1)) + min][Math.floor(Math.random() * (max - min + 1)) + min];
          if (randomLocation.isBlocked === false && randomLocation.weapon === null) {
            return randomLocation;
          }
        }
      } else {
        let min = 6;
        let max = 9;
        this.flag = !this.flag;
        while (true) {
          let randomLocation = this.gameData[Math.floor(Math.random() * (max - min + 1)) + min][Math.floor(Math.random() * (max - min + 1)) + min];
          if (randomLocation.isBlocked === false && randomLocation.weapon === null) {
            return randomLocation;
          }
        }
      }
    } else {
      return this.gameData[Math.floor((Math.random() * this.size))][Math.floor((Math.random() * this.size))];
    }
  }

}