class Location {
  constructor(row, col) {
    this._locationY = row;
    this._locationX = col;
    this.isBlocked = false;
    this.isAvailable = false;
    this.weapon = null;
    this.player = null;
    this.counter = 0;
  }

  addLocationNode() {
    const tdNode = document.createElement('td');
    const imgNode = document.createElement('img');
    imgNode.setAttribute('width','40');
    imgNode.setAttribute('height','40');

    tdNode.setAttribute('id','loc_' + this._locationY + '_' + this._locationX);

    // location numbers debug
    // tdNode.innerText = 'y'+ this._locationY + ' ' + 'x'+this._locationX;

    if (this.isBlocked) {
      tdNode.classList.add('blocked');
    }
    if (this.player !== null) {
      if (this.player._number === 1) {
        imgNode.setAttribute('src','img/alt-yoda-sm.jpg');
        imgNode.classList.add('player');
        tdNode.prepend(imgNode);
      } else {
        imgNode.setAttribute('src','img/alt-vader-sm.jpg');
        imgNode.classList.add('player');
        tdNode.prepend(imgNode);
      }
    }

    if (this.isAvailable) {
      tdNode.classList.add('available');
      if(this.weapon !== null) {
        this.counter++;
        let weaponImgNode = document.createElement('img');
        weaponImgNode.setAttribute('width','25');
        weaponImgNode.setAttribute('height','25');
        weaponImgNode.setAttribute('src', this.weapon.src);
        weaponImgNode.classList.add('weapon');
        tdNode.prepend(weaponImgNode);
      }
      imgNode.classList.add('half-opacity');
      imgNode.setAttribute('id','ghostPlayer');
      imgNode.setAttribute('src','img/alt-yoda-sm.jpg');
      tdNode.prepend(imgNode);
    }

    if (this.weapon !== null) {
      if(this.counter === 0) {
        imgNode.setAttribute('width','25');
        imgNode.setAttribute('height','25');
        imgNode.setAttribute('src', this.weapon.src);
        imgNode.classList.add('weapon');
        tdNode.appendChild(imgNode);
      } else {
        this.counter--;
      }
    }
    return tdNode;
  }

  changePlayersLocation (locationY, locationX) {

  }

}