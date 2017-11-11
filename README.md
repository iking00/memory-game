# MEMORY GAME

Display a game board of cards with symbols that the player tries to match two at a time. Once the player matches all cards the game is won.

## Background

This game was developed to complete a project for the Udacity Front-End Web Developer Nanodegree.

## Dependencies

- jQuery
- FontAwesome

## Functionality

### Game Logic
- Cards are shuffled and added to a game board at the start of each game.
`appendCards();`
- Player flips over two cards.
- If the cards match they are animated and remain open.
- If the cards do not match they are transformed and then hidden.
- Once all cards are matched a modal is displayed with the time taken and star rating.
- The `cardsOpened` closure provides the functionality to track cards.
```Javascript
	//add a new item to array of open cards with the font awesome class of the icon
	cardsOpened.addCard(icon);
	//remove the last two cards added as they are not a match
	cardsOpened.emtpyCards();
	//return the array of all open cards
	cardsOpened.getCards();
	//reset the array of open cards...used while restarting game
	cardsOpened.reset();
	//used to determine if there are two opened cards to be matched
	cardsOpened.waitingMatch();
```
- The game can be restarted at any time.
`resetGameBoard();`

### Game Stats
- Game has a timer that starts on first click of a card. The timer continues to run until all cards are matched or the game is reset.
```Javascript
	//start timer
	timer.start();
	//stop timer
	timer.stop();
	//get bool status of timer
	timer.running();
```
- The game tracks moves made and is incremented every time two cards are turned over.
```Javascript
	//add a move
	movesMade.addMove();
	//reset move counter
	movesMade.reset();
	//return current number of moves
	movesMade.value();
```
- Each game has a star rating. The initial star rating is 3. As moves are made the star rating is reduced down to 1.