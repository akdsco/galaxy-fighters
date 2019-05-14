class Player {
  constructor(number) {
    this._name = 'Player ' + number;
    this._locationX = 0;
    this._locationY = 0;
    this._weapon = {name: 'Initial Weapon', damage: 10};
    this._number = number;
  }

  // Getters & Setters

  get getNumber() {
    return this._number;
  }

  get getName() {
    return this._name;
  }

  get getLocationX() {
    return this._locationX;
  }

  set setLocationX(value) {
    this._locationX = value;
  }

  get getLocationY() {
    return this._locationY;
  }

  set setLocationY(value) {
    this._locationY = value;
  }

  get getWeapon() {
    return this._weapon;
  }

  set setWeapon(weaponObject) {
    this._weapon = weaponObject;
  }
}