const url = new URL(window.location.href);
const PokemonName = url.searchParams.get("id");
var PokemonSpiecies;
var Pokemon;

var cryAudio;
var oldCryAudio;

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
    document.getElementById("PokemonName").innerText = FormatString(PokemonName);
    document.getElementById("PokemonGenus").innerText = getEnglishEntries(PokemonSpiecies.genera, "genus")[0];
    //set prev and next buttons
    setPrevNextPokemon(PokemonName);


    //pokedex info
    var typeText;
    if (Pokemon.types.length == 1) {
        typeText = "Type"
    } else { typeText = "Types" }
    document.getElementById("typeText").innerText = typeText;
    //set type sprites
    document.getElementById("TypeImg1").src = await GetTypeSprites(Pokemon.types[0].type.name)
    if (Pokemon.types.length == 2) {
        document.getElementById("TypeImg2").src = await GetTypeSprites(Pokemon.types[1].type.name)
    } else {
        document.getElementById("TypeParent").removeChild(document.getElementById("TypeImg2"));
    }
    //set the weight and height
    document.getElementById("HeightMetricPanel").innerText = convertHeight(Pokemon.height, "M") + " (" + convertHeight(Pokemon.height, "F") + ")"
    document.getElementById("WeightMetricPanel").innerText = convertWeight(Pokemon.weight, "K") + " (" + convertWeight(Pokemon.weight, "L") + ")"
    //set the pokedex number
    document.getElementById("PokedexNum").innerText = "National #: " + GetNationalPokedexNumber();
    //AbilityPanel
    var abilityPanel = document.getElementById("AbilityPanel");
    for (let index = 0; index < Pokemon.abilities.length; index++) {
        var span = document.createElement("span");
        span.innerText = (index + 1) + ": " + FormatString(Pokemon.abilities[index].ability.name);
        if (Pokemon.abilities[index].is_hidden) {
            span.innerText += " (Hidden)";
        }
        span.className = "AbilityText";
        span.style.cursor = "pointer";
        span.style.textDecoration = "underline";
        span.addEventListener("click", () => {
            window.location.href = `ability.html?id=${Pokemon.abilities[index].ability.name}`;

        });
        abilityPanel.appendChild(span);

    }
    //add pokedex numbers
    for (let index = 1; index < PokemonSpiecies.pokedex_numbers.length; index++) {
        var span = document.createElement("span");
        span.className = "AbilityText";
        span.innerText = PokemonSpiecies.pokedex_numbers[index].entry_number + " (" + FormatString(PokemonSpiecies.pokedex_numbers[index].pokedex.name) + ")";
        document.getElementById("PokedexNumbersPanel").appendChild(span);

    }
    document.getElementById("PokemonGeneration").innerText = CapitalizeString(PokemonSpiecies.generation.name);
    //set up pokedex entries
    for (let index = 0; index < PokemonSpiecies.flavor_text_entries.length; index++) {
        if (PokemonSpiecies.flavor_text_entries[index].language.name == "en") {
            let panel = document.createElement("div");
            panel.className = "InnerPanel";
            let GameTitleText = document.createElement("span");
            GameTitleText.className = "text";
            GameTitleText.innerText = FormatString(PokemonSpiecies.flavor_text_entries[index].version.name);
            panel.appendChild(GameTitleText);
            let PokedexEntryText = document.createElement("span");
            PokedexEntryText.className = "text";
            PokedexEntryText.innerText = FormatString(PokemonSpiecies.flavor_text_entries[index].flavor_text);
            panel.appendChild(PokedexEntryText);
            document.getElementById("PokedexEntryPanel").appendChild(panel);
            //set the background color of the panel based on the game version
            switch (PokemonSpiecies.flavor_text_entries[index].version.name) {
                case "red": panel.style.backgroundColor = "red";
                    break;
                case "blue": panel.style.backgroundColor = "blue";
                    break;
                case "yellow": panel.style.backgroundColor = "yellow"; panel.style.color = "black";
                    break;
                case "gold": panel.style.backgroundColor = "gold"; panel.style.color = "black";
                    break;
                case "silver": panel.style.backgroundColor = "silver"; panel.style.color = "black";
                    break;
                case "crystal": panel.style.backgroundColor = "deepskyblue"; panel.style.color = "black";
                    break;
                case "ruby": panel.style.backgroundColor = "darkred";
                    break;
                case "sapphire": panel.style.backgroundColor = "darkblue";
                    break;
                case "emerald": panel.style.backgroundColor = "green";
                    break;
                case "firered": panel.style.backgroundColor = "orangered";
                    break;
                case "leafgreen": panel.style.backgroundColor = "darkgreen";
                    break;
                case "diamond": panel.style.backgroundColor = "lightblue"; panel.style.color = "black";
                    break;
                case "pearl": panel.style.backgroundColor = "pink"; panel.style.color = "black";
                    break;
                case "platinum": panel.style.backgroundColor = "lightgray"; panel.style.color = "black";
                    break;
                case "heartgold": panel.style.backgroundColor = "goldenrod"; panel.style.color = "black";
                    break;
                case "soulsilver": panel.style.backgroundColor = "darkgray"; panel.style.color = "black";
                    break;
                case "black": panel.style.backgroundColor = "black";
                    break;
                case "white": panel.style.backgroundColor = "white"; panel.style.color = "black";
                    break;
                case "black-2": panel.style.backgroundColor = "black";
                    break;
                case "white-2": panel.style.backgroundColor = "white"; panel.style.color = "black";
                    break;
                case "x": panel.style.backgroundColor = "navy";
                    break;
                case "y": panel.style.backgroundColor = "darkred";
                    break;
                case "omega-ruby": panel.style.backgroundColor = "darkred";
                    break;
                case "alpha-sapphire": panel.style.backgroundColor = "darkblue";
                    break;
                case "sun": panel.style.backgroundColor = "orange"; panel.style.color = "black";
                    break;
                case "moon": panel.style.backgroundColor = "darkblue";
                    break;
                case "ultra-sun": panel.style.backgroundColor = "orange"; panel.style.color = "black";
                    break;
                case "ultra-moon": panel.style.backgroundColor = "darkblue";
                    break;
                case "lets-go-pikachu": panel.style.backgroundColor = "yellow"; panel.style.color = "black";
                    break;
                case "lets-go-eevee": panel.style.backgroundColor = "saddlebrown"; panel.style.color = "black";
                    break;
                case "sword": panel.style.backgroundColor = "lightgray"; panel.style.color = "black";
                    break;
                case "shield": panel.style.backgroundColor = "darkgreen";
                    break;
                case "legends-arceus": panel.style.backgroundColor = "brown"; panel.style.color = "black";
                    break;
                case "scarlet": panel.style.backgroundColor = "red";
                    break;
                case "violet": panel.style.backgroundColor = "blue";
                    break;
                case "colosseum": panel.style.backgroundColor = "purple";
                    break;
                case "xd": panel.style.backgroundColor = "purple";
                    break;
                case "brilliant-diamond": panel.style.backgroundColor = "lightblue"; panel.style.color = "black";
                    break;
                case "shining-pearl": panel.style.backgroundColor = "pink"; panel.style.color = "black";
                    break;
                case "the-isle-of-armor": panel.style.backgroundColor = "lightgreen"; panel.style.color = "black";
                    break;
                case "the-crown-tundra": panel.style.backgroundColor = "lightgray"; panel.style.color = "black";
                    break;
                case "the-teal-mask": panel.style.backgroundColor = "teal"; panel.style.color = "black";
                    break;
                case "the-indigo-disk": panel.style.backgroundColor = "indigo"; panel.style.color = "black";
                    break;

            }

        }
    }
    setStatBar("hp-bar", Pokemon.stats[0].base_stat);
    setStatBar("attack-bar", Pokemon.stats[1].base_stat);
    setStatBar("defense-bar", Pokemon.stats[2].base_stat);
    setStatBar("spec-attack-bar", Pokemon.stats[3].base_stat);
    setStatBar("spec-defense-bar", Pokemon.stats[4].base_stat);
    setStatBar("speed-bar", Pokemon.stats[5].base_stat);
    var total = 0;
    for (let index = 0; index < Pokemon.stats.length; index++) {
        total += Pokemon.stats[index].base_stat;
    }
    document.getElementById("statTotal").innerText = "Total: " + total;

    //cry panel
    var cryPanel = document.getElementById("cryPanel");
    cryAudio = new Audio(Pokemon.cries.latest);
    oldCryAudio = new Audio(Pokemon.cries.legacy);
    if (Pokemon.cries.legacy != null) {
        document.getElementById("LegacyCry").addEventListener("click", () => { oldCryAudio.play(); });
    } else { document.getElementById("LegacyCry").remove(); }
    document.getElementById("LatestCry").addEventListener("click", () => { cryAudio.play(); });

    //set gender ratio
    var genderString = "";
    if (PokemonSpiecies.gender_rate == -1) {
        genderString = "Genderless";
    } else {
        const femalePercent = (PokemonSpiecies.gender_rate / 8) * 100;
        const malePercent = 100 - femalePercent;
        genderString = `${malePercent}% male, ${femalePercent}% female`;
    }
    document.getElementById("GenderRatioText").innerText = genderString;
    //set egg groups
    var eggText = document.getElementById("EggGroupText");
    for (let index = 0; index < PokemonSpiecies.egg_groups.length; index++) {
        eggText.innerText += (" " + FormatString(PokemonSpiecies.egg_groups[index].name) + ",");
    }
    eggText.innerText = eggText.innerText.slice(0, -1);
    //set growth rate
    var growthRateText = document.getElementById("GrowthRateText");
    growthRateText.innerText = FormatString(PokemonSpiecies.growth_rate.name);

    //set egg cycles
    var eggCyclesText = document.getElementById("EggCycleText");
    eggCyclesText.innerText = PokemonSpiecies.hatch_counter + " (" + (128 * (PokemonSpiecies.hatch_counter + 1) + " - " + (256 * (PokemonSpiecies.hatch_counter + 1)) + " Steps)");
    //set catch rate
    var catchRateText = document.getElementById("CatchRateText");
    catchRateText.innerText = PokemonSpiecies.capture_rate + " (1/" + Math.ceil(255 / PokemonSpiecies.capture_rate) + " chance to catch)" + " %" + ((PokemonSpiecies.capture_rate / 255) * 100).toFixed(2);
    //set base friendship
    var baseFriendshipText = document.getElementById("BaseFriendshipText");
    baseFriendshipText.innerText = PokemonSpiecies.base_happiness;
    //set moves tab
    populateMovesTabs(Pokemon);
}
function setStatBar(barId, value, max = 255) {
    const bar = document.getElementById(barId);
    const percentage = Math.min((value / max) * 100, 100);
    bar.style.width = percentage + "%";
    bar.textContent = value; // show the stat value inside the bar
}
function getEnglishEntries(entries, fieldName) {
    return entries
        .filter(entry => entry.language.name === "en")
        .map(entry => entry[fieldName]);
}
function FormatString(inputString) {
    let stringWithSpaces = inputString.replace(/-/g, ' ');

    return stringWithSpaces
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
function CapitalizeString(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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

async function GetMoveTypeSprites(name) {
    var TypeData = await fetch(`https://pokeapi.co/api/v2/type/${name}`);
    var type = await TypeData.json();
    return "https://raw.githubusercontent.com/TheNightbulb/PokeDictionaryV2/refs/heads/main/img/MoveTypes/" + type.id + ".png"
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
async function populateMovesTabs(pokemonData) {
    // 1. Collect unique version groups
    const gamelist = [...new Set(
        pokemonData.moves.flatMap(m => m.version_group_details.map(v => v.version_group.name))
    )];

    // 2. Pre-fetch move details (only once per unique move)
    const moveCache = new Map();
    async function getMoveData(move) {
        if (!moveCache.has(move.name)) {
            const res = await fetch(move.url);
            const data = await res.json();
            moveCache.set(move.name, data);
        }
        return moveCache.get(move.name);
    }

    // 3. Helper to render a section of moves
    async function renderMovesSection(title, moves, tabContent) {
        if (!moves.length) return;

        const titleEl = document.createElement("span");
        titleEl.className = "TitleText";
        titleEl.innerText = title;
        tabContent.appendChild(titleEl);

        // Header row
        const header = document.createElement("div");
        header.className = "HorizontalMovesStacker header-row";
        ["Level", "Move", "Type", "Class", "Power", "Accuracy"].forEach(txt => {
            let span = document.createElement("span");
            span.className = "header-text";
            span.innerText = txt;
            header.appendChild(span);
        });
        tabContent.appendChild(header);

        // Sort moves (level-up by level, others alphabetically)
        if (title === "Level Up") {
            moves.sort((a, b) => a.level - b.level);
        } else {
            moves.sort((a, b) => a.name.localeCompare(b.name));
        }

        // Render rows
        for (const move of moves) {
            const moveJson = await getMoveData(move);

            const div = document.createElement("div");
            div.className = "move-row"; // use grid styling

            // Column: Level
            let levelSpan = document.createElement("span");
            levelSpan.innerText = move.level || "-";
            div.appendChild(levelSpan);

            // Column: Move Name
            let moveName = document.createElement("span");
            moveName.innerText = FormatString(move.name);
            div.appendChild(moveName);

            // Column: Type
            let typeImg = document.createElement("img");
            typeImg.style.height = "25px";
            typeImg.style.width = "auto";
            typeImg.src = await GetMoveTypeSprites(moveJson.type.name);
            div.appendChild(typeImg);

            // Column: Class
            let classImg = document.createElement("img");
            classImg.style.height = "25px";
            classImg.style.width = "auto";
            classImg.src = getMoveCategoryIcon(moveJson.damage_class.name);
            div.appendChild(classImg);

            // Column: Power
            let power = document.createElement("span");
            power.innerText = moveJson.power ?? "-";
            div.appendChild(power);

            // Column: Accuracy
            let accuracy = document.createElement("span");
            accuracy.innerText = moveJson.accuracy ?? "-";
            div.appendChild(accuracy);

            tabContent.appendChild(div);
        }
    }

    // 4. Build the tabs
    for (let [i, game] of gamelist.entries()) {
        // Tab button
        const button = document.createElement("button");
        button.className = "tab-button";
        button.innerText = FormatString(game);
        document.getElementById("movesTabs").appendChild(button);

        // Tab content container
        const tabContent = document.createElement("div");
        tabContent.id = `tab-${game}`;
        tabContent.className = "tab-content";
        document.getElementById("movesTabContents").appendChild(tabContent);

        // Activate first tab by default
        if (i === 0) {
            button.classList.add("active");
            tabContent.classList.add("active");
        }

        button.addEventListener("click", () => {
            document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));
            tabContent.classList.add("active");
        });

        // Group moves by learn method
        const movesByMethod = { "level-up": [], "egg": [], "machine": [], "tutor": [], "form-change": [] };

        for (const m of pokemonData.moves) {
            const vg = m.version_group_details.find(v => v.version_group.name === game);
            if (!vg) continue;
            movesByMethod[vg.move_learn_method.name]?.push({
                name: m.move.name,
                url: m.move.url,
                level: vg.level_learned_at
            });
        }

        // Render each section
        await renderMovesSection("Level Up", movesByMethod["level-up"], tabContent);
        await renderMovesSection("Egg Moves", movesByMethod["egg"], tabContent);
        await renderMovesSection("Form Change", movesByMethod["form-change"], tabContent);
        await renderMovesSection("Machine", movesByMethod["machine"], tabContent);
        await renderMovesSection("Tutor", movesByMethod["tutor"], tabContent);
    }
}

function getMoveCategoryIcon(category) {
    switch (category) {
        case "physical":
            return "https://raw.githubusercontent.com/TheNightbulb/PokeDictionaryV2/refs/heads/main/img/move-physical.png";
        case "special":
            return "https://raw.githubusercontent.com/TheNightbulb/PokeDictionaryV2/refs/heads/main/img/move-special.png";
        case "status":
            return "https://raw.githubusercontent.com/TheNightbulb/PokeDictionaryV2/refs/heads/main/img/move-status.png";
    }
}
function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}
async function setPrevNextPokemon(currentIdOrName) {
    if (Pokemon.is_default === true) {
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${currentIdOrName}`);
        const species = await speciesRes.json();

        const currentId = species.id;

        const prevId = currentId > 1 ? currentId - 1 : null;
        const nextId = currentId < 1025 ? currentId + 1 : null;
        async function getPokemonData(id) {
            if (!id) return null;
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
            const data = await res.json();
            const name = data.name;

            const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const pokeData = await pokeRes.json();

            return {
                name: name,
                sprite: pokeData.sprites.front_default
            };
        }

        const [prev, next] = await Promise.all([
            getPokemonData(prevId),
            getPokemonData(nextId)
        ]);

        if (prev) {
            document.getElementById("lastPokemonName").textContent = " " + FormatString(prev.name);
            document.getElementById("lastPokemon").src = prev.sprite;
            document.getElementById("lastPokemonContainer").addEventListener("click", () => {
                window.location.href = `pokemon.html?id=${prev.name}`;
            });
        } else {
            document.getElementById("lastPokemonName").textContent = "";
            document.getElementById("lastPokemon").src = "";
        }

        if (next) {
            document.getElementById("nextPokemonName").textContent = " " + FormatString(next.name);
            document.getElementById("nextPokemon").src = next.sprite;
            document.getElementById("nextPokemonContainer").addEventListener("click", () => {
                window.location.href = `pokemon.html?id=${next.name}`;
            });
        } else {
            document.getElementById("nextPokemonName").textContent = "";
            document.getElementById("nextPokemon").src = "";
        }
    }
}