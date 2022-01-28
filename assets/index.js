//api search https://www.loc.gov/
let searchResultsWeather = {};
let searchResultsForecast = {};
$('form').submit(function(e){
    e.preventDefault();
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+$('#city').val() +','+ $('option:selected', this).attr('id') +'&appid=0c8597f899f97d65766478ecb9ae2427')
    .then(response => response.json())
    .then(data => {
        searchResultsWeather = data;
        console.log(searchResultsWeather);
    });
    fetch('https://api.openweathermap.org/data/2.5/forecast?q='+$('#city').val() +','+ $('option:selected', this).attr('id') +'&appid=0c8597f899f97d65766478ecb9ae2427')
    .then(response => response.json())
    .then(data => {
        searchResultsForecast = data;
        console.log(searchResultsForecast);
    });
});

//current and future
// section1 => city name + date, temp, wind, humidity, windspeed, colored uv index
//5 day forcast => date, icon weather, temp, wind, humidity