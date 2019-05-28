$(function () {
  const gameNode = document.getElementById('game');
  const game = '#game';
  let currentGame = new Board(10);
  // debug
  console.log(currentGame);

  $('#play-button').on('click', () => {
    gameNode.prepend(currentGame.createGameNode());
    $('#header').remove();
    $('main').show();
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
    if(e.target.parentElement.classList.contains('available')) {
      switch (turn) {
        case 0:
          console.log(currentGame.stoppedOnWeapon);
          // move player
          currentGame.movePlayer(turn, e);
          // console.log(currentGame.gameData);
          console.log(e);

          //TODO improve mouseenter and mouseleave on other player

          // Event works as 'mouseleave' on '.fight' but the movement has to be super fast. I could
          // implement .hide() and then it works better but it implies that I have to find a way to .remove()
          // third child element somehow, why does it work only when moving fast over element?


          //TODO When both players stand on weapons and one of them moves away, both weapons get revealed. Why? investigate.
          // It looks like the setTimeout function makes it available for this to happen, why?

          //TODO passing over two weapons at once.. fix this
          // along with standing on one weapon and moving to next weapon..

          //TODO review written code in all .js files and post a git tag


          // check abs value between players, if it's 1 enter fight mode
          // or when players selects other players location
          // when fight is over, display winners name and quit = true;


          turn++;
          break;
        case 1:
          console.log(currentGame.stoppedOnWeapon);
          currentGame.movePlayer(turn, e);
          // console.log(currentGame.gameData);
          console.log(e);

          turn--;
          break;
      }
    }
  });

  // handling mouse over available fields as well as over weapons
  $(game).on('mouseenter','td',((e) => {
    if(e.target.classList.contains('available')) {
      // player (half-opacity) img only
      if(e.target.childElementCount === 1) {
        $(e.target.firstChild).show();
      }
      // when square contains two nodes
      if(e.target.childElementCount === 2) {
        // and one of them is other player, add swords node and show swords
        if(e.target.firstChild.classList.contains('player')) {
          let swordsNode = document.createElement('img');
          swordsNode.setAttribute('src','img/weapon/swords.png');
          swordsNode.setAttribute('width','40');
          swordsNode.setAttribute('height','40');
          swordsNode.classList.add('fight');
          $(e.target).append(swordsNode);
          $(e.target.children[0]).hide();
          $(e.target.children[1]).hide();
          $(e.target.children[2]).show();

        } else {
          // otherwise show player (half-opacity) img
          $(e.target.children[0]).show();
          // and hide weapon img
          $(e.target.children[1]).hide();
        }
      }
      // if square already contains 3 nodes, show swords
      if(e.target.childElementCount === 3) {
        $(e.target.children[0]).hide();
        $(e.target.children[1]).hide();
        $(e.target.children[2]).show();
      }

      // if both players stand on weapon locations that are within reach ?
      // how to behave then when pointing at other player ?

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

  $(game).on('mouseleave','.fight', ((e) => {
    if(e.target.parentElement.classList.contains('available')) {
      if(e.target.parentElement.childElementCount === 3) {
        // console.log('getting here');
        console.log(e.target.parentElement.children[0]);
        console.log(e.target.parentElement.children[2]);
        // not fully working (only when fast moving mouse over player img)
        $(e.target.parentElement.children[0]).show();
        $(e.target.parentElement.children[2]).remove();
      }
    }
  }));

});

