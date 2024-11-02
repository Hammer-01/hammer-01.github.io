(async function() {
    let fetchUserData = keys => fetch(`https://api.ipregistry.co/?key=${keys.shift()}`).then(r => r.ok ? r.json() : (keys.length ? fetchUserData(keys) : null));
    let retrieveUserData = async (...keys) => { //
        let ip = await fetch('https://icanhazip.com').then(r => r.text()).catch(() => fetch('https://api.ipify.org').then(r => r.text()).catch(() => fetch('http://ip-api.com/csv/?fields=query', {referrerPolicy: 'no-referrer'}).then(r => r.text())));
        let userData;
        try {
            userData = JSON.parse(localStorage.getItem('hammer-tracking-'+ip));
        } catch {}
        let cacheTime = new Date(userData?.time_zone?.current_time || 0).getTime();
        if (!userData || cacheTime > Date.now() || cacheTime < Date.now() - 6.048e8) { // use cache only if it exists and is less than 7 days old
            userData = await fetchUserData(keys) || {userAgent: navigator.userAgent, userAgentData: navigator.userAgentData};
            localStorage.setItem('hammer-tracking-'+ip, JSON.stringify(userData));
        }
        return userData;
    };
    fetch(`https://hammer-tracking.web.app/?d=${Date.now()}`, {mode: 'no-cors'}); // log to firebase cloud
    fetch('https://hammer-4e70b-default-rtdb.firebaseio.com/tracking.json', { // log detailed user information to realtime database for analytics
        method: 'POST',
        body: JSON.stringify({
            timestamp: new Date(),
            localTime: new Date().toString(),
            pageTitle: document.title,
            url: window.location.href,
            referrer: document.referrer,
            data: await retrieveUserData('tryout', 'qrwrxvw05sbmqynn')
        })
    });
})();
