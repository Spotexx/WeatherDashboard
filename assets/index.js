//api search https://www.loc.gov/
let searchResultsWeather = {};
let searchResultsForecast = {};
let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];

$('form').submit(function(e){
    e.preventDefault();
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+$('#city').val() +','+ $('option:selected', this).attr('id') +'&appid=0c8597f899f97d65766478ecb9ae2427')
    .then(response => response.json())
    .then(data => {
        searchResultsWeather = data;
        //adds city to savedCities local storage
        if(savedCities.indexOf(searchResultsWeather.name) === -1){
            console.log('city not found')
            savedCities.push(searchResultsWeather.name);
            localStorage.setItem("savedCities", JSON.stringify(savedCities));
        }
    });
    fetch('https://api.openweathermap.org/data/2.5/forecast?q='+$('#city').val() +','+ $('option:selected', this).attr('id') +'&appid=0c8597f899f97d65766478ecb9ae2427')
    .then(response => response.json())
    .then(data => {
        searchResultsForecast = data;
    });
});



//current and future
// section1 => city name + date, temp, wind, humidity, windspeed, colored uv index
//5 day forcast => date, icon weather, temp, wind, humidity