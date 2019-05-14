class Player {
  constructor(number) {
    this.name = 'Player ' + number;
    this.locationX = 0;
    this.locationY = 0;
    this.number = number;
    this.weapon = {name: 'Initial Weapon', damage: 10};
  }

}