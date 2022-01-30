//api search https://www.loc.gov/
let searchResultsWeather = {};
let searchResultsForecast = {};
//adds city to savedCities local storage
let savedCities = JSON.parse(localStorage.getItem("savedCities")) || {};
let savedCountries = JSON.parse(localStorage.getItem("savedCountries")) || { toronto: "ca" };
let lat = 0;
let lon = 0;

//adds saved cities to dashboard
let loadSavedCities = () => {
    Object.keys(savedCities).forEach(city => {
        $('#saved-cities').append(` <button class="btn btn-secondary w-100 mt-1" id="${city},${savedCities[city]}" onclick="getForecast(this.id)">
                                        ${city.charAt(0).toUpperCase() + city.slice(1)}
                                    </button>`
        );
    });
}
//$('#city').val()
//$('option:selected', this).attr('id')
let getInfo = (cityName, countryId) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=` + $('#city').val() + ',' + $('option:selected').attr('id') + `&appid=0c8597f899f97d65766478ecb9ae2427`)
        .then(response => {

            if (response.ok) {
                response.json().then((data) => {
                    lat = data.city.coord.lat;
                    lon = data.city.coord.lon;
                    savedCities[cityName] = countryId;
                    localStorage.setItem("savedCities", JSON.stringify(savedCities));
                    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=` + lat + `&lon=` + lon + `&units=metric&appid=0c8597f899f97d65766478ecb9ae2427`)
                        .then(response => response.json())
                        .then(data => {
                            searchResultsWeather = data;
                            //adds city button to id saved-cities
                            $('#saved-cities').append(`<button class="btn btn-secondary w-100 mt-1" id="`+countryId+`" onclick="getForecast(this.id)">`+cityName.charAt(0).toUpperCase() + cityName.slice(1)+`</button>`);
                            displayCurrentWeather(searchResultsWeather, cityName);
                        });
                    // fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + $('#city').val() + ',' + $('option:selected', this).attr('id') + '&appid=0c8597f899f97d65766478ecb9ae2427')
                    //     .then(response => response.json())
                    //     .then(data => {
                    //         searchResultsForecast = data;
                    //     });
                })
            } else {
                alert("City does not exist")
            }
        })
}

let displayCurrentWeather = (data, cityName) => {
    $('#current-city-date-icon').text(cityName.charAt(0).toUpperCase() + cityName.slice(1) + ', ' + moment().format("(MMM/Do/YYYY)"));
    //sets attribut 'src' to icon url
    $('#current-icon').attr('src', 'http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png');
    $('#current-temp').text(Math.round(data.current.temp) + '°F');
    $('#current-humidity').text(data.current.humidity + '%');
    $('#current-wind').text(data.current.wind_speed + ' mph');
    //uv with color coding
    $('#current-uv').text(data.current.uvi);
    if (data.current.uvi <= 2) {
        $('#current-uv').css('background-color', 'lightgreen');
        $('#current-uv').css('border-radius', '25%');
        $('#current-uv').css('padding', '5px');
    } else if (data.current.uvi <= 5) {
        $('#current-uv').css('background-color', 'yellow');
        $('#current-uv').css('border-radius', '25%');
        $('#current-uv').css('padding', '5px');
    } else if (data.current.uvi <= 7) {
        $('#current-uv').css('background-color', 'orange');
        $('#current-uv').css('border-radius', '25%');
        $('#current-uv').css('padding', '5px');
    } else if (data.current.uvi <= 10) {
        $('#current-uv').css('background-color', 'red');
        $('#current-uv').css('border-radius', '25%');
        $('#current-uv').css('padding', '5px');
    }

}

$('form').submit(function (e) {
    e.preventDefault();
    getInfo($('#city').val(), $('option:selected').attr('id'));


});



let init = () => {
    loadSavedCities();
}
init();


//current and future
// section1 => city name + date, temp, wind, humidity, windspeed, colored uv index
//5 day forcast => date, icon weather, temp, wind, humidity