class Player {
  constructor(number) {
    this._name = 'Player ' + number;
    this._playerLocationY = 0;
    this._playerLocationX = 0;
    this._weapon = {name: 'Weapon 0', damage: 10};
    this._number = number;
  }

}