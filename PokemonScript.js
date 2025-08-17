const url = new URL(window.location.href);
const PokemonName = url.searchParams.get("id");
var PokemonSpiecies;
var Pokemon;

var imageRetried = false;
document.addEventListener("DOMContentLoaded", () => {
    init();
    document.getElementById("PokemonPortrait").addEventListener("error", () => {
        RetryImage();
        imageRetried = true;
    });
})

async function init() {
    console.log(PokemonName);
    //get pokemon data
    try {
        var pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${PokemonName}`);
        Pokemon = await pokemonData.json();
    } catch { console.log("No PokemonData found"); }
    try {
        pokemonData = await fetch(Pokemon.species.url);
        PokemonSpiecies = await pokemonData.json();
    } catch { console.log("No Spiecies found"); }
    console.log(Pokemon);
    console.log(PokemonSpiecies);
    //set pokemon sprite
    document.getElementById("PokemonPortrait").src = await GetArtworkURLForPokemon("official");
}


async function RetryImage() {
    if (imageRetried == false) {
        document.getElementById("PokemonPortrait").src = await GetArtworkURLForPokemon("sprite");
    } else {
        document.getElementById("PokemonPortrait").src = "https://raw.githubusercontent.com/TheNightbulb/PokeDictionaryV2/refs/heads/main/img/SpriteNotFound.png";
    }
}
async function GetArtworkURLForPokemon(version) {
    try {
        if (version == "official") {
            return "https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/" + Pokemon.id + ".png";
        }
        else if(version == "sprite") {
            return Pokemon.sprites.front_default
        }
        //add more cases here
        else
        {
            return Pokemon.sprites.front_default
        }
    } catch {
        return Pokemon.sprites.front_default
    }
}