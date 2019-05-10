$(function () {
  const gameNode = document.getElementById('header');

  $('#play-button').on('click', function () {
    gameNode.prepend(new Board(10).createGameNode());
    $('#restart-button').show();
    $('#header').css("padding-top", ".3%");
    $('#title-h1').hide();
    $('#play-button').hide();
  });

  $('#restart-button').on('click', function () {
    gameNode.removeChild(gameNode.childNodes[0]);
    gameNode.prepend(new Board(10).createGameNode());
  })

});