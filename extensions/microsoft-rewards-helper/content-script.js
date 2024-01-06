console.log('Hello from microsoft rewards extension!');

let points = '-1'; // placeholder value
let params = new URLSearchParams(location.search);
params.delete('q'); // avoid false positives when searching the params

// make sure we are actually on a search, e.g. not at /search/somethingelse
// which the content script will still be injected into
if (location.pathname === '/search') {
    if (quizTypeIs('MicrosoftRewardsQuizCB') || quizTypeIs('Bonus')) { // bonus quiz, several correct options per question
        // click as many as possible before reload
        clickElement('[iscorrectoption=True]:not(.btsel)');
    }

    else if (quizTypeIs('MicrosoftRewardsQuizDS')) { // lightspeed/supersonic quiz, one correct option per question
        // just click all of them until one is right
        clickElement('.rqOption:not(.optionDisable)');
    }
    
    else if (quizTypeIs('ThisOrThat') || quizTypeIs('ThisorThat')) {
        // get the question information
        let questionElm = document.querySelector(".bt_queText");
        let [opt1, opt2] = [...document.querySelectorAll(".btOptionText")].map(x => x.textContent);
        
        // preemptively add iframes or iframe wrappers in preparation
        // for the characteristic input
        let leftFrame = document.createElement('iframe');
        let rightFrame = document.createElement('iframe');
        let panel = document.querySelector('.TriviaOverlayData');
        panel.before(leftFrame);
        panel.after(rightFrame);
        leftFrame.style = rightFrame.style = 'position: absolute; bottom: 0; height: 100%';
        rightFrame.style.right = 0;

        // update the url of the iframes if the characteristic changes
        // and store the new value
        let updateCharacteristic = characteristic => {
            // include the extensionhintiframe parameter to trigger the css which
            // hides the popup that gets in the way and the padding that goes
            // before the useful results on a page. The FORM parameter is also
            // included to allow the collection pf points for doing searches
            // (see the 'random-search' command in background.js for more info)
            let searchUrl = 'https://www.bing.com/search?extensionhintiframe=&FORM=ANNTA1&q=';
            leftFrame.src = `${searchUrl}${opt1}+${characteristic}`;
            rightFrame.src = `${searchUrl}${opt2}+${characteristic}`;
            sessionStorage.setItem('extensioncharacteristic', characteristic);
        }
        
        let styleElm = document.createElement('style');
        // move the position of the 'OR' down to make room for the input box
        styleElm.textContent = '.bt_optionVS {bottom: 32px !important}';
        // hide the iframes when the quiz is finished
        styleElm.textContent += ':has(> #quizCompleteContainer) + iframe, iframe:has(+ div > #quizCompleteContainer) {display: none}';
        document.head.appendChild(styleElm);
        
        // add the characteristic input box
        let characteristicInput = document.createElement('input');
        characteristicInput.placeholder = 'Enter characteristic';
        characteristicInput.onkeydown = ({key}) => {
            if (key === 'Enter') updateCharacteristic(characteristicInput.value);
        };
        if (sessionStorage.getItem('extensioncharacteristic')) {
            let storedCharacteristic = sessionStorage.getItem('extensioncharacteristic')
            updateCharacteristic(storedCharacteristic);
            characteristicInput.value = storedCharacteristic;
        }
        questionElm.after(characteristicInput);
        // avoid issue where start playing button is blocked by the left iframe
        clickElement('#rqStartQuiz', {
            // stop when hidden or if on a later (not first) page of the quiz
            // where there is no button at all
            conditionFn: () => document.querySelector('.b_hide > span > #rqStartQuiz') ||
                               parseInt(document.querySelector('.rqMCredits')?.textContent) > 0
        });
    }

    // update the points badge
    const pointsObserver = new MutationObserver(updatePoints);
    pointsObserver.observe(document.getElementById('id_rc'), {childList: true});
}

function quizTypeIs(quizType) {
    let paramsString = params.toString();
    // Remove inconsistent country code (e.g. EN_AU/ENAU) and day-dependent pre-bonus text
    paramsString = paramsString.replaceAll(/_[A-Z]{2}_?[A-Z]{2}_(.*(?=Bonus))*/g, '');
    
    return paramsString.includes('REWARDSQUIZ' + quizType);
}

function clickElement(selector, opts) {
    let id = setInterval(() => {
        let elm = document.querySelector(selector);
        if (elm && opts?.stopOnClick) clearInterval(id);
        elm?.click();
        if (opts?.conditionFn?.()) clearInterval(id);
    }, 50);
}

function updatePoints(changes) {
    changes.forEach(c => c.addedNodes.forEach(n => {
        // only update the score if the point count actually changes, otherwise
        // we would unnecessarily be trying to update hundreds of times
        if (n.data !== points) {
            points = n.data;
            chrome.storage.local.set({points});
        }
    }));
}

// Example quiz urls
// https://www.bing.com/search?q=Chile&filters=BTQI%3A%220%22+BTCI%3A%221%22+ShowTimesTaskPaneTrigger%3A%22false%22&skipopalnative=true&rnoreward=1&FORM=ML151V&BTCA=0&BTSPC=0&BTC_BTCQC=0&BTC_BTQID=REWARDSQUIZ_ENAU_MicrosoftRewardsQuizCB_20231205&BTC_BTOID=Gamification_DailySet_ENAU_20231205_Child2&BTC_RA=quiz&BTC_BTEC=0&BTC_BTMC=30&BTC_BTQN=1&BTC_BTCO=2&BTC_BTRACI=1&BTC_BTIOM=0
// https://www.bing.com/search?q=Asia%20continent&rnoreward=1&mkt=EN-AU&FORM=ML12JG&skipopalnative=true&rqpiodemo=1&filters=BTEPOKey:%22REWARDSQUIZ_EN_AU_ThisorThat_Asia_Area_20231204%22%20BTROID:%22Gamification_DailySet_ENAU_20231204_Child2%22%20BTROEC:%220%22%20BTROMC:%2250%22%20BTROQN:%220%22
// https://www.bing.com/search?q=List%20of%20animals&rnoreward=1&mkt=EN-AU&FORM=ML12JG&skipopalnative=true&rqpiodemo=1&filters=BTEPOKey:%22REWARDSQUIZ_ENAU_ThursdayBonus_20231207%22%20BTROID:%22Gamification_DailySet_ENAU_20231207_Child2%22%20BTROEC:%220%22%20BTROMC:%2230%22