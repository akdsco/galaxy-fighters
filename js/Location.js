class Location {
  constructor(row, col) {
    this._locationY = row;
    this._locationX = col;
    this.isBlocked = false;
    this.isAvailable = false;
    this.weapon = null;
    this.player = null;
  }

  addLocationNode() {
    let tdNode = document.createElement('td');
    let pNode = document.createElement('p');
    tdNode.setAttribute('id','loc_' + this._locationY + '_' + this._locationX);

    // location numbers debug
    // tdNode.innerText = 'y'+ this._locationY + ' ' + 'x'+this._locationX;

    if (this.isBlocked) {
      tdNode.classList.add('blocked');
    }
    if (this.player !== null) {
      if (this.player._number === 1) {
        let imgNode = document.createElement('img');
        imgNode.setAttribute('src','img/yoda_sm.jpg');
        imgNode.setAttribute('width','50');
        imgNode.setAttribute('height','50');
        tdNode.appendChild(imgNode);
      } else {
        let imgNode = document.createElement('img');
        imgNode.setAttribute('src','img/vader_sm.jpg');
        imgNode.setAttribute('width','50');
        imgNode.setAttribute('height','50');
        tdNode.appendChild(imgNode);
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


}