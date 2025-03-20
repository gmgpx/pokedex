const API_BASE_URL = "https://pokeapi.co/api/v2/pokemon/";

// Cliente REST para buscar Pokémon da pokéAPI
const PokemonAPI = {
    async getPokemon(pokemon) {
        try {
            const response = await fetch(`${API_BASE_URL}${pokemon}`);
            if (!response.ok) throw new Error("Not found");
            return await response.json();
        } catch (error) {
            return null;
        }
    },
};

// Selecionando elementos da DOM
const pokemonName = document.querySelector(".pokemon_name");
const pokemonNumber = document.querySelector(".pokemon_id");
const pokemonImg = document.querySelector(".pokemon");
const form = document.querySelector(".form");
const input = document.querySelector(".input_search");
const prev = document.querySelector(".btn-prev");
const next = document.querySelector(".btn-next");

// Estado do Pokémon atual
let currentPokemonId = 1;

// Atualiza a interface com os dados do Pokémon
const updatePokemon = async (pokemon) => {
    pokemonName.textContent = "Loading...";
    pokemonNumber.textContent = "";

    const data = await PokemonAPI.getPokemon(pokemon);
    
    if (data) {
        pokemonImg.style.display = "block";
        pokemonName.textContent = data.name;
        pokemonNumber.textContent = data.id;
        pokemonImg.src = data.sprites.versions["generation-v"]["black-white"].animated.front_default;
        input.value = "";
        currentPokemonId = data.id; // Atualiza o estado
        updateURL(currentPokemonId); // Atualiza a URL com o ID do Pokémon
    } else {
        pokemonImg.style.display = "none";
        pokemonName.textContent = "Not found!";
        pokemonNumber.textContent = "";
    }
};

// Atualiza a URL ao trocar de Pokémon
const updateURL = (id) => {
    window.history.pushState({}, "", `?pokemon=${id}`);
};

// Verifica se há um Pokémon na URL e carrega ao iniciar
const loadPokemonFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const pokemonId = params.get("pokemon") || 1;
    updatePokemon(pokemonId);
};

// Evento para pesquisar pelo formulário
form.addEventListener("submit", (event) => {
    event.preventDefault();
    updatePokemon(input.value.toLowerCase());
});

// Evento para botão "Anterior"
prev.addEventListener("click", () => {
    if (currentPokemonId > 1) {
        updatePokemon(--currentPokemonId);
    }
});

// Evento para botão "Próximo"
next.addEventListener("click", () => {
    updatePokemon(++currentPokemonId);
});

// Carrega o Pokémon da URL ao iniciar
loadPokemonFromURL();
