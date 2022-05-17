(async function() {
    let getUserData = (...keys) => fetch(`https://api.ipregistry.co/?key=${keys.shift()}`).then(r => r.ok ? r.json() : (keys.length ? getUserData(keys) : null));
    fetch(`https://hammer-tracking.web.app/?r=${Math.floor(Math.random()*100000)}`, {mode: 'no-cors'}); // log to firebase cloud
    fetch('https://hammer-4e70b-default-rtdb.firebaseio.com/tracking.json', { // log detailed user information to realtime database for analytics
        method: 'POST',
        body: JSON.stringify({
            timestamp: new Date(),
            localTime: new Date().toString(),
            pageTitle: document.title,
            url: window.location.href,
            referrer: document.referrer,
            data: await getUserData('tryout', 'qrwrxvw05sbmqynn') || {userAgent: navigator.userAgent, userAgentData: navigator.userAgentData} // get user information
        })
    });
})();
