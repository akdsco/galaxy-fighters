class Player {
  constructor(name) {
    this.name = name;
    this.health = 100;
    this.playerLocationY = 0;
    this.playerLocationX = 0;
    this.weapon = {name: 'Light Saber', damage: 10, src: 'img/weapon/light-saber.png'};
    this.number = Player.number;
    this.isDefending = false;
    Player.number++;
  }
}

Player.number = 1;