console.log(`Referrer: ${window.location.referrer}`);
console.log(`Redirect url: ${window.location.search}`);
let url = window.location.search.match(/^[^.\/]+:/)[0] === "?s:" ? redirects[window.location.search.slice(3)] : (window.location.search.match(/^[^.\/]+:/) ? "" : "http://") + window.location.search.slice(1);
//let url = new URL(window.location.search.slice(1), 'http://_');
//if (url.protocol === "re:") url = new URL(redirects[window.location.search.slice(4)]);
let pageContent = document.referrer ? `A link from the page: <a href="${document.referrer}">${document.referrer}</a> wants to redirect you.<br>` : "";
pageContent += `Click to redirect to <a href="${url}">${url}</a>.<br>`;
if (document.referrer) pageContent += `If you do not want to visit that page, you can <a href="javascript:window.history.back()">return to the previous page</a>.`;
document.body.innerHTML = pageContent;
