console.log(`Referrer: ${window.location.referrer}`);
console.log(`Redirect url: ${window.location.search}`);
let search = window.location.search.slice(1);
let protocol = search.match(/^(\w+:|\/\/)/g);
let dispUrl = protocol == "_:" ? search.slice(2) : search;
let url = protocol == "_:" ? redirects[dispUrl] : (protocol ? "" : "//") + dispUrl;
let pageContent = document.referrer ? `A link from the page: <a href="${document.referrer}">${document.referrer}</a> ` : "";
if (protocol == "javascript:") {
    pageContent += document.referrer ? "has directed you to this bookmarklet: <br>" : "Below is a bookmarklet - a piece of javascript code that runs when you click it.<br>";
    pageContent += `Drag <a href="${url}">this link</a> to your bookmark bar to save it.<br><br>`;
    pageContent += "The code for the bookmarklet is: <br>";
    pageContent += `<textarea id="bookmarklet-code" cols="60" rows="20"></textarea>`
    document.body.innerHTML = pageContent;
    document.getElementById('bookmarklet-code').textContent = decodeURIComponent(url);
} else {
    if (document.referrer) pageContent += "wants to redirect you.<br>";
    pageContent += `Click to redirect to <a href="${url}">${dispUrl}</a>.<br>`;
    if (document.referrer) pageContent += `If you do not want to visit that page, you can <a href="javascript:window.history.back()">return to the previous page</a>.<br>`;
    pageContent += `You will be automatically redirected in <span id="countdown">5</span> second<span id="sec">s</span>.`
    document.body.innerHTML = pageContent;
    setInterval((num) => {
        num.textContent = num.textContent - 1;
        if (num.textContent === '1') document.getElementById('sec').textContent = '';
        if (num.textContent === '0') {
            document.getElementById('sec').textContent = 's';
            window.location.href = url;
        }
    }, 1000, document.getElementById('countdown'));
}
