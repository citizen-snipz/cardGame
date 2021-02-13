//Get the deck
/*
1. Create a pile for p1 and p2
2. When a player wins, they get both cards added to their pile
3. If war were declared, draw 4 cards on each side and compare value of 4th card to determine victory

*/

let deckId = "";

function getPile(player) {
  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=26`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const p1Pile = data.cards.map((card) => card.code).join(",");
      const urlP1 = `https://deckofcardsapi.com/api/deck/${deckId}/pile/playerOne/add/?cards=${p1Pile}`;
      return fetch(urlP1);
    })
    .then((res) => res.json())
    .then((data) => {});
}

fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
  .then((res) => res.json()) // parse response as JSON
  .then((data) => {
    console.log(data);
    deckId = data.deck_id;
  })

  // .then((id) => {

  //   const urlP2 = `https://deckofcardsapi.com/api/deck/${id}/pile/playerTwo/add/?cards=AS,2S`;

  // })
  .catch((err) => {
    console.log(`error ${err}`);
  });

document.querySelector("button").addEventListener("click", getCards);

function getCards() {
  const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let val1 = cardValue(data.cards[0].value);
      let val2 = cardValue(data.cards[1].value);
      document.querySelector("#playerOne").src = data.cards[0].image;
      document.querySelector("#playerTwo").src = data.cards[1].image;
      if (val1 > val2) {
        document.querySelector("h3").innerHTML = `Player 1 wins!`;
      } else if (val1 < val2) {
        document.querySelector("h3").innerHTML = `Player 2 wins!`;
      } else {
        document.querySelector("h3").innerHTML = `WAR WERE DECLARED!`;
      }
    })
    .catch((err) => {
      console.log(`error: ${err}`);
    });
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
