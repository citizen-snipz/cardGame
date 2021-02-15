//Get the deck
/*
1. Create a pile for p1 and p2
2. When a player wins, they get both cards added to their pile
3. If war were declared, draw 4 cards on each side and compare value of 4th card to determine victory

*/

//both piles derived from same deck, winning conditions for getCards() determines whose will get the all the played cards pushed into the respective array
let deckId = "";
let pile1 = [];
let pile2 = [];

//this function is called when the draw button is clicked and returns the data for the drawn card
async function drawFromPile(player) {
  const url = `https://deckofcardsapi.com/api/deck/${deckId}/pile/${player}/draw/`;
  const res = await fetch(url);
  const data = await res.json();
  return data.cards[0];
}

//This function is called in createDeck() to assign each player their own pile from the same deck
async function setPile(player, pile) {
  const url = `https://deckofcardsapi.com/api/deck/${deckId}/pile/${player}/add/?cards=${pile}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

//This function makes a pile for each player and maps an array of the card codes in each player's pile
async function makePile(numOfCards) {
  const res = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numOfCards}`
  );
  const data = await res.json();
  const pile = data.cards.map((card) => card.code).join(",");
  return pile;
}

//this function requests a single deck with a unique ID from the API. The starting piles are divided evenly amongst 2 players and assigned to their name
async function createDeck() {
  const res = await fetch(
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
  );
  const data = await res.json(); // parse response as JSON

  deckId = data.deck_id;
  const startingPile1 = await makePile(26);
  const startingPile2 = await makePile(26);
  await setPile("player1", startingPile1);
  await setPile("player2", startingPile2);
}

document.querySelector("button").addEventListener("click", getCards);

//This function compares the draws from P1 and P2 to determine the victor. The card with the highest value gets all cards played in that round pushed to its pile array to be reused when the piles run out of cards
async function getCards() {
  let draw1 = await drawFromPile("player1");
  let draw2 = await drawFromPile("player2");

  document.querySelector("#playerOne").src = draw1.image;
  document.querySelector("#playerTwo").src = draw2.image;
  const val1 = cardValue(draw1.value);
  const val2 = cardValue(draw2.value);
  if (val1 > val2) {
    pile1.push(draw1.code, draw2.code);
    document.querySelector("h3").innerHTML = `Player 1 wins!`;
  } else if (val1 < val2) {
    pile2.push(draw1.code, draw2.code);
    document.querySelector("h3").innerHTML = `Player 2 wins!`;
  } else {
    document.querySelector("h3").innerHTML = `WAR WERE DECLARED!`;
  }
  /* redefine each individual pile if remaining cards === 0 */
}

function cardValue(val) {
  if (val === "ACE") {
    return 14;
  } else if (val === "KING") {
    return 13;
  } else if (val === "QUEEN") {
    return 12;
  } else if (val === "JACK") {
    return 11;
  } else {
    return +val;
  }
}

createDeck();
