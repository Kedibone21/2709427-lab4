const searchBtn = document.getElementById('search-btn');
const countryInput = document.getElementById('country-input');
const countryInfo = document.getElementById('country-info');
const borderSection = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');
const spinner = document.getElementById('loading-spinner');

// Hide spinner initially
spinner.classList.add('hidden');

async function searchCountry(countryName) {
    if (!countryName) return;

    try {
        // Clear previous data
        errorMessage.textContent = "";
        countryInfo.innerHTML = "";
        borderSection.innerHTML = "";

        // Show spinner
        spinner.classList.remove('hidden');

        // Fetch main country
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if (!response.ok) {
            throw new Error("Country not found. Please try again.");
        }

        const data = await response.json();
        const country = data[0];

        // Display country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;

        // Fetch bordering countries
        if (country.borders) {
            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                const borderCard = document.createElement('div');
                borderCard.classList.add('border-country');
                borderCard.innerHTML = `
                    <h4>${borderCountry.name.common}</h4>
                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                `;
                borderSection.appendChild(borderCard);
            }
        } else {
            borderSection.innerHTML = "<p>No bordering countries.</p>";
        }

    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        // Hide spinner
        spinner.classList.add('hidden');
    }
}

// Button click
searchBtn.addEventListener('click', () => {
    searchCountry(countryInput.value.trim());
});

// Enter key support
countryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCountry(countryInput.value.trim());
    }
});