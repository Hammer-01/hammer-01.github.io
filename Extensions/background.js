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