class Location {
  constructor(row, col) {
    this.locY = row;
    this.locX = col;
    this.isBlocked = false;
    this.isAvailable = false;
    this.weapon = null;
    this.player = null;
    this.isWeaponDisplayed = false;
  }

  createLocationNode() {
    // create nodes
    const tdNode = document.createElement('td');
    const container = document.createElement('div');
    const playerImgNode = document.createElement('img');
    const weaponImgNode = document.createElement('img');

    //add relevant classes to nodes
    playerImgNode.classList.add('player');
    weaponImgNode.classList.add('weapon');

    tdNode.setAttribute('id','loc_' + this.locY + '_' + this.locX);

    // debug - add location coordinates
    // tdNode.innerText = 'locY'+ this.locY + ' ' + 'x'+this.locX;

    // draw blocked locations
    if (this.isBlocked) {
      tdNode.classList.add('blocked');
    }

    // draw players + their weapons
    if (this.player !== null) {
      container.classList.add('player-container');
      if (this.player.number === 1) {
        playerImgNode.setAttribute('src','img/yoda-sm.jpg');
        container.append(playerImgNode);
        weaponImgNode.setAttribute('src', this.player.weapon.src);
        weaponImgNode.setAttribute('title',this.player.weapon.name + ' does ' + this.player.weapon.damage + ' damage.');
        container.append(weaponImgNode);
        tdNode.append(container);
      } else {
        playerImgNode.setAttribute('src','img/vader-sm.jpg');
        container.append(playerImgNode);
        weaponImgNode.setAttribute('src', this.player.weapon.src);
        weaponImgNode.setAttribute('title',this.player.weapon.name + ' does ' + this.player.weapon.damage + ' damage.');
        container.append(weaponImgNode);
        tdNode.append(container);
      }
    }

    // add half-opacity images for first turn
    if (this.isAvailable) {
      tdNode.classList.add('available');
      // make sure to add weapon image if it was generated inside first players available fields
      if(this.weapon !== null) {
        container.classList.add('weapon-container');
        this.isWeaponDisplayed = true;
        weaponImgNode.setAttribute('src', this.weapon.src);
        weaponImgNode.setAttribute('title',this.weapon.name + ' does ' + this.weapon.damage + ' damage.');
        container.append(weaponImgNode);
        tdNode.append(container);
      }
      playerImgNode.classList.remove('player');
      playerImgNode.classList.add('half-opacity');
      playerImgNode.setAttribute('src','img/yoda-sm.jpg');
      tdNode.append(playerImgNode);
    }

    // add weapons to locations
    if (this.weapon !== null) {
      container.classList.add('weapon-container');
      // makes sure you only add one weapon img to one square (no double images inside available fields)
      if(!this.isWeaponDisplayed) {
        weaponImgNode.setAttribute('src', this.weapon.src);
        weaponImgNode.setAttribute('title',this.weapon.name + ' does ' + this.weapon.damage + ' damage.');
        container.append(weaponImgNode);
        tdNode.append(container);
      }
    }
    return tdNode;
  }

}