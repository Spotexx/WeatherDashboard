//api search https://www.loc.gov/
let searchResultsWeather = {};
let searchResultsForecast = {};
let savedCities = JSON.parse(localStorage.getItem("savedCities")) || {};
let savedCountries = JSON.parse(localStorage.getItem("savedCountries")) || {};

//adds saved cities to dashboard
let loadSavedCities = () => {
    Object.keys(savedCities).forEach(city => {
        $('#saved-cities').append(` <button class="btn btn-secondary w-100 mt-1" id="${city},${savedCities[city]}" onclick="getForecast(this.id)">
                                        ${city.charAt(0).toUpperCase() + city.slice(1)}
                                    </button>`
                                    );
    });
}


$('form').submit(function (e) {
    e.preventDefault();
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + $('#city').val() + ',' + $('option:selected', this).attr('id') + '&appid=0c8597f899f97d65766478ecb9ae2427')
        .then(response => response.json())
        .then(data => {
            searchResultsWeather = data;
            console.log(searchResultsWeather);
            //adds city to savedCities local storage
            if (!savedCities.hasOwnProperty($('#city').val().toLowerCase()) && searchResultsWeather.cod !== "404") {
                //sets key as city name and value as country code
                savedCities[$('#city').val()] = $('option:selected', this).attr('id');
                localStorage.setItem("savedCities", JSON.stringify(savedCities));
                //adds city button to id saved-cities
                $('#saved-cities').append(`<button class="btn btn-secondary w-100 mt-1" id="${searchResultsWeather.name}" onclick="getForecast(this.id)">${searchResultsWeather.name}</button>`);
            }
        });
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + $('#city').val() + ',' + $('option:selected', this).attr('id') + '&appid=0c8597f899f97d65766478ecb9ae2427')
        .then(response => response.json())
        .then(data => {
            searchResultsForecast = data;
        });
});

let init = () => {
    loadSavedCities();
}
init();


//current and future
// section1 => city name + date, temp, wind, humidity, windspeed, colored uv index
//5 day forcast => date, icon weather, temp, wind, humidity