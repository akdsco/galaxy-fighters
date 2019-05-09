$(function () {
  const gameNode = document.getElementById('header');
  let testBoard = document.createElement('table');

  for (let i = 0; i < 10; i++) {
    let trNode = document.createElement('tr');
    for (let j = 0; j < 10; j ++) {
      let tdNode = document.createElement('td');
      tdNode.textContent = i + ',' + j;
      trNode.appendChild(tdNode);
      tdNode = null;
    }
    testBoard.appendChild(trNode);
    trNode = null;
  }

  $('#play-button').on('click', function () {
    gameNode.prepend(testBoard);
    $('#restart-button').show();
    $('#header').css("padding-top", ".3%");
    $('#title-h1').hide();
    $('#play-button').hide();
  });


});