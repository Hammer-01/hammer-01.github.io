// TODO: Add bookmarklet special case (protocol == javascript:)
console.log(`Referrer: ${window.location.referrer}`);
console.log(`Redirect url: ${window.location.search}`);
let search = window.location.search.slice(1);
let protocol = search.match(/^(\w+:|\/\/)/g);
let dispUrl = protocol == "_:" ? search.slice(2) : search;
let url = protocol == "_:" ? redirects[dispUrl] : (protocol ? "" : "//") + dispUrl;
let pageContent = document.referrer ? `A link from the page: <a href="${document.referrer}">${document.referrer}</a> wants to redirect you.<br>` : "";
pageContent += `Click to redirect to <a href="${url}">${dispUrl}</a>.<br>`;
if (document.referrer) pageContent += `If you do not want to visit that page, you can <a href="javascript:window.history.back()">return to the previous page</a>.`;
document.body.innerHTML = pageContent;
