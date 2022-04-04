let repoPages = fetch("https://api.github.com/users/hammer-01/repos", {
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
    });

window.onload = () => {
    let pageList = document.getElementById("pageList");
    let numListItems = pageList.childElementCount;
    repoPages.then(pages => {
        for (let page of pages) {
            fetch(window.location.href + page.name)
                .then(response => response.text())
                .then(data => data.match(/<title>(.+)<\/title>/)[1])
                .then(title => {
                    let listValue = `<p><a href="${page.name}">${title}</a>`;
                    if (page.description) listValue += ` - ${page.description}`;
                    pageList.innerHTML += listValue + '</p>';
                    
                    // Run for last list item only
                    if (pageList.childElementCount === pages.length + numListItems) {
                        document.getElementsByClassName('loader')[0].remove(); // Remove loader
                        document.body.innerHTML = document.body.innerHTML; // Fix weird rendering bug on mobile
                    }
                });
        }
    });
}
