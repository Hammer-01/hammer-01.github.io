// Fix weird rendering bug on mobile
window.onload = () => document.body.innerHTML = document.body.innerHTML;

fetch("https://api.github.com/users/hammer-01/repos", {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
})
    .then(response => response.json())
    .then(json => {
        let pages = [];
        for (let repo of json) {
            if (repo.has_pages && repo.name !== window.location.hostname) pages.push(repo);
        }
        return pages;
    })
    .then(pages => {
        let pageList = document.getElementById("pageList");
        for (let page of pages) {
            fetch(window.location.href + page.name)
                .then(response => response.text())
                .then(data => data.match(/<title>(.+)<\/title>/)[1])
                .then(title => {
                    let listValue = `<p><a href="${page.name}">${title}</a>`;
                    if (page.description) listValue += ` - ${page.description}`;
                    pageList.innerHTML += listValue + '</p>';
                });
        }
    });
