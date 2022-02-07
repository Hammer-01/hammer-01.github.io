fetch("https://api.github.com/users/hammer-01")
  .then(function(response) {
    let txt = response.text();
    console.log(txt);
    return txt;
  })
  .then(function(data){
//     console.log(data); //this will just be text
    var data_obj = JSON.parse(data);
    return data_obj;
  });
