// wrap in iife to prevent polluting global scope
(() => {

// get the includePoll setting from the data-include-poll attribute
const includePoll = document.currentScript.dataset.hasOwnProperty('includePoll');
let autoClickedURL;

// jobs - already works
// shopping - already works
// news - already works
// flight - seems to work (somewhat inconsistent)
// add any search types that don't work here
let bingExploreSearches = {};

// proxy window.open so we don't spam open a bunch of tabs when autocompleting
window.open = new Proxy(window.open, {
    apply: (target, thisArg, args) => {
        if (autoClickedURL === args[0]) {
            autoClickedURL = undefined;
            return;
        }
        return Reflect.apply(target, thisArg, args);
    }
});

// try to click on the cards 10 times
let numTries = 0;
let id = setInterval(() => {
    if (!window.dashboard) return;

    // click on all the `urlreward` cards which just require a click to earn points
    let dailySetKey = (new Date).toLocaleDateString('en-US', {day: '2-digit', month: '2-digit', year: 'numeric'});
    let clicks = clickValidCards(dashboard.dailySetPromotions[dailySetKey]);
    clicks += clickValidCards(dashboard.morePromotions);

    // make the info on the page update
    document.dispatchEvent(new Event('visibilitychange'));

    // stop trying if we've run out of attempts or we've clicked everything
    if (++numTries > 10 || clicks === 0) clearInterval(id);
}, 250);

function clickValidCards(cards) {
    let cardsClicked = 0;
    cards.forEach(c => {
        let cardItem = document.querySelector(`[data-bi-id=${c.name}] > a`);
        if (!cardItem) return;

        // todo(future): currently the attributes.isExploreOnBingTask is only set on tasks
        // where you you need to do a search (i.e. just clicking it won't give points)
        // and is set to a value of 'True' (i.e. a string not a bool). If this is also set
        // on regular urlreward cards with a value of 'False' then this will break and need
        // to be replaced by `c.attributes.isExploreOnBingTask === 'True'` but if this
        // property gets turned into a regular bool then this will continue to work
        if (c.attributes.isExploreOnBingTask) {
            cardItem.addEventListener('click', e => {
                // prevent the original link from opening
                e.stopPropagation();
                e.preventDefault();

                // open a search that will (hopefully) meet the task completion requirements
                let type = c.name.match(/_moreactivities_task\d+_(.+?)_exploreonbing/)[1];
                window.open('https://www.bing.com/search?form=ANNTA1&q=' + (bingExploreSearches[type] ?? type));
            }, true);
        } else if (!c.complete && c.pointProgressMax > 0 && c.promotionType === 'urlreward' && c.attributes.is_unlocked !== 'False' && (includePoll || c.title !== 'Daily poll')) {
            // urlrewards (only a click is need) - could use c.exclusiveLockedFeatureStatus === 'locked' instead of c.attributes.is_unlocked !== 'False'
            autoClickedURL = c.destinationUrl;
            cardItem.click();
            cardsClicked++;
        }
    });
    return cardsClicked;
}

})();