// open/switch to rewards tab when icon is clicked
chrome.action.onClicked.addListener(async tab => {
    let domain = 'rewards.bing.com';
    
    // if we already have the page open in front of us, don't try to switch
    let urlRegex = new RegExp(`https?://${domain}/`);
    if (urlRegex.test(tab.url)) return;

    // try to find if the tab is already open in the active window and swap to it,
    // otherwise make a new tab
    [tab] = await chrome.tabs.query({url: `*://${domain}/*`, currentWindow: true});
    if (tab) chrome.tabs.update(tab.id, {active: true});
    else chrome.tabs.create({url: `https://${domain}`});
});

// display and receive updates for the point count as a badge
chrome.storage.local.get('points').then(({points}) => setBadgePoints(points));
chrome.storage.onChanged.addListener(({points}) => {
    if (points) {
        setBadgePoints(points.newValue);
    }
});

function setBadgePoints(points) {
    let text = points?.toString() ?? '';
    if (text.length >= 6) {
        // if it's too long to fit, represent it in thousands
        text = text.slice(0, -3) + 'k'; 
    }
    chrome.action.setBadgeText({text});
}

// respond to keyboard shortcut events
chrome.commands.onCommand.addListener(async command => {
    if (command === 'random-search') {
        // fetch a random word then open a new tab, or use the current tab
        // depending on the setting, and search it. The form parameter is required
        // to earn points (value doesn't matter but is normally ANNTA1)
        let {searchNewTab} = await chrome.storage.local.get('searchNewTab');
        fetch('https://random-word-api.herokuapp.com/word')
            .then(r => r.json())
            .catch(() => ['fallback']) // use 'fallback' if api is unavailable
            .then(wordArr => {
                let url = 'https://www.bing.com/search?FORM=ANNTA1&q=' + wordArr[0];
                if (searchNewTab) chrome.tabs.create({url});
                else chrome.tabs.update({url});
            });
    }
});

// check for updates on startup
chrome.runtime.onStartup.addListener(async () => {
    // check for updates when browser restarts if not disabled
    let {checkForUpdates} = await chrome.storage.local.get('checkForUpdates');
    if (!checkForUpdates) return;

    // fetch manifest from github
    const manifestUrl = 'https://raw.githubusercontent.com/Hammer-01/hammer-01.github.io/main/extensions/microsoft-rewards-helper/manifest.json';
    let newVersion = await fetch(manifestUrl)
        .then(r => r.json())
        .then(manifest => manifest.version);
    chrome.storage.local.set({newVersion});
});

chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason === 'install') {
        // setup default settings
        chrome.storage.local.set({
            searchNewTab: true,
            checkForUpdates: true,
            autoCompleteActivities: false,
            includePollInAutoComplete: true
        });

        // attempt to get point count from getuserinfo endpoint
        // add it to the storage so we have a badge straight away
        // todo: further research on the `type` parameter is required
        fetch('https://rewards.bing.com/api/getuserinfo?type=1')
            .then(r => r.json())
            .then(data => {
                let points = data.dashboard?.userStatus?.availablePoints;
                if (points) chrome.storage.local.set({points});
            });
    }
});