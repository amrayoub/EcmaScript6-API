'use strict'

const fetchOption={
  header:{
    'Content-Type': 'application/json'
  },
  mode:'cors'
}

$('form').on('submit',function(e){
  e.preventDefault();

  let types =$('input[type=text]').val().replace(/\s/g,''); // take the value and replace spaces with no spaces
  types =types.split(','); // make array of that
  //console.log(types);
  let trainerTypeCalls=types.map(elem => {
    return fetch(`http://pokeapi.co/api/v2/type/${elem}`,{fetchOption})
  });

  getPromiseData(trainerTypeCalls)
  .then( result => {
    console.log(result);
    getDoubleDamagePokemon(result);
  });
  /*
Promise.all(trainerTypeCalls)
.then(data => {
data=data.map(singleData =>singleData.json());
Promise.all(data)
.then(res =>{
  console.log(res);
});
});
//  console.log(trainerTypeCalls);
*/
});

function getDoubleDamagePokemon(pokemonTypes){ // return back array of arrays
pokemonTypes = pokemonTypes
.map( types => {
return  types.damage_relations.double_damage_from
})
.reduce(flatten,[]) // return the wanted array of object
.map( type => {
  return fetch(type.url,fetchOption)
});

getPromiseData(pokemonTypes)
.then(results => {
  console.log(results);
  buildTeam(results)
});

function buildTeam(pokemons){
  let team =[]; // push pokemon here
  pokemons = pokemons.map(pokemon => {
    return pokemon.pokemon;
  })
  .reduce(flatten, [])// intial value ) // use flatten fuction to get the wanted array
  .map(pokemon =>pokemon.pokemon);
for(let i=0; i<6; i++){
team.push(getRandomPokemon(pokemons));
}
team=team.map(pokemon => {
  return fetch(pokemon.url,fetchOption)
});
getPromiseData(team)//handle json
.then(pokemonData => {
displayPokemon(pokemonData)
});

}

function getRandomPokemon(pokemonArray){
  return pokemonArray[Math.floor(Math.random()  * pokemonArray.length)];
}
}

const flatten =(a,b) => [...a,...b];

function getPromiseData(promisesArray){ // fetch calls
  return new Promise((resolve,reject) => {
    Promise.all(promisesArray)
    .then(res => {
      return res.map(type => type.json() ); // when it comes back we loop and get json data
    })
    .then(res => {
      Promise.all(res) // another array of results
      .then(resolve);
    })
    .catch(reject);
  });
}


  function displayPokemon(pokemon){
    // loop through and display the pokemon
    pokemon.forEach(poke =>{
      var $container =$('<div>').addClass('pokemon');
      var $image = $('<img>').attr('src',`http://pokeapi.co/media/img/${poke.id}.png` );
      var $title=$('<h2>').text(poke.name);
      $container.append($image,$title);
      $('.poke-container').append($container);
    });
  }
/*
  let trainerTypeCalls=types.map(elem => {
    return fetch(`http://pokeapi.co/api/v2/type/${elem}`,{fetchOption})
  });
*/
