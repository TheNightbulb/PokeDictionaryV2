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
    document.getElementById("bannerImage").addEventListener("click", () => {
        window.location.href = "index.html";
    })
})

async function init() {
    document.getElementById("bannerImage").src = "https://raw.githubusercontent.com/TheNightbulb/PokeDictionaryV2/refs/heads/main/img/PokeDictionary%20Logo.png";
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
    document.getElementById("PokemonName").innerText = CapitalizeString(PokemonName);
    document.getElementById("PokemonGenus").innerText = getEnglishEntries(PokemonSpiecies.genera, "genus")[0];
    //pokedex info
    var typeText;
    if (Pokemon.types.length == 1) {
        typeText = "Type"
    } else {typeText = "Types" }
    document.getElementById("typeText").innerText = typeText;
    //set type sprites
    document.getElementById("TypeImg1").src = await GetTypeSprites(Pokemon.types[0].type.name)
    if (Pokemon.types.length == 2) {
        document.getElementById("TypeImg2").src = await GetTypeSprites(Pokemon.types[1].type.name)
    } else {
        document.getElementById("TypeParent").removeChild(document.getElementById("TypeImg2"));
    }
    //set the weight and height
    document.getElementById("HeightMetricPanel").innerText = convertHeight(Pokemon.height, "M") + " ("+ convertHeight(Pokemon.height, "F") + ")"
    document.getElementById("WeightMetricPanel").innerText = convertWeight(Pokemon.weight, "K") + " (" + convertWeight(Pokemon.weight, "L") + ")"
    //set the pokedex number
    document.getElementById("PokedexNum").innerText = "National #: " + GetNationalPokedexNumber();
    //AbilityPanel
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
async function GetTypeSprites(name) {
    var TypeData = await fetch(`https://pokeapi.co/api/v2/type/${name}`);
    var type = await TypeData.json();
    return "https://raw.githubusercontent.com/TheNightbulb/PokeDictionaryV2/refs/heads/main/img/Types/" + type.id+".png"
}
function convertHeight(dm, unit) {
    if (typeof dm !== "number" || isNaN(dm)) {
        throw new Error("First argument must be a number (decimeters).");
    }
    if (typeof unit !== "string") {
        throw new Error("Second argument must be a string: 'M' or 'F'.");
    }

    const meters = dm / 10; 

    if (unit.toUpperCase() === "M") {
        return `${meters.toFixed(1)} m`; 
    }

    if (unit.toUpperCase() === "F") {
        const totalInches = meters * 39.3701; 
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        return `${feet}'${inches.toFixed(0)}"`; 
    }

    throw new Error("Invalid unit. Use 'M' for meters or 'F' for feet/inches.");
}
function convertWeight(hg, unit) {
    if (typeof hg !== "number" || isNaN(hg)) {
        throw new Error("First argument must be a number (hectograms).");
    }
    if (typeof unit !== "string") {
        throw new Error("Second argument must be a string: 'K' or 'L'.");
    }

    const kilograms = hg / 10; 

    if (unit.toUpperCase() === "K") {
        return `${kilograms.toFixed(1)} kg`; 
    }

    if (unit.toUpperCase() === "L") {
        const pounds = kilograms * 2.20462; 
        return `${pounds.toFixed(1)} lb`; 
    }

    throw new Error("Invalid unit. Use 'K' for kilograms or 'L' for pounds.");
}

function GetNationalPokedexNumber() {
    if (!PokemonSpiecies.pokedex_numbers) return null;

    const national = PokemonSpiecies.pokedex_numbers.find(
        entry => entry.pokedex.name === "national"
    );

    return national ? national.entry_number : null;
}