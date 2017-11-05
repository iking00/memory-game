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

function attachCardEvent(){
	//open card when clicked;filter out cards with .show as they already open
	$('.game-board').on('click', '.game-card:not(.show)', openCard);
}

function cardsMatched(){
	$('.open').addClass('match').removeClass('open');
}

function cardsNotMatched(){
	$('.open').removeClass('open show');
	cardsOpened.emptyCards();
	attachCardEvent();
}

/**
*@desciprtion Test if open cards match
*@param {array} openCards - Array of open cards
*/
function matchCards(openCards){
	const lenOpenCards = openCards.length;
	const cardOne = openCards[lenOpenCards - 2];
	const cardTwo = openCards[lenOpenCards - 1];
	if (cardOne === cardTwo){
		cardsMatched();
	} else {
		//disable events to prevent extra click during timeout
		$('.game-board').off('click');
		setTimeout(cardsNotMatched,1000);
	}
}

/**
*@description All cards match display result modal
*/
function gameOver(){
	//TO DO: create and display result modal
	clearInterval(timer);
}

/**
*@description Show card symbol on click event and test match status
*@param {object} event - Click event object
*/
function openCard(event){
	$(this).addClass('open show');
	const thisClass = $(this).children('i').attr('class');
	cardsOpened.addCard(thisClass);
	openCards = cardsOpened.getCards();
	const boolMatch = cardsOpened.waitingMatch();
	if (boolMatch) {
		matchCards(openCards);
	}
	movesMade.addMove();
	lenOpen = openCards.length;
	if (lenOpen === 16) {
		gameOver();
	}
}

/**
*@description Closure to store, empty and retrieve open cards
*/
const cardsOpened = (function() {
	let openCards = [];
	return {
		addCard: function(icon){
			openCards.push(icon);
		},
		emptyCards: function(){
			openCards.pop();
			openCards.pop();
		},
		getCards: function(){
			return openCards;
		},
		waitingMatch: function(){
			const openLen = openCards.length;
			return openLen % 2 === 0;
		}
	}
})();

/**
*@description Count number of moves
*/
const movesMade = (function() {
	let counter = 0;
	return {
		addMove: function(){
			counter += 1;
			$('.moves').text(counter);
			if (counter === 17){
				$('.stars li:nth-child(1)').hide();
			} else if (counter === 25) {
				$('.stars li:nth-child(2)').hide();
			}
		},
		reset: function(){
			counter = 0;
		},
		value: function(){
			return counter;
		}
	}
})();

/**
*@description track and display time taken
*/
const timer = (function() {
	let counter = 0;
	return setInterval(function(){
		counter += 1;
		const minutes = Math.floor(counter / 60);
		let seconds = '0' + counter % 60;
		seconds = seconds.slice(0,2);
		$('.time').text(minutes + ':' + seconds);
	}, 1000);
})();

$(function(){
	appendCards();
	attachCardEvent();
});