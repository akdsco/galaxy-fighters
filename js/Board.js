class Board {
  constructor(size) {
    this.size = size;
    this.gameData = [];
    this.weaponStorage = [{name: 'Weapon 1', damage: 10},
                          {name: 'Weapon 2', damage: 20},
                          {name: 'Weapon 3', damage: 30},
                          {name: 'Weapon 4', damage: 40}];
    this.playerOne = new Player('Player 1');
    this.playerTwo = new Player('Player 2');
    this.initializeGameData();
    this.addBlockedLocations(20);
    this.addWeapons();
    // this.addPlayerLocations(); // to the board

    // last step
    this.createGameNode();
  }

  // populate gameData array with new Location objects
  initializeGameData() {
    for (let i = 0; i < this.size; i++) {
      this.gameData[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.gameData[i][j] = new Location(i,j);
      }
    }
  }

  addBlockedLocations(number) {
    let i = 0;
    while (i < number) {
      let randomLocation = this.gameData[Math.floor((Math.random() * this.size))][Math.floor((Math.random() * this.size))];
      if (randomLocation.isBlocked === false) {
        randomLocation.isBlocked = true;
        i++
      }
      randomLocation = null;
    }
  }

  addWeapons() {
    let i = 0;
    while (i < 4) {
      let randomLocation = this.randomLocation();
      if (randomLocation.isBlocked !== true && randomLocation.weapon === null) {
        randomLocation.weapon = this.weaponStorage[i];
        // printing distribution of weapons to console for testing
        console.log(randomLocation.row + ',' + randomLocation.col + ' = ' + randomLocation.weapon.name + " - " + randomLocation.weapon.damage);
        i++;
      }
    }
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

  randomLocation() {
    return this.gameData[Math.floor((Math.random() * this.size))][Math.floor((Math.random() * this.size))];
  }


}