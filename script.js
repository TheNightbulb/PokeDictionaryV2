var page = 1;
var PokeList;

//essentially awake function
document.addEventListener("DOMContentLoaded", () => {
    init();
    //attach onclick to prev and next page buttons
    document.getElementById("PrevButton").addEventListener("click", () => { LastPageButton() })
    document.getElementById("NextButton").addEventListener("click", () => { NextPageButton() })
    //attach onclick to filter button
    document.getElementById("filterButton").addEventListener("click", () => { ApplyFilterButton() })
})





async function init() {
    //set banner image
    document.getElementById("bannerImage").src = "https://raw.githubusercontent.com/TheNightbulb/PokeDictionaryV2/refs/heads/main/img/PokeDictionary%20Logo.png";

    //fetch list of pokemon from pokeAPI
    await UpdatePokeList("");

    //load page one
    await UpdatePage();
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
async function UpdatePokeList(filter) {
    // Map of type names to their corresponding API number
    const typeMap = {
        normal: 1,
        fighting: 2,
        flying: 3,
        poison: 4,
        ground: 5,
        rock: 6,
        bug: 7,
        ghost: 8,
        steel: 9,
        fire: 10,
        water: 11,
        grass: 12,
        electric: 13,
        psychic: 14,
        ice: 15,
        dragon: 16,
        dark: 17,
        fairy: 18
    };

    if (filter === "" || filter === "all") {
        // Get full Pokémon list
        const pokelistTemp = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
        PokeList = await pokelistTemp.json(); // has .results array
    }
    else if (typeMap[filter]) {
        // Get Pokémon by type
        const pokelistTemp = await fetch(`https://pokeapi.co/api/v2/type/${typeMap[filter]}`);
        const data = await pokelistTemp.json();
        // Convert to same format as 'all'
        PokeList = { results: data.pokemon.map(p => p.pokemon) };
    }
}

async function UpdatePage() {
    document.getElementById("PageNumber").textContent = page;
    let container = document.getElementById("pokemon-grid");
    container.innerHTML = "";
    for (let i = 108 * (page - 1); i < 108 * page; i++) {

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
}


function NextPageButton() {
    if (PokeList.results[page * 108]) {
        page++;
        UpdatePage();
    }

    console.log("Went to next page: " + page);
}
function LastPageButton() {
    if (page != 1) {
        page--;
        UpdatePage();
    }

    console.log("Went to previous page: " + page);
}
async function ApplyFilterButton() {
    var dropdown = document.getElementById("filterSelect")
    var selectedValue = dropdown.value;
    await UpdatePokeList(selectedValue);
    
    page = 1;
    UpdatePage();
}