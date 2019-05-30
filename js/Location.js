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
    const tdNode = document.createElement('td');
    const playerImgNode = document.createElement('img');
    playerImgNode.classList.add('player');
    let weaponImgNode = document.createElement('img');
    weaponImgNode.classList.add('weapon');

    tdNode.setAttribute('id','loc_' + this._locationY + '_' + this._locationX);

    // location numbers debug
    // tdNode.innerText = 'y'+ this._locationY + ' ' + 'x'+this._locationX;


    // draw blocked locations
    if (this.isBlocked) {
      tdNode.classList.add('blocked');
    }

    // draw players + their weapons
    if (this.player !== null) {
      if (this.player._number === 1) {
        playerImgNode.setAttribute('src','img/yoda-sm.jpg');
        tdNode.prepend(playerImgNode);
        weaponImgNode.setAttribute('src', this.player._weapon.src);
        tdNode.append(weaponImgNode);
      } else {
        playerImgNode.setAttribute('src','img/vader-sm.jpg');
        tdNode.prepend(playerImgNode);
        weaponImgNode.setAttribute('src', this.player._weapon.src);
        tdNode.append(weaponImgNode);
      }
    }

    // add half-opacity images for first player moves
    if (this.isAvailable) {
      tdNode.classList.add('available');
      // make sure to add weapon image if it was generated inside first players available fields
      if(this.weapon !== null) {
        this.isWeaponDisplayed = true;
        weaponImgNode.setAttribute('src', this.weapon.src);
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
        tdNode.appendChild(weaponImgNode);
      }
    }
    return tdNode;
  }

  changePlayersLocation (locationY, locationX) {

  }

}