$(function () {
  const gameNode = document.getElementById('game');
  const game = '#game';
  let currentGame = new Board(10);
  // debug
  console.log(currentGame);

  $('#play-button').on('click', function () {
    gameNode.prepend(currentGame.createGameNode());
    $('#restart-button').show('inline-block');
    // $('#header').css("padding-top", ".3%");
    $('#title-h1').hide();
    $('#play-button').hide();
    turn = 0;
  });

  $('#restart-button').on('click', function () {
    gameNode.removeChild(gameNode.childNodes[0]);
    currentGame = new Board(10);
    gameNode.prepend(currentGame.createGameNode());
    turn = 0;
  });

  let turn = 0;

  $(game).on('click','TD', function (e) {
    switch (turn) {
      case 0:
        // move player
        currentGame.movePlayer(turn, e);
        console.log(currentGame.gameData);

        //TODO implement code to handle mouseenter and mouseleave on other player (for example show crosses swords?)

        //TODO improve visual side of the game (center restart-button etc.)

        //TODO review written code in all .js files and post a git tag

        // check abs value between players, if it's 1 enter fight mode
        // or when players selects other players location
        // when fight is over, display winners name and quit = true;


        turn++;
        break;
      case 1:
        currentGame.movePlayer(turn, e);
        console.log(currentGame.gameData);

        turn--;
        break;
    }
  });

  $(game).on('mouseenter','td',((e) => {
    if (e.target.classList.contains('available')) {
      if (e.target.childElementCount === 1) {
        console.log(e.target.childElementCount);
        if (e.target.childElementCount > 1) {
          // hide weapon
          // show player
          console.log('more than one children now');
        }
        console.log('only one children');
        // show player
      }
    }
  }));

  $(game).on('mouseenter','img',((e) => {
    if (e.target.parentElement.classList.contains('available')) {
      console.log(e.target.parentElement.childElementCount);
      if (e.target.parentElement.childElementCount > 1) {
        console.log('more than one children now in img');
      } else {
        console.log('only one children');
      }
    }
  }));

  $(game).on('mouseleave','.half-opacity',(function (e) {
    $(e.target).hide();
  }));

});

