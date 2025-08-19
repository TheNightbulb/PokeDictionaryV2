const url = new URL(window.location.href);
const AbilityName = url.searchParams.get("id");
var Ability
document.addEventListener("DOMContentLoaded", () => {
    init();
    document.getElementById("bannerImage").addEventListener("click", () => {
        window.location.href = "index.html";
    })
})

async function init() {
    //get ablility json
    var abliltyJson = await fetch("https://pokeapi.co/api/v2/ability/" + AbilityName);
    Ability = await abliltyJson.json();

    document.getElementById("AbilityName").innerText = CapitalizeString(AbilityName);

    //get description entries
    var descriptionEntries = getEnglishEntries(Ability.effect_entries, "effect")
    document.getElementById("AbilityShortDesk").innerText = descriptionEntries[0];
    descriptionEntries = getEnglishEntries(Ability.flavor_text_entries, "flavor_text")
    var gameVersionEntries = getEnglishEntries(Ability.flavor_text_entries, "version_group")
    for (let index = 0; index < descriptionEntries.length; index++) {
        let panel = document.createElement("div");
        panel.className = "InnerPanel";
        let versionText = document.createElement("span");
        versionText.className = "TitleText";
        versionText.innerText = CapitalizeString(gameVersionEntries[index].name);
        let descText = document.createElement("span");
        descText.className = "text";
        descText.innerText = descriptionEntries[index];
        panel.appendChild(versionText);
        panel.appendChild(descText);
        document.getElementById("descPanel").appendChild(panel);
    }

    document.getElementById("PokemonWithAbilityText").innerText += " " + CapitalizeString(AbilityName);

    var grid = document.getElementById("pokemon-grid");
    for (let index = 0; index < Ability.pokemon.length; index++) {
        let tile = document.createElement("div");


        tile.classList.add("pokemon-tile"); // for styling
        //set pokemon name
        tile.textContent = CapitalizeString(Ability.pokemon[index].pokemon.name);
        grid.appendChild(tile);

        let img = document.createElement("img");

        img.src = await GetPokemonSpriteLink(Ability.pokemon[index].pokemon.url);

        tile.addEventListener("click", () => { openPokemonPage(Ability.pokemon[index].pokemon.name) });
        img.width = 100;
        img.height = 100;
        tile.appendChild(img);
    }
}
async function GetPokemonSpriteLink(PokemonLink) {
    const pokemonGet = await fetch(PokemonLink);
    const pokemon = await pokemonGet.json();
    if (pokemon.sprites.front_default != null) {
        return pokemon.sprites.front_default;
    } else {
        return "https://raw.githubusercontent.com/TheNightbulb/PokeDictionaryV2/refs/heads/main/img/SpriteNotFound.png"
    }
}
function getEnglishEntries(entries, fieldName) {
    return entries
        .filter(entry => entry.language.name === "en")
        .map(entry => entry[fieldName]);
}
function CapitalizeString(inputString) {
    let stringWithSpaces = inputString.replace(/-/g, ' ');

    return stringWithSpaces
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
function openPokemonPage(name) {
    window.location.href = `pokemon.html?id=${name}`;
}