//TODO transpiler not working? 'regeneratorRuntime is not defined' and 'Board is not a constructor'

class App {
  constructor() {
    this.gameNode = document.getElementById('game');
    this.game = '#game';
    this.currentGame = new Board(10);
    this.turn = 0;

    // initiate handlers
    this.initiateControlButtonsHandlers();
    this.initiateMovementHandlers();
    this.initiateFightModeHandlers();
  }

  initiateControlButtonsHandlers() {

    // Start and restart buttons
    $('#play-button').on('click', () => {
      this.gameNode.prepend(this.currentGame.createGameNode());
      $('#header').remove();
      $('main').fadeIn(500);
    });

    $('#restartGame').on('click', async () => {
      $(this.game).fadeOut(400);
      await sleep(380);
      this.gameNode.removeChild(this.gameNode.firstChild);
      Player.number = 1;
      this.currentGame = new Board(10);
      this.currentGame.resetPlayersStats();
      this.gameNode.prepend(this.currentGame.createGameNode());
      $(this.game).fadeIn(400);
      this.turn = 0;
    });

    $('#playAgain').on('click', () => {
      // reset game to original state
      this.gameNode.removeChild(this.gameNode.firstChild);
      Player.number = 1;
      this.currentGame = new Board(10);
      this.currentGame.resetPlayersStats();
      this.gameNode.prepend(this.currentGame.createGameNode());
      $('#player-0-Box').css({'border': '2px solid burlywood'});
      $('#player-1-Box').css({'border': '2px solid burlywood'});
      $('#player-1-Defend').prop('disabled', false);
      $('#player-1-Attack').prop('disabled', false);
      $('#player-0-Defend').prop('disabled', false);
      $('#player-0-Attack').prop('disabled', false);
      $('#rightColumn').append($('#fightBox'));
      $('main').fadeIn(500);
      this.turn = 0;
    });

    $('#closeGame').on('click', () => {
      window.close();
    });

  }

  initiateMovementHandlers() {

    // Board movement
    $(this.game).on('click', 'TD', (e) => {
      if (e.target.parentElement.classList.contains('available')) {
        let endLocationID;
        if ((e.target.nodeName === 'P') || (e.target.nodeName === 'IMG')) {
          endLocationID = e.target.parentNode.id;
        } else if (e.target.nodeName === 'TD') {
          endLocationID = e.target.id;
        }

        switch (this.turn) {
          case 0:
            this.currentGame.movePlayer(this.turn, endLocationID);

            // debug
            // console.log(this.currentGame._gameData);
            // console.log(e);

            this.turn++;
            break;
          case 1:
            this.currentGame.movePlayer(this.turn, endLocationID);

            // debug
            // console.log(this.currentGame._gameData);
            // console.log(e);

            this.turn--;
            break;
        }
      }
    });

    // when mouse enters available square that holds weapon
    $(this.game).on('mouseenter', '.weapon-container', ((e) => {
      if (e.target.parentElement.classList.contains('available')) {
        // hide weapon if you'd like
        // $(e.target).hide();
        $(e.target.parentElement.children[1]).show();
      }
    }));

    // when mouse enters available field that contains only .half-opacity img
    $(this.game).on('mouseenter', 'td', ((e) => {
      if (e.target.classList.contains('available')) {

        // player (half-opacity) img only in td
        if (e.target.childElementCount === 1) {
          $(e.target.firstChild).show();
        }
      }
    }));

    // when mouse leaves available square that displays .half-opacity image
    $(this.game).on('mouseleave', '.half-opacity', ((e) => {
      if (e.target.parentElement.classList.contains('available')) {
        if (e.target.parentElement.childElementCount === 1) {
          $(e.target.parentElement.children[0]).hide();
        } else if(e.target.parentElement.childElementCount === 2) {
          $(e.target.parentElement.children[0]).show();
          $(e.target.parentElement.children[1]).hide();
        }
      }
    }));

  }

  initiateFightModeHandlers() {

    // Fight mode buttons
    $('.defendButton').on('click', () => {
      const p0 = '#player-0-';
      const p1 = '#player-1-';
      switch (this.turn) {
        case 0:
          this.currentGame.defend(this.turn, p0, p1);
          this.turn++;
          break;
        case 1:
          this.currentGame.defend(this.turn, p0, p1);
          this.turn--;
          break;
      }
    });

    $('.attackButton').on('click', () => {
      const p0 = '#player-0-';
      const p1 = '#player-1-';

      switch (this.turn) {
        case 0:
          this.currentGame.attack(this.turn, p0, p1);
          this.turn++;
          break;
        case 1:
          this.currentGame.attack(this.turn, p0, p1);
          this.turn--;
          break;
      }
    });

  }

}

