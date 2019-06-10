$(function () {
  const gameNode = document.getElementById('game');
  const game = '#game';
  let currentGame = new Board(10);

  // debug
  console.log(currentGame);

  // helper function
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  $('#play-button').on('click', () => {
    gameNode.prepend(currentGame.createGameNode());
    $('#header').remove();
    $('main').fadeIn(500);
    turn = 0;
  });

  $('#restart-button').on('click', async () => {
    $(game).fadeOut(400);
    await sleep(380);
    gameNode.removeChild(gameNode.firstChild);
    currentGame = new Board(10);
    currentGame.resetPlayersStats();
    gameNode.prepend(currentGame.createGameNode());
    $(game).fadeIn(400);
    turn = 0;
  });

  let turn = 0;

  $(game).on('click','TD', (e) => {
    if(e.target.parentElement.classList.contains('available')) {
      let endLocationID;
      if ((e.target.nodeName === 'P') || (e.target.nodeName === 'IMG')) {
        endLocationID = e.target.parentNode.id;
      } else if (e.target.nodeName === 'TD') {
        endLocationID = e.target.id;
      }

      switch (turn) {
        case 0:
          // console.log(currentGame.stoppedOnWeapon);
          // move player
          currentGame.movePlayer(turn, endLocationID);
          // console.log(currentGame.gameData);
          // console.log(e);

          //TODO events.. I have no idea how to make it a better experience... :(

          //TODO transpiler not working? 'regeneratorRuntime is not defined' and 'Board is not a constructor'


          // check abs value between players, if it's 1 enter fight mode
          // or when players selects other players location
          // when fight is over, display winners name and quit = true;


          turn++;
          break;
        case 1:
          // console.log(currentGame.stoppedOnWeapon);
          // move player
          currentGame.movePlayer(turn, endLocationID);
          // console.log(currentGame.gameData);
          // console.log(e);

          turn--;
          break;
      }
    }
  });

  $(game).on('mouseleave','.half-opacity', ((e) => {
    if(e.target.parentElement.classList.contains('available')) {
      if(e.target.parentElement.childElementCount === 1) {
        $(e.target.parentElement.firstChild).hide();
      }
      if(e.target.parentElement.childElementCount === 2) {
        $(e.target.parentElement.children[0]).show();
        $(e.target.parentElement.children[1]).hide();
      }
    }
  }));

  $(game).on('mouseenter','.weapon-container', ((e) => {
    if(e.target.parentElement.classList.contains('available')) {
      $(e.target.children[0]).hide();
      $(e.target.children[1]).show();
    }
}));

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

          // sensing other player.. redo this

          // let swordsNode = document.createElement('img');
          // swordsNode.setAttribute('src','img/weapon/swords.png');
          // swordsNode.setAttribute('width','40');
          // swordsNode.setAttribute('height','40');
          // swordsNode.classList.add('fight');
          // $(e.target).append(swordsNode);
          // $(e.target.children[0]).hide();
          // $(e.target.children[1]).hide();
          // $(e.target.children[2]).show();

        } else {
          $(e.target.children[0]).hide();
          $(e.target.children[1]).show();
        }
      }
      // if square already contains 3 nodes, show swords
      // if(e.target.childElementCount === 3) {
      //   $(e.target.children[0]).hide();
      //   $(e.target.children[1]).hide();
      //   $(e.target.children[2]).show();
      // }


      // if both players stand on weapon locations that are within reach ?
      // how to behave then when pointing at other player ?

    }
  }));


});

