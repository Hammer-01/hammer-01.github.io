// TODO: 
//   Add window.location.href = [redirecturl] after a few seconds, to automatically redirect. 
//   Add bookmarklet special case (protocol == javascript:)
console.log(`Referrer: ${window.location.referrer}`);
console.log(`Redirect url: ${window.location.search}`);
let search = window.location.search.slice(1);
let protocol = search.match(/^(\w+:|\/\/)/g);
let dispUrl = protocol == "_:" ? search.slice(2) : search;
let url = protocol == "_:" ? redirects[dispUrl] : (protocol ? "" : "//") + dispUrl;
let pageContent = document.referrer ? `A link from the page: <a href="${document.referrer}">${document.referrer}</a> wants to redirect you.<br>` : "";
pageContent += `Click to redirect to <a href="${url}">${dispUrl}</a>.<br>`;
if (document.referrer) pageContent += `If you do not want to visit that page, you can <a href="javascript:window.history.back()">return to the previous page</a>.<br>`;
pageContent += `You will be automatically redirected in <span id="countdown">5</span> seconds.`
document.body.innerHTML = pageContent;
setInterval((num) => {
    num.textContent = num.textContent - 1;
    if (num.textContent === '0') window.location.href = url;
}, 1000, document.getElementById('countdown'));
