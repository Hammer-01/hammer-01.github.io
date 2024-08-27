// wrap in async function to use top level await
(async () => {
// check to see if a new version is available
let {newVersion} = await chrome.storage.local.get('newVersion');
if (newVersion) {
    // delete the value so update notice doesn't appear in other tabs
    chrome.storage.local.remove('newVersion');

    let currentVersion = chrome.runtime.getManifest().version;
    if (currentVersion !== newVersion) {
        // get the update message
        let commitData = await fetch('https://api.github.com/repos/Hammer-01/hammer-01.github.io/commits?path=extensions/microsoft-rewards-helper/manifest.json&per_page=1')
            .then(r => r.json());
        let commitMessage = commitData[0].commit.message.split('\n\n')[1]; // only get the description
        if (/[^.?!]$/.test(commitMessage)) commitMessage += '.'; // add a fullstop if there is no ending punctuation
        let updateMessage = commitMessage ? '<br>Update info: ' + commitMessage : '';
        // navigator.platform fallback only required if this is ported to a non-chromium browser (e.g. Firefox doesn't implement userAgentData)
        let isWin = navigator.userAgentData?.platform === 'Windows' || navigator.platform === 'Win32';

        // create the notice for the update
        let updateNotice = document.createElement('div');
        updateNotice.id = 'extensionUpdateNotice';
        updateNotice.innerHTML = `<h2 class="c-heading-4">Extension Update Available!</h2>
        <p>The Microsoft Rewards Helper extension has a new update (version ${currentVersion} -> ${newVersion}).<br>
        To update, ${isWin?'run the file <kbd>updater.bat</kbd> which can be found in the folder where the extension is located. Alternatively, ':''}
        <a href="https://hammer-01.github.io/extensions/#microsoft-rewards-helper" target="_blank">click here</a> 
        and follow the installation instructions${isWin?' to update manually':''}.<br>
        <strong>${isWin?'If installing manually, make':'Make'} sure you delete the previous extension folder before installing the new version.</strong>
        <em>${updateMessage}</em></p>
        <p><a id="extensionHideNoticeLink" href="#">Remind me later</a><b> · </b>
        <a id="extensionNoUpdateLink" href="#">Don't show this again</a></p>`;
        
        // add the notice to the page when banner element is available
        let id = setInterval(() => {
            let elm = document.querySelector('#meeGradientBanner > div');
            if (elm) {
                clearInterval(id);
                elm.appendChild(updateNotice);
                document.getElementById('extensionNoUpdateLink').onclick = () => {
                    // hide the notice and set the checkForUpdates flag
                    updateNotice.hidden = true;
                    chrome.storage.local.set({checkForUpdates: false});
                };
                document.getElementById('extensionHideNoticeLink').onclick = () => {
                    updateNotice.hidden = true;
                };
            }
        }, 50);
    }
}
})();