let jsonData = fetch("https://api.github.com/users/hammer-01/repos", {
    method: 'get',
    headers: {
        'Accept': 'application/json'
    }
}).then(response => response.json());

console.log(jsonData);
