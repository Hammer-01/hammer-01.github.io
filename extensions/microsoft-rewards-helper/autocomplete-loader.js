// todo: add other options (i.e. quiz autocompletion)
chrome.storage.local.get(['autoCompleteActivities', 'includePollInAutoComplete'])
    .then(({autoCompleteActivities, includePollInAutoComplete}) => {
        if (!autoCompleteActivities) return;

        let s = document.createElement('script');
        s.src = chrome.runtime.getURL('autocomplete.js');
        if (includePollInAutoComplete) s.dataset.includePoll = '';
        s.onload = s.remove;
        document.head.appendChild(s);
    });