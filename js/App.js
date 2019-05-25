$(function () {
  const gameNode = document.getElementById('game');
  const game = '#game';
  let currentGame = new Board(10);
  // debug
  console.log(currentGame);

  $('#play-button').on('click', () => {
    gameNode.prepend(currentGame.createGameNode());
    $('#restart-button').show('inline-block');
    $('#title-h1').hide();
    $('#play-button').hide();
    turn = 0;
  });

  $('#restart-button').on('click', () => {
    gameNode.removeChild(gameNode.childNodes[0]);
    currentGame = new Board(10);
    gameNode.prepend(currentGame.createGameNode());
    turn = 0;
  });

  let turn = 0;

  $(game).on('click','TD', (e) => {
    switch (turn) {
      case 0:
        // move player
        currentGame.movePlayer(turn, e);
        console.log(currentGame.gameData);

        //TODO implement code to handle mouseenter and mouseleave on other player (for example show crosses swords?)

        //TODO When both players stand on weapons and one of them moves away, both weapons get revealed. Why? investigate.

        //TODO review written code in all .js files and post a git tag

        //TODO improve event handling (so that there's no ghost's left behind.. haha)

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

  // handling mouse over available fields as well as over weapons

  $(game).on('mouseenter','td',((e) => {
    if(e.target.classList.contains('available')) {
      if(e.target.childElementCount === 1) {
        // player (half-opacity) img only
        $(e.target.firstChild).show();
      }
      if(e.target.childElementCount === 2) {
        // player (half-opacity) img
        $(e.target.children[0]).show();
        // weapon img
        $(e.target.children[1]).hide();
      }
    }
  }));

  $(game).on('mouseleave','.half-opacity', ((e) => {
    if(e.target.parentElement.classList.contains('available')) {
      if(e.target.parentElement.childElementCount === 1) {
        $(e.target.parentElement.firstChild).hide();
      }
      if(e.target.parentElement.childElementCount === 2) {
        $(e.target.parentElement.children[0]).hide();
        $(e.target.parentElement.children[1]).show();
      }
    }
  }));

  // what to do when players point to each other (fight?)

  $(game).on('mouseenter','td', ((e) => {
    if(e.target.classList.contains('available')) {
      if (e.target.firstChild.classList.contains('player')) {
        console.log('mouse enter player');
        console.log(e.target);
        $(e.target.firstChild).hide();
        let swordsNode = document.createElement('img');
        swordsNode.classList.add('fight');
        swordsNode.setAttribute('src','img/weapon/swords.png');
        swordsNode.setAttribute('width','40');
        swordsNode.setAttribute('height','40');
        console.log(e.target);
        $(e.target.prepend(swordsNode));
        console.log('exit');
      }
    }
    }));

  $(game).on('mouseleave','.fight', ((e) => {
    console.log('mouse leave');
    console.log(e.target);
    if(e.target.parentElement.classList.contains('available')) {
      let tempNode = e.target.parentElement;
      $(tempNode.firstChild).remove();
      $(tempNode.firstChild).show();
    }
  }));

});

