class Player {
  constructor(number) {
    this._name = 'Player ' + number;
    this._playerLocationY = 0;
    this._playerLocationX = 0;
    this._weapon = {name: 'Light Saber', damage: 10, src: 'img/weapon/light-saber.png'};
    this._number = number;
  }

}