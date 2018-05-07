// make variables for shorter code
var pCards = document.getElementById('pCards');
var dCards = document.getElementById('dCards');
var info = document.getElementById('info');
var pHand = document.getElementById('pHand');
var dHand = document.getElementById('dHand');
var stats = document.getElementById('stats');
var cardsLeft = document.getElementById('cardsLeft');

// global variables
var deck = [];
var suites = ["club", "diamond", "spade", "heart"];
var values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
var gameStatus = 0; // 0=game start 1=dealers turn 2=game over
var wins = 0;
var ties = 0;
var losses = 0;
var games = 0;
var maxDeck = 0; // size of new deck

// card object constructor
function Card(suite, value){
    this.suite = suite; // club/diamond/heart/spade
    this.value = value; // Ace to King
    // card name, optional
    this.getName = function(){
    return this.value + " of " + this.suit;
    }
    //Blackjack weight of the card
    this.bjWeight = function(){
    if(this.value === "J" || this.value === "Q" || this.value ==="K"){
      return 10;
    }
    else if(this.value ==="A") return 1;
    else return this.value;
  }
  this.getSymbol = function (){
      var symbol = '';
      switch (this.suite){
          case "heart":
              symbol = "&hearts;";
              break;
          case "club":
              symbol = "&clubs;";
              break;
          case "spade":
              symbol = "&spades;";
              break;
          case "diamond":
              symbol = "&diams;";
              break;
      }
      return symbol;
  }
}

// hand object
function Hand(){
    this.hand = [];
    this.cardCount = 0;
    this.bjScore = 0;

    this.drawCard = function(){
      var newCard = deck.pop();
      this.hand.push(newCard);
      this.cardCount++;
    }

    this.getScore = function(){
      var score = 0;
      var aces = 0; // track the number of aces in the hand
      for (var i = 0; i < this.hand.length; i++) {
          score += this.hand[i].bjWeight();
          if (this.hand[i].bjWeight() === 1)
          {
              aces += 1;
          }
      }
      // for each ace add 10 if possible
      for (var j = 0; j < aces; j++)
      {
          if (score + 10 <= 21)
          {
              score +=10;
          }
      }
      this.bjScore = score;
      return score;
        }
      }

// disable and enable html buttons
var disableBtn = function(btn){
  document.getElementById(btn).disabled=true;
  document.getElementById(btn).className="button disabled";
}

var enableBtn = function(btn){
  document.getElementById(btn).disabled=false;
  document.getElementById(btn).className="button";
}

// reset all statistics
var resetStats = function(){
  gameStatus = 0;
  wins = 0;
  ties = 0;
  losses = 0;
  games = 0;
  updateStats();
}

// start a new game
var newGame = function(){
  resetStats(); // reset stats
  deck = createDeck(); //create deck
  deal(); // deal first Cards
};

// deal two cards for player and dealer
  var deal = function(){
    player = new Hand();
    dealer = new Hand();

  // check if enough cards in the deck. If under 25%, creates a new one
  if (deck.length / maxDeck < 0.25) {
    deck = createDeck();
    }
  // disable newgame button and enable hit/stand buttons
  disableBtn("newGameBtn");
  disableBtn("dealBtn");
  enableBtn("hitBtn");
  enableBtn("standBtn");
  // reset text and variables for new game
  pCards.innerHTML = "";
  dCards.innerHTML = "";
  gameStatus = 0;
  // deal the cards
  player.drawCard();
  player.drawCard();
  dealer.drawCard();
  dealer.drawCard();
  // update cards left
  cardsLeft.value = deck.length;

  // check if player has 21 right in the start
  // if (handTotal(playerHand) === 21)
  if (player.getScore() === 21)
  {
      wins += 1;
      games += 1;
      gameStatus = 1; // dealer's hand shown
      renderHands(); // render cards
      info.innerHTML = "Blackjack! You won!";
      updateStats();
      gameStatus = 2; // game over
      return;
  }
  // check for dealer victory
  // if (handTotal(dealerHand) === 21)
  if (dealer.getScore() === 21)
  {
      games += 1;
      losses += 1;
      gameStatus = 1; // to cause the dealer's hand to be drawn face up
      renderHands();
      info.innerHTML = "The dealer had Blackjack. You lost!.";
      updateStats();
      gameStatus = 2; // game over
      return;
  }

  // draw the hands
  renderHands();
  info.innerHTML = "Game is on. Hit or Stand?";
};

var createDeck = function () {
    var deck = [];
    // loop through suites and values, building cards and adding them to the deck
    var x = document.getElementById("deckNumber").value; // how many decks
    for(i=0; i<x; i++){
      for (var a = 0; a < suites.length; a++) {
          for (var b = 0; b < values.length; b++) {
              var newCard = new Card(suites[a], values[b]);
              deck.push(newCard);
            }
        }
      }
    deck = shuffle(deck);
    maxDeck = deck.length;
    cardsLeft.value = deck.length;
    return deck;
};

