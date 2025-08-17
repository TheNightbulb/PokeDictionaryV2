const url = new URL(window.location.href);
const PokemonName = url.searchParams.get("id");
var PokemonSpiecies;

document.addEventListener("DOMContentLoaded", () => {
    init();
})

async function init() {
    console.log(PokemonName);
    //get pokemon data
    var pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${PokemonName}`);
    Pokemon = await pokemonData.json();
    pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${PokemonName}`);
    PokemonSpiecies = await pokemonData.json();
    console.log(Pokemon);
    console.log(PokemonSpiecies);

}