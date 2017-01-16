function random_draw(arr){
  i = Math.floor(Math.random() * arr.length)
  return arr[i]
}

$('document').ready(function(){
  var adjectives = []
      animals = []
      groups = []
      biomes = []

  function name(type){
    switch(type){
      case 'storage': return storage_name();
      case 'server': return server_name();
      case 'cluster': return cluster_name();
    }
  }

  function storage_name(){
    return random_draw(adjectives) +
      '_' + random_draw(adjectives) +
      '_' + random_draw(biomes)
  }

  function server_name(){
    return random_draw(adjectives) +
      '_' + random_draw(adjectives) +
      '_' + random_draw(animals)
  }

  function cluster_name(){
    return random_draw(adjectives) +
      '_' + random_draw(adjectives) +
      '_' + random_draw(groups)
  }

   $.get('data/animals.csv', function(data){
     animals = data.split('\n').map(function(x){
       return x.replace(/[ \-()]/g, "").toLowerCase();
     })
   })

   $.get('data/biomes.csv', function(data){
     biomes = data.split('\n').map(function(x){
       return x.replace(/[ \-()]/g, "");
     })
   })

   $.get('data/adjectives.csv', function(data){
     adjectives = data.split('\n').map(function(x){
       return x.replace(/[ \-()]/g, "");
     })
   })

   $.get('data/animal_groups.csv', function(data){
     groups = data.split('\n').map(function(x){
       return x.replace(/[ \-()]/g, "");
     })
   })

   $('#submit').click(function(){
     var type = $('#type').find(":selected").val();
     var generated_name = name(type);
     $('#generated_name').text(generated_name);
   })


})
