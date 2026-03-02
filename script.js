// Get elements
const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {

    if (!countryName) {
        showError("Please enter a country name.");
        return;
    }

    try {
        // Reset UI
        errorMessage.classList.add('hidden');
        countryInfo.classList.add('hidden');
        borderingCountries.classList.add('hidden');
        borderingCountries.innerHTML = "";

        // Show spinner
        spinner.classList.remove('hidden');

        // Fetch country (exact match)
        const response = await fetch(
            `https://restcountries.com/v3.1/name/${countryName}?fullText=true`
        );

        if (!response.ok) {
            throw new Error("Country not found.");
        }

        const data = await response.json();
        const country = data[0];

        // Display main country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString("en-US")}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;

        countryInfo.classList.remove('hidden');

        // Handle bordering countries
        if (country.borders && country.borders.length > 0) {

            for (let code of country.borders) {

                const borderResponse = await fetch(
                    `https://restcountries.com/v3.1/alpha/${code}`
                );

                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderingCountries.innerHTML += `
                    <div class="border-item">
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                    </div>
                `;
            }

            borderingCountries.classList.remove('hidden');

        } else {
            borderingCountries.innerHTML = "<p>No bordering countries.</p>";
            borderingCountries.classList.remove('hidden');
        }

    } catch (error) {
        showError(error.message);
    } finally {
        spinner.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

// Button click
searchBtn.addEventListener('click', () => {
    searchCountry(countryInput.value.trim());
});

// Enter key support
countryInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchCountry(countryInput.value.trim());
    }
});