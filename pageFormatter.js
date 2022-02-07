let jsonData = await fetch("https://api.github.com/users/hammer-01/repos", {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
}).then(response => response.json());

console.log(jsonData);
