let settingsList = ['checkForUpdates', 'searchNewTab', 'autoCompleteActivities', 'includePollInAutoComplete'];
settingsList.forEach(async s => {
    let checkbox = document.getElementById(s);
    checkbox.checked = (await chrome.storage.local.get(s))[s];
    checkbox.addEventListener('change', () => chrome.storage.local.set({[s]: checkbox.checked}));
});