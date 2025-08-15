var page = 1;

//essentially awake function
document.addEventListener("DOMContentLoaded", () => {
    init();
})
//attach onclick to prev and next page buttons
document.getElementById("PrevButton").addEventListener("click", () => { LastPageButton() })
document.getElementById("NextButton").addEventListener("click", () => { NextPageButton() })




async function init() {
    //set banner image
    document.getElementById("bannerImage").src = "https://thenightbulb.neocities.org/PokeDictionary/PokeDictionary%20Logo.png";

    //fetch list of pokemon from pokeAPI
    const pokelistTemp = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
    const PokeList = await pokelistTemp.json();

    let container = document.getElementById("pokemon-grid");
    //make 10 tiles
    for (let i = 0; i < 108; i++) { 

        let tile = document.createElement("div");


        tile.classList.add("pokemon-tile"); // for styling
        //set pokemon name
        tile.textContent = CapitalizeString(PokeList.results[i].name); 
        container.appendChild(tile);

        let img = document.createElement("img");
        img.src = await GetPokemonSpriteLink(PokeList.results[i].url);
        img.width = 100;
        img.height = 100;
        tile.appendChild(img);
    }
    console.log("Init successfull");

}
function CapitalizeString(inputString) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

async function GetPokemonSpriteLink(PokemonLink) {
    const pokemonGet = await fetch(PokemonLink);
    const pokemon = await pokemonGet.json();
    return pokemon.sprites.front_default;
}



function NextPageButton() {
    page++;
    console.log("Went to next page: " + page);
}
function LastPageButton() {
    page--;
    console.log("Went to previous page: " + page);
}