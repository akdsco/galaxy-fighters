class Location {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.isBlocked = false;
    this.isOccupied = false;
    this.weapon = null;
  }

  addLocationNode() {
    let locationNode = document.createElement('td');
    locationNode.setAttribute('id','loc_' + this.row + '_' + this.col);

    if (this.isBlocked) {
      locationNode.classList.add('blocked');
    }
    if (this.isOccupied) {
      locationNode.classList.add('player');
    }
    if (this.weapon !== null) {
      console.log(this.weapon.name);
      locationNode.classList.add('weapon');
    }
    return locationNode;
  }
}
