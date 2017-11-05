// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
* @description Traverses array and appends li with icons 
*/
function appendCards(){
	const icons = [
		'fa-anchor',
		'fa-anchor',
		'fa-car',
		'fa-car',
		'fa-bell',
		'fa-bell',
		'fa-bug',
		'fa-bug',
		'fa-diamond',
		'fa-diamond',
		'fa-bomb',
		'fa-bomb',
		'fa-paw',
		'fa-paw',
		'fa-tree',
		'fa-tree',
	];
	const iconsShuffled = shuffle(icons);
	for (const icon of iconsShuffled) {
		const cardHtml = '<li class="game-card"><i class="fa ' + icon + '" aria-hidden="true"></i></li>';
		$('ul.game-board').append(cardHtml);
	}
}

/**
*@description Show card symbol on click event
*@param {object} event - Click event object
*/
function openCard(event){
	$(this).addClass('show');
}

$(function(){
	appendCards();
	//open card when clicked;filter out cards with .show as they already open
	$('.game-board').on('click', '.game-card:not(.show)', openCard);
});