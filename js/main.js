//Get the deck
/*
1. Create a pile for p1 and p2
2. When a player wins, they get both cards added to their pile
3. If war were declared, draw 4 cards on each side and compare value of 4th card to determine victory

*/

//both piles derived from same deck, winning conditions for getCards() determines whose will get the all the played cards pushed into the respective array
const deck = {
  id: "",
  pile1: [],
  pile2: []
};

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
async function drawFromPile(player) {
  const url = `https://deckofcardsapi.com/api/deck/${deck.id}/pile/${player}/draw/`;
  const data = await getFetch(url);
  const playerPile = player === "player1" ? deck.pile1 : deck.pile2;
  console.log(data);
  if (+data.piles[player].remaining === 0) await setPile(player, playerPile);

  return data.cards[0];
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

document.querySelector("button").addEventListener("click", getCards);

//This function compares the draws from P1 and P2 to determine the victor. The card with the highest value gets all cards played in that round pushed to its pile array to be reused when the piles run out of cards
async function getCards(cards) {
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
  if (!cards) cards = [];
  if (val1 > val2) {
    piles["player1"].push(code1, code2, ...[]);
    document.querySelector("h3").innerHTML = `Player 1 wins!`;
  } else if (val1 < val2) {
    piles["player2"].push(code1, code2, ...[]);
    document.querySelector("h3").innerHTML = `Player 2 wins!`;
  } else {
    document.querySelector("h3").innerHTML = `WAR WERE DECLARED!`;
    declareWar([code1, code2, ...cards]);
  }
}

async function declareWar(cards) {
  /**
  1. draw 4 cards from each players deck
  2. winner determined by value of 4th card
  3. winner gets all cards pushed into their pile array
   */
  await drawFromPile("player1", 4);
  await drawFromPile("player2", 4);
  let warVal1 = cardValue("player1");
  let warVal2 = cardValue("player2");
  if (warVal1[3] > warVal2[3]) {
    piles["player1"].push(...warVal1, ...warVal2);
    document.querySelector("h3").innerHTML = `Player 1 has won this war!`;
  } else if (warVal1[3] < warVal2[3]) {
    piles["player2"].push(...warVal1, ...warVal2);
    document.querySelector("h3").innerHTML = `Player 2 has won this war!`;
  }
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
