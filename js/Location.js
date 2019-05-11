class Location {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.isBlocked = false;
    this.isAvailable = false;
    this.weapon = null;
    this.player = null;
  }

  addLocationNode() {
    let tdNode = document.createElement('td');
    let pNode = document.createElement('p');
    tdNode.setAttribute('id','loc_' + this.row + '_' + this.col);

    if (this.isBlocked) {
      tdNode.classList.add('blocked');
    }
    if (this.player !== null) {
      if (this.player.number === 1) {
        tdNode.classList.add('playerOne');
        pNode.innerText = 'P' + this.player.number;
        tdNode.appendChild(pNode);
      } else {
        tdNode.classList.add('playerTwo');
        pNode.innerText = 'P' + this.player.number;
        tdNode.appendChild(pNode);
      }
    }
    if (this.weapon !== null) {
      pNode.innerText = this.weapon.name[0] + '-' + this.weapon.name[7];
      tdNode.appendChild(pNode);
      tdNode.classList.add('weapon');
    }
    if (this.isAvailable) {
      tdNode.classList.add('available');
    }
    return tdNode;
  }

  movePlayer(currentLocation, newLocation) {

  }

}