//TODO events.. I have no idea how to make it a better experience... :(

//TODO transpiler not working? 'regeneratorRuntime is not defined' and 'Board is not a constructor'

$(function () {
  const gameNode = document.getElementById('game');
  const game = '#game';
  let currentGame = new Board(10);

  // debug
  // console.log(currentGame);

  // helper function
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Start and restart buttons

  $('#play-button').on('click', () => {
    gameNode.prepend(currentGame.createGameNode());
    $('#header').remove();
    $('main').fadeIn(500);
    turn = 0;
  });

  $('#restartGame').on('click', async () => {
    $(game).fadeOut(400);
    await sleep(380);
    gameNode.removeChild(gameNode.firstChild);
    currentGame = new Board(10);
    currentGame.resetPlayersStats();
    gameNode.prepend(currentGame.createGameNode());
    $(game).fadeIn(400);
    turn = 0;
  });

  $('#playAgain').on('click', () => {
    // reset game to original state
    gameNode.removeChild(gameNode.firstChild);
    currentGame = new Board(10);
    currentGame.resetPlayersStats();
    gameNode.prepend(currentGame.createGameNode());
    $('#player-0-Box').css({'border': '2px solid burlywood'});
    $('#player-1-Box').css({'border': '2px solid burlywood'});
    $('#player-1-Defend').prop('disabled', false);
    $('#player-1-Attack').prop('disabled', false);
    $('#player-0-Defend').prop('disabled', false);
    $('#player-0-Attack').prop('disabled', false);
    $('#rightColumn').append($('#fightBox'));
    $('main').fadeIn(500);
    turn = 0;
  });

  let turn = 0;

  // Board movement events

  $(game).on('click', 'TD', (e) => {
    if (e.target.parentElement.classList.contains('available')) {
      let endLocationID;
      if ((e.target.nodeName === 'P') || (e.target.nodeName === 'IMG')) {
        endLocationID = e.target.parentNode.id;
      } else if (e.target.nodeName === 'TD') {
        endLocationID = e.target.id;
      }

      switch (turn) {
        case 0:
          currentGame.movePlayer(turn, endLocationID);

          // debug
          // console.log(currentGame.gameData);
          // console.log(e);

          turn++;
          break;
        case 1:
          currentGame.movePlayer(turn, endLocationID);

          // debug
          // console.log(currentGame.gameData);
          // console.log(e);

          turn--;
          break;
      }
    }
  });


  $(game).on('mouseenter', '.weapon-container', ((e) => {
    if (e.target.parentElement.classList.contains('available')) {
      console.log('mouseenter weapon container');
      console.log('hides first target element');
      $(e.target.children[0]).hide();
      console.log('shows targets parent element second child');
      $(e.target.parentElement.children[1]).show();
    }
  }));

  $(game).on('mouseleave','.weapon-container', ((e) => {
    if (e.target.parentElement.classList.contains('available')) {
      console.log('mouseleave weapon container that is within available td');
      console.log($(e.target.parentElement.children[0]));
      console.log('shows targets parent element first child');
      $(e.target.parentElement.children[0]).show();
      console.log('hides targets parent element second child');
      $(e.target.parentElement.children[1]).hide();
    }
  }));







  // when mouse over available field that contains only .half-opacity img
  $(game).on('mouseenter', 'td', ((e) => {
    if (e.target.classList.contains('available')) {
      console.log('mouseenter td that is available');

      // player (half-opacity) img only in td
      if (e.target.childElementCount === 1) {
        $(e.target.firstChild).show();
      }
    }
  }));

  // when mouse leaves available field that contains only .half-opacity img
  $(game).on('mouseleave', '.half-opacity', ((e) => {
    if (e.target.parentElement.classList.contains('available')) {
      if (e.target.parentElement.childElementCount === 1) {
        console.log('mouse left .half-op with 1 elem');
        $(e.target.parentElement.firstChild).hide();
      }
    }
  }));

  // Fight mode events

  $('.defendButton').on('click', () => {
    const p0 = '#player-0-';
    const p1 = '#player-1-';
    switch (turn) {
      case 0:
        currentGame.defend(turn, p0, p1);
        turn++;
        break;
      case 1:
        currentGame.defend(turn, p0, p1);
        turn--;
        break;
    }
  });

  $('.attackButton').on('click', () => {
    const p0 = '#player-0-';
    const p1 = '#player-1-';

    switch (turn) {
      case 0:
        currentGame.attack(turn, p0, p1);
        turn++;
        break;
      case 1:
        currentGame.attack(turn, p0, p1);
        turn--;
        break;
    }
  });

  $('#closeGame').on('click', () => {
    window.close();
  });

});

