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
        for (let page of pages) {
            console.log('Fetching ' + window.location.href + "/" + page.name + '...');
            fetch(window.location.href + "/" + page.name)
                .then(response => response.text())
                .then(data => data.match(/<title>(.+)<\/title>/))
                .then(title => console.log(title));
        }
    });
