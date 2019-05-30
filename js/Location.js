class Location {
  constructor(row, col) {
    this._locationY = row;
    this._locationX = col;
    this.isBlocked = false;
    this.isAvailable = false;
    this.weapon = null;
    this.player = null;
    this.isWeaponDisplayed = false;
  }

  addLocationNode() {
    // create nodes
    const tdNode = document.createElement('td');
    const playerContainer = document.createElement('div');
    const playerImgNode = document.createElement('img');
    const weaponImgNode = document.createElement('img');

    //add relevant classes to nodes
    playerContainer.classList.add('player-container');
    playerImgNode.classList.add('player');
    weaponImgNode.classList.add('weapon');

    tdNode.setAttribute('id','loc_' + this._locationY + '_' + this._locationX);

    // location numbers debug
    // tdNode.innerText = 'y'+ this._locationY + ' ' + 'x'+this._locationX;

    // draw blocked locations
    if (this.isBlocked) {
      tdNode.classList.add('blocked');
    }

    // draw players + their weapons

    //TODO wrap player and weapon into one 'div' element and move them together, swap weapon element only when crossing
    // weapon location

    if (this.player !== null) {
      if (this.player._number === 1) {
        playerImgNode.setAttribute('src','img/yoda-sm.jpg');
        playerContainer.append(playerImgNode);
        weaponImgNode.setAttribute('src', this.player._weapon.src);
        weaponImgNode.setAttribute('title',this.player._weapon.name + ' does ' + this.player._weapon.damage + ' damage.');
        playerContainer.append(weaponImgNode);
        tdNode.append(playerContainer);
      } else {
        playerImgNode.setAttribute('src','img/vader-sm.jpg');
        playerContainer.append(playerImgNode);
        weaponImgNode.setAttribute('src', this.player._weapon.src);
        weaponImgNode.setAttribute('title',this.player._weapon.name + ' does ' + this.player._weapon.damage + ' damage.');
        playerContainer.append(weaponImgNode);
        tdNode.append(playerContainer);
      }
    }

    // add half-opacity images for first player moves
    if (this.isAvailable) {
      tdNode.classList.add('available');
      // make sure to add weapon image if it was generated inside first players available fields
      if(this.weapon !== null) {
        this.isWeaponDisplayed = true;
        weaponImgNode.setAttribute('src', this.weapon.src);
        weaponImgNode.setAttribute('title',this.weapon.name + ' does ' + this.weapon.damage + ' damage.');
        tdNode.prepend(weaponImgNode);
      }
      playerImgNode.classList.remove('player');
      playerImgNode.classList.add('half-opacity');
      playerImgNode.setAttribute('src','img/yoda-sm.jpg');
      tdNode.prepend(playerImgNode);
    }

    // add weapons to locations
    if (this.weapon !== null) {
      // makes sure you only add one weapon img to one square (no double images inside available fields)
      if(!this.isWeaponDisplayed) {
        weaponImgNode.setAttribute('src', this.weapon.src);
        weaponImgNode.setAttribute('title',this.weapon.name + ' does ' + this.weapon.damage + ' damage.');
        tdNode.appendChild(weaponImgNode);
      }
    }
    return tdNode;
  }

  // changePlayersLocation (locationY, locationX) {
  //
  // }

}