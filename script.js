var page = 1;
var PokeList;

//essentially awake function
document.addEventListener("DOMContentLoaded", () => {
    init();
    //attach onclick to prev and next page buttons
    document.getElementById("PrevButton").addEventListener("click", () => { LastPageButton() });
    document.getElementById("NextButton").addEventListener("click", () => { NextPageButton() });
    //attach onclick to filter button
    document.getElementById("filterButton").addEventListener("click", () => { ApplyFilterButton() });
    //the page select button
    document.getElementById("PageSelectButton").addEventListener("click", () => { PageSelectButton() });
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
function FormatString(inputString) {
    let stringWithSpaces = inputString.replace(/-/g, ' ');

    return stringWithSpaces
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
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
    else if (filter === "starter") {
        const starters = [
            { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
            { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
            { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
            { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
            { name: "charmeleon", url: "https://pokeapi.co/api/v2/pokemon/5/" },
            { name: "charizard", url: "https://pokeapi.co/api/v2/pokemon/6/" },
            { name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" },
            { name: "wartortle", url: "https://pokeapi.co/api/v2/pokemon/8/" },
            { name: "blastoise", url: "https://pokeapi.co/api/v2/pokemon/9/" },
            { name: "chikorita", url: "https://pokeapi.co/api/v2/pokemon/152/" },
            { name: "bayleef", url: "https://pokeapi.co/api/v2/pokemon/153/" },
            { name: "meganium", url: "https://pokeapi.co/api/v2/pokemon/154/" },
            { name: "cyndaquil", url: "https://pokeapi.co/api/v2/pokemon/155/" },
            { name: "quilava", url: "https://pokeapi.co/api/v2/pokemon/156/" },
            { name: "typhlosion", url: "https://pokeapi.co/api/v2/pokemon/157/" },
            { name: "totodile", url: "https://pokeapi.co/api/v2/pokemon/158/" },
            { name: "croconaw", url: "https://pokeapi.co/api/v2/pokemon/159/" },
            { name: "feraligatr", url: "https://pokeapi.co/api/v2/pokemon/160/" },
            { name: "treeko", url: "https://pokeapi.co/api/v2/pokemon/252/" },
            { name: "grovyle", url: "https://pokeapi.co/api/v2/pokemon/253/" },
            { name: "sceptile", url: "https://pokeapi.co/api/v2/pokemon/254/" },
            { name: "torchic", url: "https://pokeapi.co/api/v2/pokemon/255/" },
            { name: "combusken", url: "https://pokeapi.co/api/v2/pokemon/256/" },
            { name: "blaziken", url: "https://pokeapi.co/api/v2/pokemon/257/" },
            { name: "mudkip", url: "https://pokeapi.co/api/v2/pokemon/258/" },
            { name: "marshtomp", url: "https://pokeapi.co/api/v2/pokemon/259/" },
            { name: "swampert", url: "https://pokeapi.co/api/v2/pokemon/260/" },
            { name: "turtwig", url: "https://pokeapi.co/api/v2/pokemon/387/" }, 
            { name: "grotle", url: "https://pokeapi.co/api/v2/pokemon/388/" },
            { name: "torterra", url: "https://pokeapi.co/api/v2/pokemon/389/" },
            { name: "chimchar", url: "https://pokeapi.co/api/v2/pokemon/390/" },
            { name: "monferno", url: "https://pokeapi.co/api/v2/pokemon/391/" },
            { name: "infernape", url: "https://pokeapi.co/api/v2/pokemon/392/" },
            { name: "piplup", url: "https://pokeapi.co/api/v2/pokemon/393/" },
            { name: "prinplup", url: "https://pokeapi.co/api/v2/pokemon/394/" },
            { name: "empoleon", url: "https://pokeapi.co/api/v2/pokemon/395/" },
            { name: "snivy", url: "https://pokeapi.co/api/v2/pokemon/495/" }, 
            { name: "servine", url: "https://pokeapi.co/api/v2/pokemon/496/" },
            { name: "serperior", url: "https://pokeapi.co/api/v2/pokemon/497/" },
            { name: "tepig", url: "https://pokeapi.co/api/v2/pokemon/498/" },
            { name: "pignite", url: "https://pokeapi.co/api/v2/pokemon/499/" },
            { name: "emboar", url: "https://pokeapi.co/api/v2/pokemon/500/" },
            { name: "oshawott", url: "https://pokeapi.co/api/v2/pokemon/501/" },
            { name: "dewott", url: "https://pokeapi.co/api/v2/pokemon/502/" },
            { name: "samurott", url: "https://pokeapi.co/api/v2/pokemon/503/" } ,
            { name: "chespin", url: "https://pokeapi.co/api/v2/pokemon/650/" }, 
            { name: "quilladin", url: "https://pokeapi.co/api/v2/pokemon/651/" },
            { name: "chesnaught", url: "https://pokeapi.co/api/v2/pokemon/652/" },
            { name: "fennekin", url: "https://pokeapi.co/api/v2/pokemon/653/" },
            { name: "braixen", url: "https://pokeapi.co/api/v2/pokemon/654/" },
            { name: "delphox", url: "https://pokeapi.co/api/v2/pokemon/655/" },
            { name: "froakie", url: "https://pokeapi.co/api/v2/pokemon/656/" },
            { name: "frogadier", url: "https://pokeapi.co/api/v2/pokemon/657/" },
            { name: "greninja", url: "https://pokeapi.co/api/v2/pokemon/658/" },
            { name: "rowlet", url: "https://pokeapi.co/api/v2/pokemon/722/" },
            { name: "dartrix", url: "https://pokeapi.co/api/v2/pokemon/723/" },
            { name: "decidueye", url: "https://pokeapi.co/api/v2/pokemon/724/" },
            { name: "litten", url: "https://pokeapi.co/api/v2/pokemon/725/" },
            { name: "torracat", url: "https://pokeapi.co/api/v2/pokemon/726/" },
            { name: "incineroar", url: "https://pokeapi.co/api/v2/pokemon/727/" },
            { name: "popplio", url: "https://pokeapi.co/api/v2/pokemon/728/" },
            { name: "brionne", url: "https://pokeapi.co/api/v2/pokemon/729/" },
            { name: "primarina", url: "https://pokeapi.co/api/v2/pokemon/730/" },
            { name: "grookey", url: "https://pokeapi.co/api/v2/pokemon/810/" }, 
            { name: "thwackey", url: "https://pokeapi.co/api/v2/pokemon/811/" },
            { name: "rillaboom", url: "https://pokeapi.co/api/v2/pokemon/812/" },
            { name: "scorbunny", url: "https://pokeapi.co/api/v2/pokemon/813/" },
            { name: "raboot", url: "https://pokeapi.co/api/v2/pokemon/814/" },
            { name: "cinderace", url: "https://pokeapi.co/api/v2/pokemon/815/" },
            { name: "sobble", url: "https://pokeapi.co/api/v2/pokemon/816/" },
            { name: "drizzile", url: "https://pokeapi.co/api/v2/pokemon/817/" },
            { name: "inteleon", url: "https://pokeapi.co/api/v2/pokemon/818/" },
            { name: "sprigatito", url: "https://pokeapi.co/api/v2/pokemon/906/" }, 
            { name: "floragato", url: "https://pokeapi.co/api/v2/pokemon/907/" },
            { name: "meowscarada", url: "https://pokeapi.co/api/v2/pokemon/908/" },
            { name: "fuecoco", url: "https://pokeapi.co/api/v2/pokemon/909/" },
            { name: "crocalor", url: "https://pokeapi.co/api/v2/pokemon/910/" },
            { name: "skeledirge", url: "https://pokeapi.co/api/v2/pokemon/911/" },
            { name: "quaxly", url: "https://pokeapi.co/api/v2/pokemon/912/" },
            { name: "quaxwell", url: "https://pokeapi.co/api/v2/pokemon/913/" },
            { name: "quaquaval", url: "https://pokeapi.co/api/v2/pokemon/914/" },
            { name: "poipole", url: "https://pokeapi.co/api/v2/pokemon/803/" },
            { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" }, 
            { name: "eevee", url: "https://pokeapi.co/api/v2/pokemon/133/" }, 
        ];

        // Wrap into same format as API response
        PokeList = { results: starters };
    }
    else if (filter === "eevee") {
        const eevees = [
            { name: "eevee", url: "https://pokeapi.co/api/v2/pokemon/133/" },
            { name: "vaporeon", url: "https://pokeapi.co/api/v2/pokemon/134/" },
            { name: "jolteon", url: "https://pokeapi.co/api/v2/pokemon/135/" },
            { name: "flareon", url: "https://pokeapi.co/api/v2/pokemon/136/" },
            { name: "espeon", url: "https://pokeapi.co/api/v2/pokemon/196/" },
            { name: "umbreon", url: "https://pokeapi.co/api/v2/pokemon/197/" },
            { name: "leafeon", url: "https://pokeapi.co/api/v2/pokemon/470/" },
            { name: "glaceon", url: "https://pokeapi.co/api/v2/pokemon/471/" },
            { name: "sylveon", url: "https://pokeapi.co/api/v2/pokemon/700/" },
        ];

        PokeList = { results: eevees };
    }
    else if (filter === "mega") {
        const megas = [
            { name: "venusaur-mega", url: "https://pokeapi.co/api/v2/pokemon/10033/" },
            { name: "charizard-mega-x", url: "https://pokeapi.co/api/v2/pokemon/10034/" },
            { name: "charizard-mega-y", url: "https://pokeapi.co/api/v2/pokemon/10035/" },
            { name: "blastoise-mega", url: "https://pokeapi.co/api/v2/pokemon/10036/" },
            { name: "alakazam-mega", url: "https://pokeapi.co/api/v2/pokemon/10037/" },
            { name: "gengar-mega", url: "https://pokeapi.co/api/v2/pokemon/10038/" },
            { name: "kangaskhan-mega", url: "https://pokeapi.co/api/v2/pokemon/10039/" },
            { name: "pinsir-mega", url: "https://pokeapi.co/api/v2/pokemon/10040/" },
            { name: "gyarados-mega", url: "https://pokeapi.co/api/v2/pokemon/10041/" },
            { name: "aerodactyl-mega", url: "https://pokeapi.co/api/v2/pokemon/10042/" },
            { name: "mewtwo-mega-x", url: "https://pokeapi.co/api/v2/pokemon/10043/" },
            { name: "mewtwo-mega-y", url: "https://pokeapi.co/api/v2/pokemon/10044/" },
            { name: "ampharos-mega", url: "https://pokeapi.co/api/v2/pokemon/10045/" },
            { name: "scizor-mega", url: "https://pokeapi.co/api/v2/pokemon/10046/" },
            { name: "heracross-mega", url: "https://pokeapi.co/api/v2/pokemon/10047/" },
            { name: "houndoom-mega", url: "https://pokeapi.co/api/v2/pokemon/10048/" },
            { name: "tyranitar-mega", url: "https://pokeapi.co/api/v2/pokemon/10049/" },
            { name: "blaziken-mega", url: "https://pokeapi.co/api/v2/pokemon/10050/" },
            { name: "gardevoir-mega", url: "https://pokeapi.co/api/v2/pokemon/10051/" },
            { name: "mawile-mega", url: "https://pokeapi.co/api/v2/pokemon/10052/" },
            { name: "aggron-mega", url: "https://pokeapi.co/api/v2/pokemon/10053/" },
            { name: "medicham-mega", url: "https://pokeapi.co/api/v2/pokemon/10054/" },
            { name: "manectric-mega", url: "https://pokeapi.co/api/v2/pokemon/10055/" },
            { name: "banette-mega", url: "https://pokeapi.co/api/v2/pokemon/10056/" },
            { name: "absol-mega", url: "https://pokeapi.co/api/v2/pokemon/10057/" },
            { name: "garchomp-mega", url: "https://pokeapi.co/api/v2/pokemon/10058/" },
            { name: "lucario-mega", url: "https://pokeapi.co/api/v2/pokemon/10059/" },
            { name: "abomasnow-mega", url: "https://pokeapi.co/api/v2/pokemon/10060/" },
            { name: "latias-mega", url: "https://pokeapi.co/api/v2/pokemon/10062/" },
            { name: "latios-mega", url: "https://pokeapi.co/api/v2/pokemon/10063/" },
            { name: "swampert-mega", url: "https://pokeapi.co/api/v2/pokemon/10064/" },
            { name: "sceptile-mega", url: "https://pokeapi.co/api/v2/pokemon/10065/" },
            { name: "sableye-mega", url: "https://pokeapi.co/api/v2/pokemon/10066/" },
            { name: "altaria-mega", url: "https://pokeapi.co/api/v2/pokemon/10067/" },
            { name: "gallade-mega", url: "https://pokeapi.co/api/v2/pokemon/10068/" },
            { name: "audino-mega", url: "https://pokeapi.co/api/v2/pokemon/10069/" },
            { name: "sharpedo-mega", url: "https://pokeapi.co/api/v2/pokemon/10070/" },
            { name: "slowbro-mega", url: "https://pokeapi.co/api/v2/pokemon/10071/" },
            { name: "steelix-mega", url: "https://pokeapi.co/api/v2/pokemon/10072/" },
            { name: "pidgeot-mega", url: "https://pokeapi.co/api/v2/pokemon/10073/" },
            { name: "glalie-mega", url: "https://pokeapi.co/api/v2/pokemon/10074/" },
            { name: "diancie-mega", url: "https://pokeapi.co/api/v2/pokemon/10075/" },
            { name: "metagross-mega", url: "https://pokeapi.co/api/v2/pokemon/10076/" },
            { name: "rayquaza-mega", url: "https://pokeapi.co/api/v2/pokemon/10079/" },
            { name: "camerupt-mega", url: "https://pokeapi.co/api/v2/pokemon/10087/" },
            { name: "lopunny-mega", url: "https://pokeapi.co/api/v2/pokemon/10088/" },
            { name: "salamence-mega", url: "https://pokeapi.co/api/v2/pokemon/10089/" },
            { name: "beedrill-mega", url: "https://pokeapi.co/api/v2/pokemon/10090/" }
        ];

        PokeList = { results: megas };
    }
    else if (filter == "g-max") {
        const gmaxList = [
            { "name": "venusaur-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10195/" },
            { "name": "charizard-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10196/" },
            { "name": "blastoise-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10197/" },
            { "name": "butterfree-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10198/" },
            { "name": "pikachu-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10199/" },
            { "name": "meowth-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10200/" },
            { "name": "machamp-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10201/" },
            { "name": "gengar-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10202/" },
            { "name": "kingler-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10203/" },
            { "name": "lapras-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10204/" },
            { "name": "eevee-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10205/" },
            { "name": "snorlax-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10206/" },
            { "name": "garbodor-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10207/" },
            { "name": "melmetal-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10208/" },
            { "name": "rillaboom-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10209/" },
            { "name": "cinderace-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10210/" },
            { "name": "inteleon-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10211/" },
            { "name": "corviknight-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10212/" },
            { "name": "orbeetle-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10213/" },
            { "name": "drednaw-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10214/" },
            { "name": "coalossal-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10215/" },
            { "name": "flapple-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10216/" },
            { "name": "appletun-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10217/" },
            { "name": "sandaconda-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10218/" },
            { "name": "toxtricity-amped-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10219/" },
            { "name": "centiskorch-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10220/" },
            { "name": "hatterene-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10221/" },
            { "name": "grimmsnarl-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10222/" },
            { "name": "alcremie-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10223/" },
            { "name": "copperajah-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10224/" },
            { "name": "duraludon-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10225/" },
            { "name": "urshifu-single-strike-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10226/" },
            { "name": "urshifu-rapid-strike-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10227/" },
            { "name": "toxtricity-low-key-gmax", "url": "https://pokeapi.co/api/v2/pokemon/10228/" },
            { "name": "eternatus-eternamax", "url": "https://pokeapi.co/api/v2/pokemon/10190/" }
        ];


        PokeList = { results: gmaxList };
    }
    else if (filter === "ultraBeast") {
        const beastList = [
            { name: "nihilego", url: "https://pokeapi.co/api/v2/pokemon/793/" },
            { name: "buzzwole", url: "https://pokeapi.co/api/v2/pokemon/794/" },
            { name: "pheromosa", url: "https://pokeapi.co/api/v2/pokemon/795/" },
            { name: "xurkitree", url: "https://pokeapi.co/api/v2/pokemon/796/" },
            { name: "celesteela", url: "https://pokeapi.co/api/v2/pokemon/797/" },
            { name: "kartana", url: "https://pokeapi.co/api/v2/pokemon/798/" },
            { name: "guzzlord", url: "https://pokeapi.co/api/v2/pokemon/799/" },
            { name: "poipole", url: "https://pokeapi.co/api/v2/pokemon/803/" },
            { name: "naganadel", url: "https://pokeapi.co/api/v2/pokemon/804/" },
            { name: "stakataka", url: "https://pokeapi.co/api/v2/pokemon/805/" },
            { name: "blacephalon", url: "https://pokeapi.co/api/v2/pokemon/806/" }
        ];
        PokeList = { results: beastList };
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
    for (let i = 50 * (page - 1); i < 50 * page; i++) {

        let tile = document.createElement("div");


        tile.classList.add("pokemon-tile"); // for styling
        //set pokemon name
        tile.textContent = FormatString(PokeList.results[i].name);
        container.appendChild(tile);

        let img = document.createElement("img");
       
        img.src = await GetPokemonSpriteLink(PokeList.results[i].url);
      
        tile.addEventListener("click", () => { openPokemonPage(PokeList.results[i].name) });
        img.width = 100;
        img.height = 100;
        tile.appendChild(img);
    }
}


function NextPageButton() {
    if (PokeList.results[page * 50]) {
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
function PageSelectButton() {
    var input = parseInt(document.getElementById("PageInput").value);
    if (input < 1) {
        page = 1;
    } else if (input > Math.ceil(PokeList.results.length / 50)) {
        page = Math.ceil(PokeList.results.length / 50);
    } else {
        page = input;
    }
    UpdatePage();
}

function openPokemonPage(name) {
    window.location.href = `pokemon.html?id=${name}`;
}