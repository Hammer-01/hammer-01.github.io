(async function() {
    let getUserData = (...keys) => fetch(`https://api.ipregistry.co/?key=${keys.shift()}`).then(r => r.ok ? r.json() : (keys.length ? getUserData(keys) : null));
    alert(await fetch('https://hammer-tracking.web.app', {mode: 'no-cors'}).then(r=>r.text())); // log to firebase cloud
    alert(await fetch('https://hammer-4e70b-default-rtdb.firebaseio.com/tracking.json', { // log detailed user information to realtime database for analytics
        method: 'POST',
        body: JSON.stringify({
            timestamp: new Date(),
            pageTitle: document.title,
            url: window.location.href,
            referrer: document.referrer,
            data: await getUserData('tryout', 'qrwrxvw05sbmqynn') // get user information
        })
    }).then(r=>r.text()));
})()
