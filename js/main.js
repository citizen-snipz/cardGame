//Get the deck
/*
1. Create a pile for p1 and p2
2. When a player wins, they get both cards added to their pile
3. If war were declared, draw 4 cards on each side and compare value of 4th card to determine victory

*/

//both piles derived from same deck, winning conditions for getCards() determines whose will get the all the played cards pushed into the respective array
const deck = {
  id: "",
  player1: [],
  player2: []
};
let count = 0;

async function getFetch(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err.message + ": Your fetch done messed up");
  }
}

//this function is called when the draw button is clicked and returns the data for the drawn card
async function drawFromPile(player, num = 1) {
  const url = `https://deckofcardsapi.com/api/deck/${deck.id}/pile/${player}/draw/?count=${num}`;
  const data = await getFetch(url);
  const playerPile = player === "player1" ? deck.player1 : deck.player2;
  console.log((count += 1));
  if (+data.piles[player].remaining === 0) await setPile(player, playerPile);

  return data.cards;
}

//This function is called to assign each player their own pile
async function setPile(player, pile) {
  const url = `https://deckofcardsapi.com/api/deck/${
    deck.id
  }/pile/${player}/add/?cards=${pile.join(",")}`;
  const data = await getFetch(url);
  return data;
}

//This function makes a pile for each player and maps an array of the card codes in each player's pile
async function makePile(numOfCards) {
  const data = await getFetch(
    `https://deckofcardsapi.com/api/deck/${deck.id}/draw/?count=${numOfCards}`
  );
  const pile = data.cards.map((card) => card.code);
  return pile;
}

//this function requests a single deck with a unique ID from the API. The starting piles are divided evenly amongst 2 players and assigned to their name
async function createDeck() {
  const data = await getFetch(
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
  );

  deck.id = data.deck_id;
  const startingPile1 = await makePile(26);
  const startingPile2 = await makePile(26);
  await setPile("player1", startingPile1);
  await setPile("player2", startingPile2);
}

document.querySelector("button").addEventListener("click", () => getCards());

//This function compares the draws from P1 and P2 to determine the victor. The card with the highest value gets all cards played in that round pushed to its pile array to be reused when the piles run out of cards
async function getCards(cards = []) {
  console.log(cards);
  let [{ image: image1, value: value1, code: code1 }] = await drawFromPile(
    "player1"
  );
  let [{ image: image2, value: value2, code: code2 }] = await drawFromPile(
    "player2"
  );

  document.querySelector("#playerOne").src = image1;
  document.querySelector("#playerTwo").src = image2;
  const val1 = cardValue(value1);
  const val2 = cardValue(value2);
  if (val1 > val2) {
    deck.player1.push(code1, code2, ...cards);
    document.querySelector("h3").innerHTML = `Player 1 wins!`;
  } else if (val1 < val2) {
    deck.player2.push(code1, code2, ...cards);
    document.querySelector("h3").innerHTML = `Player 2 wins!`;
  } else {
    document.querySelector("h3").innerHTML = `WAR WERE DECLARED!`;
    declareWar([...cards, code1, code2]);
  }
}

async function declareWar(cards) {
  /**
  1. draw 4 cards from each players deck
  2. winner determined by value of 4th card
  3. winner gets all cards pushed into their pile array
   */
  const drawnCards = await Promise.all([
    drawFromPile("player1", 3),
    drawFromPile("player2", 3)
  ]);
  const warPot = [...drawnCards].flat().map((card) => card.code);
  getCards([...warPot, ...cards]);
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

async function testCycle(num) {
  for (let i = 0; i < num; i++) {
    await getCards();
  }
}
