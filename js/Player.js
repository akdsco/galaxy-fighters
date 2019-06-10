class Player {
  constructor(number,name) {
    this._name = name;
    this._health = 100;
    this._playerLocationY = 0;
    this._playerLocationX = 0;
    this._weapon = {name: 'Light Saber', damage: 10, src: 'img/weapon/light-saber.png'};
    this._number = number;
    this._isDefending = false;
  }

}