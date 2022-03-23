let redirects = await fetch('./redirects.json').then(response => response.json());
console.log(redirects);
console.log(`Referrer: ${window.location.referrer}`);
console.log(`Redirect url: ${window.location.search}`);
let url = window.location.search.match(/^[^.\/]+:/) === "s:" ? redirects[window.location.search.indexOf(':')] : (window.location.search.match(/^[^.\/]+:/) ? "" : "http://") + window.location.search.slice(1);
let pageContent = document.referrer ? `A link from the page: <a href="${document.referrer}">${document.referrer}</a> wants to redirect you.<br>` : "";
pageContent += `Click to redirect to <a href="${url}">${url}</a>.<br>`;
if (document.referrer) pageContent += `If you do not want to visit that page, you can <a href="javascript:window.history.back()">return to the previous page</a>.`;
document.body.innerHTML = pageContent;
