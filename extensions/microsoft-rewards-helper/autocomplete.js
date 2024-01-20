// get the includePoll setting from the data-include-poll attribute
let includePoll = document.currentScript.dataset.hasOwnProperty('includePoll');

// try to click on the cards 10 times
let numTries = 0;
let id = setInterval(() => {
    // click on all the `urlreward` cards which just require a click to earn points
    let clicks = clickValidCards(Object.values(dashboard.dailySetPromotions)[0]);
    clicks += clickValidCards(dashboard.morePromotions);

    // make the info on the page update
    document.dispatchEvent(new Event('visibilitychange'));

    // stop trying if we've run out of attempts or we've clicked everything
    if (++numTries > 10 || clicks === 0) clearInterval(id);
}, 250);

function clickValidCards(cards) {
    let cardsClicked = 0;
    cards.forEach(c => {
        // urlrewards (only a click is need)
        if (!c.complete && c.pointProgressMax > 0 && c.promotionType === 'urlreward' && (includePoll || c.title !== 'Daily poll')) {
            let cardItem = document.querySelector(`[data-bi-id=${c.name}]`);
            cardItem.firstElementChild.click();
            cardsClicked++;
        }
    });
    return cardsClicked;
}