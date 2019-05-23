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
    const tdNode = document.createElement('td');
    const imgNode = document.createElement('img');
    imgNode.setAttribute('width','50');
    imgNode.setAttribute('height','50');

    tdNode.setAttribute('id','loc_' + this._locationY + '_' + this._locationX);

    // location numbers debug
    // tdNode.innerText = 'y'+ this._locationY + ' ' + 'x'+this._locationX;

    if (this.isBlocked) {
      tdNode.classList.add('blocked');
    }
    if (this.player !== null) {
      if (this.player._number === 1) {
        imgNode.setAttribute('src','img/yoda_sm.jpg');
        imgNode.classList.add('player');
        tdNode.prepend(imgNode);
      } else {
        imgNode.setAttribute('src','img/vader_sm.jpg');
        imgNode.classList.add('player');
        tdNode.prepend(imgNode);
      }
    }
    if (this.weapon !== null) {
      imgNode.setAttribute('src', this.weapon.src);
      imgNode.classList.add('weapon');
      tdNode.appendChild(imgNode);
      // tdNode.classList.add('weapon');
    }
    if (this.isAvailable) {
      tdNode.classList.add('available');
      imgNode.classList.add('half-opacity');
      imgNode.setAttribute('id','ghostPlayer');
      imgNode.setAttribute('src','img/yoda_sm.jpg');
      tdNode.prepend(imgNode);
    }
    return tdNode;
  }


}