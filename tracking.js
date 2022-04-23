(async function() {
    fetch('https://hammer-tracking.web.app', {mode: 'no-cors'}); // log to firebase cloud
    fetch('https://hammer-4e70b-default-rtdb.firebaseio.com/tracking.json', { // log detailed user information to realtime database for analytics
        method: 'POST',
        body: JSON.stringify({
            timestamp: new Date(),
            data: await fetch('https://api.ipregistry.co/?key=tryout').then(r => r.json()) // get user information
        })
    })
})()
