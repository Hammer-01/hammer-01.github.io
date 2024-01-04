// wrap in async function to use top level await
(async () => {
// check to see if a new version is available
let {newVersion} = await chrome.storage.local.get('newVersion');
if (newVersion) {
    // delete the value so update notice doesn't appear in other tabs
    chrome.storage.local.remove('newVersion');

    let currentVersion = chrome.runtime.getManifest().version;
    if (currentVersion !== newVersion) {
        // create the notice for the update
        let updateNotice = document.createElement('div');
        updateNotice.id = 'extensionUpdateNotice';
        updateNotice.innerHTML = `<h2 class="c-heading-4">Extension Update Available!</h2>
        <p>The Microsoft Rewards Helper extension has a new update (version ${currentVersion} -> ${newVersion}). 
        To update, <a href="https://hammer-01.github.io/extensions/#microsoft-rewards-helper" target="_blank">click here</a> 
        and follow the installation intructions. 
        <strong>Make sure you delete the previous extension folder before installing the new version.</strong></p>
        <p><a id="extensionHideNoticeLink" href="#">Remind me later</a><b> · </b>
        <a id="extensionNoUpdateLink" href="#">Don't show this again</a></p>`;
        
        // add the notice to the page
        let elm = document.querySelector('#meeGradientBanner > div');
        elm.appendChild(updateNotice);
        document.getElementById('extensionNoUpdateLink').onclick = () => {
            // hide the notice and set the noUpdate flag
            updateNotice.hidden = true;
            chrome.storage.local.set({noUpdate: true});
        };
        document.getElementById('extensionHideNoticeLink').onclick = () => {
            updateNotice.hidden = true;
        };
    }
}
})();