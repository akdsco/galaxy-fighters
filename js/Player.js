class Player {
  constructor(number) {
    this._name = 'Player ' + number;
    this._locationY = 0;
    this._locationX = 0;
    this._weapon = {name: 'Initial Weapon', damage: 10};
    this._number = number;
  }

}