function closeModal() {
	$('#modalWon').hide();
}

/**
* @description Reset gameboard and hide modal to play again
*/
function modalRestart() {
	resetGameBoard();
	$('#modalWon').hide();
}

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
function appendCards() {
	//array to store icons in pairs of two
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
	//shuffly array of icons
	const iconsShuffled = shuffle(icons);
	//traverse shuffled array and create li with icons
	for (const icon of iconsShuffled) {
		const cardHtml = '<li class="game-card"><i class="fa ' + icon + '" aria-hidden="true"></i></li>';
		$('ul.game-board').append(cardHtml);
	}
}

/**
* @description Attach event to handle the matching of cards
*/
function attachCardEvent() {
	//open card when clicked;filter out cards with .show as they are already open
	$('.game-board').on('click', '.game-card:not(.show)', openCard);
}

/**
* @description After matching cards opened, update style and keep them open
*/
function cardsMatched() {
	$('.open').addClass('match').removeClass('open');
}

/**
* @description After non-matching cards opened, hide them and remove from open cards
*/
function cardsNotMatched() {
	//hide cards and remove from array of open cards
	$('.no-match').removeClass('show no-match');
	cardsOpened.emptyCards();
	//re-enable events that were disabled while non matching cards are shown
	attachCardEvent();
}

/**
* @desciprtion Test if open cards match
* @param {array} openCards - Array of open cards
*/
function matchCards(openCards) {
	//array storing cards that have been opened
	const lenOpenCards = openCards.length;
	//get the cards pending match (last two items in array)
	const cardOne = openCards[lenOpenCards - 2];
	const cardTwo = openCards[lenOpenCards - 1];
	if (cardOne === cardTwo){
		//keep the cards open
		cardsMatched();
	} else {
		//disable events to prevent extra click during timeout
		$('.game-board').off('click');
		//update styling to indicate not a match, allow a second before hiding card so user can see it
		$('.open').removeClass('open').addClass('no-match');
		setTimeout(cardsNotMatched,1000);
	}
}

/**
* @description All cards match; stop timer and display result modal
*/
function gameOver() {
	timer.stop();
	$('#modalWon').show();
}

/**
* @description Show card symbol on click event and test match status
* @param {object} event - Click event object
*/
function openCard(event) {
	//boolean status of timer; if it is not running then start it
	const timerOn = timer.running();
	if (!timerOn){
		timer.start();
	}
	//set styling so card is displayed
	$(this).addClass('open');
	$(this).addClass('show');
	//add to array of open cards
	const thisClass = $(this).children('i').attr('class');
	cardsOpened.addCard(thisClass);
	//if two cards are open then check if they match and increment moves made
	openCards = cardsOpened.getCards();
	const boolMatch = cardsOpened.waitingMatch();
	if (boolMatch) {
		matchCards(openCards);
		movesMade.addMove();
	}
	//if all cards are open...the game is won
	lenOpen = openCards.length;
	if (lenOpen === 16) {
		gameOver();
	}
}

/**
* @description Reset game board
*/
function resetGameBoard() {
	//remove cards from html
	$('.game-board').empty();
	//shuffle array of cards and append shuffled cards to game board
	appendCards();
	//set number of moves to 0
	movesMade.reset();
	//empty array of open cards
	cardsOpened.reset();
	//show all stars that were hidden
	$('.stars li').show();
	//if the timer is running then stop it
	const timerOn = timer.running();
	if (timerOn){
		timer.stop();
	}
	//update timer to 0
	$('.time').text('0:00');
}
/**
* @description Closure to store, empty and retrieve open cards
*/
const cardsOpened = (function() {
	//running array to store all open cards
	let openCards = [];
	return {
		addCard: function(icon) {
			//card opened add to array
			openCards.push(icon);
		},
		emptyCards: function() {
			//cards are not a match; remove from array
			openCards.pop();
			openCards.pop();
		},
		getCards: function() {
			return openCards;
		},
		reset: function() {
			//game is restarted; empty array of cards
			openCards = [];
		},
		waitingMatch: function(){
			//cards are matched in pairs of two; if even number of cards are in array then last two need to be checked for a match
			const openLen = openCards.length;
			return openLen % 2 === 0;
		}
	}
})();

/**
* @description Count number of moves
*/
const movesMade = (function() {
	let counter = 0;
	return {
		addMove: function() {
			counter += 1;
			//update moves made in html
			$('.moves').text(counter);
			//if this move exceeds a limit then start hiding stars 
			if (counter === 10){
				$('.stars li:nth-child(1)').hide();
			} else if (counter === 15) {
				$('.stars li:nth-child(2)').hide();
			}
		},
		reset: function() {
			//start a new game
			counter = 0;
			$('.moves').text('0');
		},
		value: function() {
			return counter;
		}
	}
})();

/**
* @description track and display time taken
*/
const timer = (function() {
	//store number of seconds that have elapsed
	let counter = 0;
	function displayTime() {
		//add a second to counter; counter is a running sum of seconds elapsed
		counter += 1;
		let minutes = Math.floor(counter / 60);
		//add a leading zero to seconds when one digit; otherwise, it will be sliced
		let seconds = '0' + counter % 60;
		seconds = seconds.slice(-2);
		$('.time').text(minutes + ':' + seconds);		
	}
	let interval;
	let timerOn = false;
	return {
		start: function() {
			//initiate timer; 
			counter = 0;
			//increment counter every second
			interval = setInterval(displayTime, 1000);
			timerOn = true;
		},
		stop: function() {
			//stop incrementing counter
			clearInterval(interval);
			timerOn = false;
		},
		running: function() {
			//used to check whether or not the timer is being incremented
			return timerOn;
		}
	}	
})();

/**
* @description On Ready shuffle and add cards; add click event
*/
$(function() {
	appendCards();
	attachCardEvent();
});