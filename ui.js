const submitButton = document.querySelector(".submit");
const modeButton = document.querySelector(".change_mode");
const currentMode = document.querySelector(".current_mode");
const instructions = document.querySelector(".instructions");
const tempDetails = document.querySelector(".temp_details");
const currentTemp = document.querySelector(".current_temp");
const modeImage = document.querySelector(".mode_image");
const weather = document.querySelector(".weather");
const lowHigh = document.querySelector(".low_high");
const locDate = document.querySelector(".loc_date");
const loc = document.querySelector(".location");
const date = document.querySelector(".date");
const form = document.querySelector("form");
const weatherImage = document.querySelector(".weather_image");
const deg = '\u00B0'

const getLowHighTemp = (forecast) => {
  const highTemp = forecast[0].temperature;
  const lowTemp = forecast[1].temperature;
  return { highTemp: `${highTemp}${deg}${forecast[0].temperatureUnit}`, lowTemp: `${lowTemp}${deg}${forecast[1].temperatureUnit}` };
}

const displayTempDetails = (temperatures, hours) => {
  const { highTemp, lowTemp } = temperatures;
  const today = new Date();
  const currentForecast = hours.filter((period) => {
    let currentPeriodStartTime = new Date(period.startTime);
    let currentPeriodEndTime = new Date(period.endTime);
    return today.getDate() === currentPeriodStartTime.getDate() && currentPeriodStartTime <= today && today <= currentPeriodEndTime
  });
  weatherImage.setAttribute("src", currentForecast[0].icon);
  weatherImage.setAttribute("alt", currentForecast[0].shortForecast);
  instructions.style.display = "none";
  tempDetails.style.display = "flex";
  weather.textContent = `${currentForecast[0].shortForecast}`
  lowHigh.textContent = `Low ${lowTemp} / High ${highTemp}`
  currentTemp.textContent = `${currentForecast[0].temperature}${deg}${currentForecast[0].temperatureUnit}`
}

const displayLocDate = (zone) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  locDate.style.display = "flex";
  loc.textContent = `${zone.properties.name}, ${zone.properties.state}`
  const currentDate = new Date();
  const day = days[currentDate.getDay()];
  const today = currentDate.getDate();
  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleDateString('en-US', {month: 'short'});
  date.textContent = `${day} ${today} ${month} ${year}`;
}

const handleSubmit = async (event) => {
  event.preventDefault();
  const zipCode = document.querySelector('.zip_code').value;
  // is there an api for the zip code converter? I just hardcoded the longitude and latitude based on 94103 zib code for now. But ideally I can dynamically put in the longitude and latitude  bellow.
  try {
    const pointsResult = await fetch(`https://api.weather.gov/points/37.77550,-122.41292`, {
      method: "GET"
    })
    const forecastPoints = await pointsResult.json();
    const forecastPropertiesResult = await fetch(`${forecastPoints.properties.forecast}`, {
      method: "GET"
    })
    const forecastPeriods = await forecastPropertiesResult.json();
    const forecastHourlyResult = await fetch(`${forecastPoints.properties.forecastHourly}`, {
      method: "GET"
    })
    const forecastHourly = await forecastHourlyResult.json();
    const forecastZoneResult = await fetch(`${forecastPoints.properties.forecastZone}`, {
      method: "GET"
    })
    const forecastZone = await forecastZoneResult.json();
    const temperatures = getLowHighTemp(forecastPeriods.properties.periods);
    displayTempDetails(temperatures, forecastHourly.properties.periods);
    displayLocDate(forecastZone);
  } catch (e) {
    throw e;
  }
}

const toggleMode = (event) => {
  event.preventDefault();
  form.classList.toggle("light_mode");
  modeButton.classList.toggle("dark_mode");
  currentMode.classList.toggle("move_right")
  const mode = modeImage.getAttribute("src");
  if (mode === "./public/assests/sun.png") {
    modeImage.setAttribute("src", "./public/assests/moon.png");
  } else {
    modeImage.setAttribute("src", "./public/assests/sun.png");
  }
}

submitButton.addEventListener('click', (event) => handleSubmit(event))
modeButton.addEventListener('click', (event) => toggleMode(event));