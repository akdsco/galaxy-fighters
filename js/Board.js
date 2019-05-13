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
    this.testingNum = 1;
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
    this.drawPlayersPath(startPlayerOne);
    this.drawPlayersPath(startPlayerTwo);
  }

  drawPlayersPath(location) {
    for (let i = 0; i < 4; i++) {
       start: for (let j = 1; j < 4; j++) {
        switch (i) {
          case 0: // moving up
            if ((location.row - j) < 0) {
              console.log('location: ' + (location.row - j) + ':' + location.col + ' does no exist. Skipping direction');
              break start;
            } else {
              if(!(this.gameData[location.row - j][location.col].isBlocked)) {
                this.gameData[location.row - j][location.col].isAvailable = true;
              } else {
                break start;
              }
            }
            break;
          case 1: // moving down
            if ((location.row + j) > (this.size - 1)) {
              console.log('location: ' + (location.row + j) + ':' + location.col + ' does no exist. Skipping direction');
              break start;
            } else {
              if(!(this.gameData[location.row + j][location.col].isBlocked)) {
                this.gameData[location.row + j][location.col].isAvailable = true;
              } else {
                break start;
              }
            }
            break;
          case 2: // moving left
            if ((location.col - j) < 0) {
              console.log('location: ' + location.row + ':' + (location.col - j) + ' does no exist. Skipping direction');
              break start;
            } else {
              if(!(this.gameData[location.row][location.col - j].isBlocked)) {
                this.gameData[location.row][location.col - j].isAvailable = true;
              } else {
                break start;
              }
            }
            break;
          case 3: // moving right
            if ((location.col + j) > (this.size - 1)) {
              console.log('location: ' + location.row + ':' + (location.col + j) + ' does no exist. Skipping direction');
              break start;
            } else {
              if(!(this.gameData[location.row][location.col + j].isBlocked)) {
                this.gameData[location.row][location.col + j].isAvailable = true;
              } else {
                break start;
              }
            }
        }
      }
    }

    let i, j;
    i = 0;
  }
  //   while (i < 4) {
  //     j = 1;
  //     start: while (j < 4) {
  //       console.log('pos:' + i + ',' + j);
  //       switch (i) {
  //         case 0: // move up
  //           if(location.row - j < 0) {
  //             console.log('location: ' + (location.row - j) +':'+ location.col + ' does not exist. Skipping direction'); // debug
  //             i++;
  //             break start;
  //           } else {
  //             if(!this.gameData[location.row - j][location.col].isBlocked) {
  //               this.gameData[location.row - j][location.col].isAvailable = true;
  //               j++;
  //               break;
  //             }
  //           }
  //
  //       }
  //     }
  //     i++
  //   }
  //
  // }


    // let j = 1;
    // start: for (let i = 0; i < 4; i++) {
    //     j = 1;
    //      while (j < 4) {
    //         console.log(this.testingNum + "- i: " + i);
    //         console.log(this.testingNum + "- j: " + j);
    //         switch (i) {
    //           case 0: // move up
    //             if (((location.row - j) >= (this.size - this.size)) && (typeof this.gameData[location.row - j][location.col] !== 'undefined')) {
    //               if (this.gameData[location.row - j][location.col].isBlocked === false) {
    //                 this.gameData[location.row - j][location.col].isAvailable = true;
    //                 j++
    //               } else {
    //                 break start;
    //               }
    //             } else {
    //               break start;
    //             }
              // case 1: // move right
              //   if (((location.col + j) <= this.size) && (typeof this.gameData[location.row][location.col + j] !== 'undefined')) {
              //     if (this.gameData[location.row][location.col + j].isBlocked === false) {
              //       this.gameData[location.row][location.col + j].isAvailable = true;
              //     } else {
              //       break;
              //     }
              //   } else {
              //     break;
              //   }
              // case 2: // move down
                // if (((location.row + j) <= this.size) && (typeof this.gameData[location.row + j][location.col] !== 'undefined')) {
                //   if (this.gameData[location.row + j][location.col].isBlocked === false) {
                //     this.gameData[location.row + j][location.col].isAvailable = true;
                //   } else {
                //     break calculateNextDirection;
                //   }
                // } else {
                //   break calculateNextDirection;
                // }


            // if (i === 0) { // going up
            //   if (((location.row - j) >= (this.size - this.size)) && (typeof this.gameData[location.row - j][location.col] !== 'undefined')) {
            //     if (this.gameData[location.row - j][location.col].isBlocked === false) {
            //       this.gameData[location.row - j][location.col].isAvailable = true;
            //     } else {
            //       break calculateNextDirection;
            //     }
            //   } else {
            //     break calculateNextDirection;
            //   }
            // } else if (i === 1) { // right
            //   if (((location.col + j) <= this.size) && (typeof this.gameData[location.row][location.col + j] !== 'undefined')) {
            //     if (this.gameData[location.row][location.col + j].isBlocked === false) {
            //       this.gameData[location.row][location.col + j].isAvailable = true;
            //     } else {
            //       break calculateNextDirection;
            //     }
            //   } else {
            //     break calculateNextDirection;
            //   }
            // } else if (i === 2) { // going down
            //   if (((location.row + j) <= this.size) && (typeof this.gameData[location.row + j][location.col] !== 'undefined')) {
            //     if (this.gameData[location.row + j][location.col].isBlocked === false) {
            //       this.gameData[location.row + j][location.col].isAvailable = true;
            //     } else {
            //       break calculateNextDirection;
            //     }
            //   } else {
            //     break calculateNextDirection;
            //   }
            // } else { // going left
            //   console.log('been here ');
            //   console.log('djjjj: ' + j);
            //   if (((location.col - j) <= (this.size - this.size)) && (typeof this.gameData[location.row][location.col - j] !== 'undefined')) {
            //     if (this.gameData[location.row][location.col - j].isBlocked === false) {
            //       this.gameData[location.row][location.col - j].isAvailable = true;
            //     } else {
            //       break calculateNextDirection;
            //     }
            //   } else {
            //     break calculateNextDirection;
            //   }
            // }
    //       }
    // }
    // this.testingNum++;

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

  randomLocation(text) {
    if ((typeof text === 'string') && (text === 'player')) {
      if (this.flag) {
        let min = this.size - this.size;
        let max = this.size - (0.7 * this.size);
        this.flag = !this.flag;
        while (true) {
          let randomLocation = this.gameData[Math.floor(Math.random() * (max - min + 1)) + min][Math.floor(Math.random() * (max - min + 1)) + min];
          if (randomLocation.isBlocked === false && randomLocation.weapon === null) {
            return randomLocation;
          }
        }
      } else {
        let min = (0.6 * this.size);
        let max = this.size - 1;
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