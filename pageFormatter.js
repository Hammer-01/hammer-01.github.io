let jsonData = fetch("https://api.github.com/users/hammer-01/repos").then(response => response.text()).then(data => JSON.parse(data));

console.log(jsonData);
