let points = '-1'; // placeholder value

// update the points badge
const pointsObserver = new MutationObserver(changes => {
    changes.forEach(c => c.addedNodes.forEach(n => {
        // convert the points value to a number
        let newPoints = +n.data.replace(',', '');
        // only update the score if the point count actually changes, otherwise
        // we would unnecessarily be trying to update hundreds of times
        if (newPoints !== points) {
            points = newPoints;
            chrome.storage.local.set({points});
        }
    }));
});
pointsObserver.observe(document.querySelector('mee-rewards-user-status-banner-balance mee-rewards-counter-animation > span'), {childList: true});