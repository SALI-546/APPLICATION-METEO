function showError(message) {
    var error = '<div class="alert alert-danger alert-dismissible text-center" role="alert">';
    error += '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
    error += message + '</div>';
    document.getElementById('error').innerHTML = error;
}

function getWeather(city) {
    if (city) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    try {
                        var formattedData = formatWeather(JSON.parse(xhr.responseText));
                        document.getElementById("weather-data").innerHTML = formattedData;
                        document.getElementById('cityname').value = "";
                    } catch (e) {
                        showError("Error parsing weather data. Please try again.");
                    }
                } else if (this.status == 404) {
                    showError("City not found. Please check the spelling and try again.");
                } else if (this.status == 401) {
                    showError("API key is invalid. Please contact the administrator.");
                } else if (this.status == 429) {
                    showError("Too many requests. Please wait a moment and try again.");
                } else {
                    showError("Failed to fetch weather data. Please try again later.");
                }
            }
        };
        // Note: In production, API key should be stored server-side
        // This is a placeholder - replace with your actual API key or implement server-side proxy
        const API_KEY = "YOUR_API_KEY_HERE"; // Replace with actual API key
        xhr.open("GET", "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + API_KEY);
        xhr.send();
    } else {
        showError("You must enter a city name!");
    }
    return false;
}

function formatWeather(data) {
    return "<h3>Current Weather for " + data.name + ", " + data.sys.country + "</h3>" + 
           "<p>Weather: " + data.weather[0].main + "</p>" + 
           "<p>Weather Description: " + data.weather[0].description + 
           "<img src='https://openweathermap.org/img/w/" + data.weather[0].icon + ".png'/></p>" + 
           "<p>Temperature: " + data.main.temp + "&deg;C</p>" + 
           "<p>Pressure: " + data.main.pressure + " hPa</p>" + 
           "<p>Humidity: " + data.main.humidity + "%</p>" + 
           "<p>Min Temperature: " + data.main.temp_min + "&deg;C</p>" + 
           "<p>Max Temperature: " + data.main.temp_max + "&deg;C</p>" + 
           "<p>Wind Speed: " + data.wind.speed + " m/s</p>";
}

function getForecast(city, days) {
    if (!city) {
        showError("You must enter a city name!");
        return false;
    }
    if (!days || isNaN(days) || days < 1 || days > 16) {
        showError("Please enter a valid number of days (1-16)!");
        return false;
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                try {
                    var formattedData = formatForecast(JSON.parse(xhr.responseText));
                    document.getElementById("forecast-data").innerHTML = formattedData;
                    document.getElementById('cityname').value = "";
                    document.getElementById('days').value = "";
                } catch (e) {
                    showError("Error parsing forecast data. Please try again.");
                }
            } else if (this.status == 404) {
                showError("City not found. Please check the spelling and try again.");
            } else if (this.status == 401) {
                showError("API key is invalid. Please contact the administrator.");
            } else if (this.status == 429) {
                showError("Too many requests. Please wait a moment and try again.");
            } else {
                showError("Failed to fetch forecast data. Please try again later.");
            }
        }
    };
    // Note: In production, API key should be stored server-side
    // This is a placeholder - replace with your actual API key or implement server-side proxy
    const API_KEY = "YOUR_API_KEY_HERE"; // Replace with actual API key
    xhr.open("GET", "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&cnt=" + days + "&units=metric&appid=" + API_KEY);
    xhr.send();
    return false;
}

function formatForecast(data) {
    var table = "";
    for (var i = 0; i < data.list.length; i++) {
        table += "<tr>";
        table += "<td><img src='https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png'/></td>";
        table += "<td>" + data.list[i].weather[0].main + "</td>";
        table += "<td>" + data.list[i].weather[0].description + "</td>";
        table += "<td>" + data.list[i].temp.morn + "&deg;C</td>";
        table += "<td>" + data.list[i].temp.night + "&deg;C</td>";
        table += "<td>" + data.list[i].temp.min + "&deg;C</td>";
        table += "<td>" + data.list[i].temp.max + "&deg;C</td>";
        table += "<td>" + data.list[i].pressure + " hPa</td>";
        table += "<td>" + data.list[i].humidity + "%</td>";
        table += "<td>" + data.list[i].speed + " m/s</td>";
        table += "</tr>";
    }
    return table;
}
