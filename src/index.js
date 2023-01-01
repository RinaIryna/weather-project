function formatDate(currentDate) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[currentDate.getDay()];
  let hours = currentDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = currentDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day}, ${hours}:${minutes}`;
}

let currentDate = new Date();
let date = document.querySelector("#date");
date.innerHTML = formatDate(currentDate);

let form = document.querySelector("#city-form");
form.addEventListener("submit", showCity);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function showForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
     <div class="col-2">
      <div class="forecast-date">${formatDay(forecastDay.time)}</div>
      <img
        src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
          forecastDay.condition.icon
        }.png"
        alt=""
        width="55"
      />
      <div class="forecast-temp">
        <span id="temp-max">${Math.round(
          forecastDay.temperature.maximum
        )}°</span>
        <span id="temp-min"> ${Math.round(
          forecastDay.temperature.minimum
        )}°</span>
      </div>
    </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(city) {
  let apiKey = "455oacet7aef1edf2718f68b30434d00";
  let units = "metric";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showForecast);
}

function showTemperature(response) {
  document.querySelector("#city").innerHTML = response.data.city;

  document.querySelector("#correct-temp").innerHTML = Math.round(
    response.data.temperature.current
  );

  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.temperature.humidity
  );

  document.querySelector("#weather").innerHTML =
    response.data.condition.description;

  document
    .querySelector("#weather-icon")
    .setAttribute(
      "src",
      `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
    );

  document
    .querySelector("#weather-icon")
    .setAttribute("alt", response.data.condition.description);

  getForecast(response.data.city);

  celsiusTemp = response.data.temperature.current;
}

function searchCity(city) {
  let apiKey = "455oacet7aef1edf2718f68b30434d00";
  let units = "metric";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
}

function showCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function showPosition(position) {
  let apiKey = "455oacet7aef1edf2718f68b30434d00";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&units=${units}&key=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}

function currentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let locationButton = document.querySelector("#location");
locationButton.addEventListener("click", currentLocation);

function showFahrenheitTemp(event) {
  event.preventDefault();
  let fahrenheitElement = document.querySelector("#correct-temp");
  let fahrenheitTemp = Math.round(celsiusTemp * 1.8 + 32);
  fahrenheitElement.innerHTML = `${fahrenheitTemp}`;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

let celsiusTemp = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

function showCelsiusTemp(event) {
  event.preventDefault();
  let celsiusElement = document.querySelector("#correct-temp");
  celsiusElement.innerHTML = Math.round(celsiusTemp);
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
}

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemp);

searchCity("Helsinki");
