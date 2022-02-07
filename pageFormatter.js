fetch("https://api.github.com/users/hammer-01/repos")
  .then(function(response) {
    console.log(response.text());
  })
  .then(function(data){
    console.log(data); //this will just be text
    var data_obj = JSON.parse(data);
    return data_obj;
  });
