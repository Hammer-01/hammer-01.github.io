redirects = {
    "n": "https://youtube.com/watch?v=dQw4w9WgXcQ",
    
    /* Bookmarklets */
    "WallZapper": "javascript:(function(){var r = function(elem){while (elem.length){elem[0].remove();}}; switch (window.location.hostname) { case \"www.quora.com\": var subWallDiv = document.getElementsByClassName('qu-zIndex--blocking_wall'); r(subWallDiv); var mainPage=document.querySelector('div.qu-overflow--hidden[style*=\"filter\"]'); mainPage.style.filter = ''; mainPage.classList.remove('qu-overflow--hidden'); /*Adblock*/var ads = document.querySelectorAll(\".ad\"); for (a in ads){ads[a].parentElement.parentElement.remove();} break; case \"www.forbes.com\": r(document.getElementsByClassName('tp-modal')); r(document.getElementsByClassName('tp-backdrop')); document.body.classList.remove('tp-modal-open'); break; case \"www.technologyreview.com\": document.getElementsByClassName('body__pinnedScrollPaywall--2gf0u')[0].classList.remove('body__pinnedScrollPaywall--2gf0u'); break; case \"www.citethisforme.com\": document.querySelector('[data-reactroot]').remove(); break; default: alert(\"Zapper not available for this site yet\");}})()",
}
