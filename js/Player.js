class Player {
  constructor(name) {
    this.name = name;
    this.health = 100;
    this.number = Player.number;
    this.isDefending = false;
    this.weapon = {name: 'Light Saber', damage: 10, src: 'img/weapon/light-saber.png'};
    Player.number++;
  }
}

Player.number = 1;