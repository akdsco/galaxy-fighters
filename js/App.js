$(function () {
  const gameNode = document.getElementById('game');
  const game = '#game';
  let currentGame = new Board(10);
  // debug
  // console.log(currentGame);

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
    // if ((e.target.nodeName === 'IMG') || (e.target.nodeName === 'TD') || (e.target.nodeName === 'P')) {
    //   if (isAvailable(e)) {
        switch (turn) {
          case 0:
            // move player
            currentGame.movePlayer(turn, e);
            // console.log(currentGame.gameData);

            //TODO review written code in all .js files and post a git tag

            // check abs value between players, if it's 1 enter fight mode
            // or when players selects other players location
            // when fight is over, display winners name and quit = true;


            turn++;
            break;
          case 1:
            currentGame.movePlayer(turn, e);
            // console.log(currentGame.gameData);

            turn--;
            break;
        // }
      // }
    }
  });

  $(game).on('mouseenter','td',(function (e) {
    if (e.target.classList.contains('available')) {
      $(e.target.firstChild).show();
    }
  }));

  $(game).on('mouseleave','.half-opacity',(function (e) {
    $(e.target).hide()
  }));

});

