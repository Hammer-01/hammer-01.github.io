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

fetch("https://api.paste.ee/v1/pastes?sections='[{\"name\":\"Section1\",\"contents\":\"Testing!\"}]'", { // '{"description":"test","sections":[{"name":"Section1","syntax":"autodetect","contents":"Testing!"}]}'
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': 'aXdc0szX7bxV4d6gT8dsaw3ZEqFNEQbcQ53s4KXdX'
    },
    body: '{"sections":[{"name":"Section1","contents":"Testing!"}]}'
})
    .then(response => response.text())
    .then(text => console.log(text))
