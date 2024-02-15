var APIKey = "88165551f94baa83f54ae537ddf65b43";
console.log("");
// URL to query the database

var searchForm = $("#search-form");
var searchInput = $("#search-input");
function handleSearchFormSubmit(e) {
  // Don't continue if there is nothing in the search form
  if (!searchInput.val()) {
    return;
  }

  e.preventDefault();
  var search = searchInput.val().trim();
  fetchCurrentWeather(search);
  fetchForecast(search);
  searchInput.val("");
}

searchForm.on("submit", handleSearchFormSubmit);

function fetchCurrentWeather(city) {
  var queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=10&appid=88165551f94baa83f54ae537ddf65b43`;

  //A Fetch call was created
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      // Extract latitude and longitude from the response
      var lat = data[0].lat;
      var lon = data[0].lon;

      // Use latitude and longitude to fetch current weather
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=88165551f94baa83f54ae537ddf65b43&units=metric`
      )
        .then(function (response) {
          return response.json();
        })

        .then(function (currentWeatherData) {
          displayCurrentWeather(currentWeatherData);
        })
        .catch(function (error) {
          console.error("Error fetching current weather data:", error);
        });
    });
}

// Function to display current weather
function displayCurrentWeather(data) {
  var city = data.name;
  var temperature = data.main.temp;
  var windSpeed = data.wind.speed;
  var humidity = data.main.humidity;

  console.log("City:", city);
  console.log("Temperature:", temperature + "°C");
  console.log("Humidity:", humidity + "%");
  console.log("Wind Speed:", windSpeed + "m/s");

  var todaySection = document.querySelector("#today");
  todaySection.innerHTML = `
    <h2>Current Weather in ${city}</h2>
    <p>Temp: ${temperature}°C</p>
    <p>Wind: ${windSpeed}m/s</p>
    <p>Humidity: ${humidity}%</p>
  `;
}

// Function to fetch forecast data
function fetchForecast(city) {
  var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`;

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderForecast(data.list);
    })
    .catch(function (error) {
      console.error("Error fetching forecast data:", error);
    });
}

function displayForecast(data) {
  console.log(data.city.name);
  var city = data.name;
  var temperature = data.main.temp;
  var windSpeed = data.wind.speed;
  var humidity = data.main.humidity;
}

var city = "London";
fetchCurrentWeather(city);
fetchForecast(city);

var forecastContainer = $("#forecast");
function renderForecastCard(forecast) {
  // variables for data from api
  var iconUrl =
    "https://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png";
  var iconDescription = forecast.weather[0].description;
  var tempC = forecast.main.temp;
  var humidity = forecast.main.humidity;
  var windKph = forecast.wind.speed;

  // Create elements for a card
  var col = $("<div>");
  var card = $("<div>");
  var cardBody = $("<div>");
  var cardTitle = $("<h5>");
  var weatherIcon = $("<img>");
  var tempEl = $("<p>");
  var windEl = $("<p>");
  var humidityEl = $("<p>");

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.attr("class", "col-md");
  col.addClass("five-day-card");
  card.attr("class", "bg-primary text-white");
  cardBody.attr("class", "card-body p-2");
  cardTitle.attr("class", "card-title");
  tempEl.attr("class", "card-text");
  windEl.attr("class", "card-text");
  humidityEl.attr("class", "card-text");

  // Add content to elements
  cardTitle.text(dayjs(forecast.dt_txt).format("D/M/YYYY"));
  weatherIcon.attr("src", iconUrl);
  weatherIcon.attr("alt", iconDescription);
  tempEl.text("Temp: " + tempC + " °C");
  windEl.text("Wind: " + windKph + " KPH");
  humidityEl.text("Humidity: " + humidity + " %");

  forecastContainer.append(col);
}

// Function to display 5 day forecast.
function renderForecast(dailyForecast) {
  var headingCol = $("<div>");
  var heading = $("<h4>");

  headingCol.attr("class", "col-12");
  heading.text("5-Day Forecast:");
  headingCol.append(heading);

  forecastContainer.html("");
  forecastContainer.append(headingCol);

  function atNoon(forecast) {
    return forecast.dt_txt.includes("12");
  }

  var futureForecast = dailyForecast.filter(atNoon);

  console.log(futureForecast);

  for (var i = 0; i < futureForecast.length; i++) {
    renderForecastCard(futureForecast[i]);
  }
}
