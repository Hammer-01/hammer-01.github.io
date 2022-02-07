let jsonData = fetch("https://api.github.com/users/hammer-01/repos", {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
}).then(response => response.json())
  .then(json => {
      let pages = [];
      for (let repo of json) {
          if (repo.has_pages && repo.html_url !== window.location.href) pages.push(repo);
      }
      return pages;
  });

console.log(jsonData);
