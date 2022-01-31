//api search https://www.loc.gov/
let searchResultsWeather = {};
//adds city to savedCities local storage
let savedCities = JSON.parse(localStorage.getItem("savedCities")) || {};
let savedCountries = JSON.parse(localStorage.getItem("savedCountries")) || { toronto: "ca" };
let lat = 0;
let lon = 0;

//adds saved cities to dashboard
let loadSavedCities = () => {
    Object.keys(savedCities).forEach(city => {
        $('#saved-cities').append(` <button class="btn btn-secondary w-100 mt-1 city-button" id="${city},${savedCities[city]}">
                                        ${city.charAt(0).toUpperCase() + city.slice(1)}
                                    </button>`
        );
    });
}
let displayCurrentWeather = (data, cityName) => {
    $('#current-city-date-icon').text(cityName.charAt(0).toUpperCase() + cityName.slice(1) + ', ' + moment().format("(MMM/Do/YYYY)"));
    //sets attribut 'src' to icon url
    $('#current-icon').attr('src', 'http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png');
    $('#current-temp').text(Math.round(data.current.temp) + '°C');
    $('#current-humidity').text(data.current.humidity + '%');
    $('#current-wind').text(data.current.wind_speed + ' KPH');
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

let displayForecast = (data, cityName, countryId) => {
    $('#forecast-container').empty();
    //DATE
    //ICON
    //TEMP
    //WIND
    //HUMIDITY
    for (day in data.daily) {
        if (day < 5) {
            $('#forecast-container').append(`<div class="card col-sm-2 m-2">` +
                `<h5 class="card-header">${moment().add(data.daily[day].dt, 'hours').format("dddd")}</h5>` +
                `<img class="card-img-top" src="http://openweathermap.org/img/wn/${data.daily[day].weather[0].icon}@2x.png");` +
                `<div class="card-body">` +
                `<p class="card-text">${Math.round(data.daily[day].temp.day)}°C</p>` +
                `<p class="card-text">${data.daily[day].wind_speed} KPH</p>` +
                `<p class="card-text">${data.daily[day].humidity}%</p>` +
                `</div>` +
                `</div>`
            );
        }
    };
}

//$('#city').val()
//$('option:selected', this).attr('id')
let getInfo = (cityName, countryId) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=` + cityName + ',' + countryId + `&appid=0c8597f899f97d65766478ecb9ae2427`)
        .then(response => {
            if (response.ok) {
                response.json().then((data) => {
                    lat = data.city.coord.lat;
                    lon = data.city.coord.lon;
                    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=` + lat + `&lon=` + lon + `&units=metric&appid=0c8597f899f97d65766478ecb9ae2427`)
                        .then(response => response.json())
                        .then(data => {
                            searchResultsWeather = data;
                            //adds city button to id saved-cities
                            if (!savedCities[cityName]) {
                                savedCities[cityName] = countryId;
                                localStorage.setItem("savedCities", JSON.stringify(savedCities));
                                $('#saved-cities').append(`<button class="btn btn-secondary w-100 mt-1 city-button" id="` + cityName + "," + savedCities[cityName] + `">` + cityName.charAt(0).toUpperCase() + cityName.slice(1) + `</button>`);
                            }
                            displayCurrentWeather(searchResultsWeather, cityName, countryId);
                            displayForecast(searchResultsWeather, cityName, countryId);

                        });
                })
            } else {
                alert("City does not exist")
            }
        })
}



$('form').submit(function (e) {
    e.preventDefault();
    getInfo($('#city').val(), $('option:selected').attr('id'));
});

//applies to every button that is a child of id saved-cities
$('#saved-cities').on('click', '.city-button', function () {
    getInfo(this.id.substring(0, this.id.indexOf(",")), this.id.substring(this.id.indexOf(",") + 1));
});



let init = () => {
    loadSavedCities();
}
init();


//current and future
// section1 => city name + date, temp, wind, humidity, windspeed, colored uv index
//5 day forcast => date, icon weather, temp, wind, humidity