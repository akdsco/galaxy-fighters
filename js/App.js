$(function () {
  const gameNode = document.getElementById('header');
  let testBoard = document.createElement('table');

  for (let i = 0; i < 5; i++) {
    testBoard.appendChild(document.createElement('tr'));
    for (let j = 0; j < 5; j ++) {
      let tdNode = document.createElement('td');
      tdNode.textContent = i + ', ' + j;
      testBoard.appendChild(tdNode);
    }
  }

  $('#play-button').on('click', function () {
    gameNode.appendChild(testBoard);
    $('#title-h1').hide();
    $('#play-button').hide();
  });


});