// render cards on the table
var renderHands = function(){
    var handCards = [];
    var ptotal = player.getScore();

    for (var i = 0; i < player.cardCount; i++)
    {
        handCards.push('<div class="card ' + player.hand[i].suite + '">' + player.hand[i].value + '<br>' +  player.hand[i].getSymbol() + '</div>');
    }

    pCards.innerHTML = handCards.join("");
    pHand.innerHTML = "Your Hand (" + ptotal + ")";

    if (dealer.cardCount == 0)
    {
        return;
    }

    // same for dealer
    var dealerCards = [];
    var dtotal = dealer.getScore();
    if (gameStatus === 0)
    {
        dHand.innerHTML = "Dealer's Hand (?? + " + dealer.hand[1].bjWeight() + ")";
        dealerCards.push('<div class="cardback"></div>');
        dealerCards.push('<div class="card ' + dealer.hand[1].suite + '">' + dealer.hand[1].value + '<br>' +  dealer.hand[1].getSymbol() + '</div>');
    }
    else
    {
        dHand.innerHTML = "Dealer's Hand (" + dtotal + ")";
    }

    // if dealer's turn
    if (gameStatus === 1){
        dealerCards.shift(); // removes the facedown card
    for (var i = 0; i < dealer.cardCount; i++) {
      dealerCards.push('<div class="card ' + dealer.hand[i].suite + '">' + dealer.hand[i].value + '<br>' +  dealer.hand[i].getSymbol() + '</div>');
    }
  }
  dCards.innerHTML = dealerCards.join("");
};

// Fisher-Yates shuffle
var shuffle = function(array){
  var m = array.length;
	var n = 0;
	var tmp = 0;

  while (m) {
    n = Math.floor(Math.random() * m--);
    tmp = array[m];
    array[m] = array[n];
    array[n] = tmp;
  }
  return array;
}

// Hit button pressed:
var hit = function () {
    // deal a card to the player and draw the hands
    player.drawCard();
    cardsLeft.value = deck.length;
    renderHands();

    var playerScore = player.getScore();

    if (playerScore > 21)
    {
        losing();
        return;
    }
    else if (playerScore === 21)
    {
        winning();
        return;
    }
    else if (player.cardCount > 4)
    {
        winning();
        return;
    }
    info.innerHTML = "Hit or stand?</p>";
    return;
}

// Stand button pressed:
var stand = function () {
    if (gameStatus === 2) // game over, disable standLoop
    {
        return;
    }
    else if (gameStatus === 0)
    {
        var dealerScore = dealer.getScore();
        gameStatus = 1; // enter the 'stand' loop
        info.innerHTML = "The dealer's turn";
        renderHands();
        setTimeout(stand, 800); // wait for 800ms and start stand() again
    }
    else if (gameStatus === 1) {

    var dealerScore = dealer.getScore();
    var playerScore = player.getScore();
    // If dealer has less than player, hit
    if (dealerScore >= playerScore && dealerScore <= 21) // dealer stands and game ends
    {
        renderHands();
        if (dealer.cardCount > 4)
        {
            losing();
            return;
        }
        else if (playerScore > dealerScore)
        {
            winning();
            return;
        }
        else if (playerScore < dealerScore)
        {
            losing();
            return;
        }
        else
        {
            tie();
            return;
        }
    }
    if (dealerScore > 21)
    {
        winning();
        return;
    }
    else // hit
    {
        info.innerHTML = "Dealer hits!";
        dealer.drawCard();
        cardsLeft.value = deck.length;
        renderHands();
        setTimeout(stand, 800);
        return;
    }
    }
}

var winning = function () {
    wins += 1;
    games += 1;
    var result = "";
    gameStatus = 2; // flag that the game is over
    var playerTotal = player.getScore();
    var dealerTotal = dealer.getScore();
    if (playerTotal === 21)
    {
        result = "Your hand's value is 21!";
    }
    else if (player.cardCount > 4){
      result = "Five cards hand!";
    }
    else if (dealerTotal > 21)
    {
        result = "Dealer busted with " + dealerTotal + "!";
    }
    else
    {
        result = "You had " + playerTotal + " and the dealer had " + dealerTotal + ".";
    }
    info.innerHTML = "You won!<br>" + result + "<br>Press 'Deal' to deal new hand or 'New Game' to start over.";
    updateStats();
}

var losing = function () {
    games += 1;
    losses += 1;
    var explanation = "";
    gameStatus = 2; // flag that the game is over
    var playerTotal = player.getScore();
    var dealerTotal = dealer.getScore();
    if (playerTotal > 21)
    {
        explanation = "You busted with " + playerTotal + ".";
    }
    if (dealer.cardCount > 4)
    {
        explanation = "Dealer had a 5-card hand!";
    }
    info.innerHTML = "You lost.<br>" + explanation + "<br>Press 'Deal' to deal new hand or 'New Game' to start over.";
    updateStats();
}

var tie = function () {
    games += 1;
    ties += 1;
    var explanation = "";
    gameStatus = 2; // flag that the game is over
    var playerScore = player.getScore();
    info.innerHTML = "It's a tie at " + playerScore + " .<br>Press 'Deal' to deal new hand or 'New Game' to start over.";
    updateStats();
}

// update the counters
var updateStats = function () {
    document.getElementById('gamesPlayed').value = games;
    document.getElementById('wins').value = wins;
    document.getElementById('ties').value = ties;
    document.getElementById('losses').value = losses;
    cardsLeft.value = deck.length;
    enableBtn("newGameBtn");
    enableBtn("dealBtn");
    disableBtn("hitBtn");
    disableBtn("standBtn");
}
