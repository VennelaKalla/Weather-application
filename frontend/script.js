// =================================
// GET WEATHER
// =================================

async function getWeather() {

    const cityInput =
        document.getElementById("cityInput");

    const city =
        cityInput.value.trim();

    const message =
        document.getElementById("message");

    const weatherResult =
        document.getElementById("weatherResult");

    const loader =
        document.getElementById("loader");


    if (!city) {

        message.textContent =
            "Please enter a city name.";

        weatherResult.style.display =
            "none";

        return;
    }


    message.textContent = "";

    weatherResult.style.display =
        "none";

    loader.style.display =
        "block";


    try {

        const url =
            "http://localhost:5000/weather?city=" +
            encodeURIComponent(city);


        const response =
            await fetch(url);


        const data =
            await response.json();


        console.log(
            "Weather response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.error?.message ||
                data.error ||
                data.message ||
                "Unable to fetch weather"
            );

        }


        document
            .getElementById("city")
            .textContent =
            data.city;


        document
            .getElementById("temperature")
            .textContent =
            Math.round(data.temperature);


        document
            .getElementById("feelsLike")
            .textContent =
            Math.round(data.feelsLike);


        document
            .getElementById("maxTemperature")
            .textContent =
            Math.round(data.maxTemperature);


        document
            .getElementById("minTemperature")
            .textContent =
            Math.round(data.minTemperature);


        document
            .getElementById("humidity")
            .textContent =
            data.humidity;


        document
            .getElementById("pressure")
            .textContent =
            data.pressure;


        document
            .getElementById("visibility")
            .textContent =
            Number(data.visibility).toFixed(1);


        document
            .getElementById("windSpeed")
            .textContent =
            Number(data.windSpeed).toFixed(1);


        document
            .getElementById("weather")
            .textContent =
            data.weather;


        // Dew Point calculation

        const temperature =
            Number(data.temperature);

        const humidity =
            Number(data.humidity);

        const dewPoint =
            temperature -
            ((100 - humidity) / 5);


        document
            .getElementById("dewPoint")
            .textContent =
            Math.round(dewPoint);


        // Weather icon

        const weatherIcon =
            document.getElementById(
                "weatherIcon"
            );


        if (data.weatherIcon) {

            weatherIcon.src =
                "https://openweathermap.org/img/wn/" +
                data.weatherIcon +
                "@2x.png";

            weatherIcon.alt =
                data.weather;

        }


        // Date and time

        updateDateTime();


        loader.style.display =
            "none";


        weatherResult.style.display =
            "block";


        weatherResult.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    catch (error) {

        console.error(
            "Weather request failed:",
            error
        );


        loader.style.display =
            "none";


        weatherResult.style.display =
            "none";


        message.textContent =
            "Error: " +
            error.message;

    }

}


// =================================
// DATE AND TIME
// =================================

function updateDateTime() {

    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }
        );


    const date =
        now.toLocaleDateString(
            [],
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    document
        .getElementById("currentTime")
        .textContent =
        time;


    document
        .getElementById("currentDate")
        .textContent =
        date;


    document
        .getElementById("currentDateTime")
        .textContent =
        now.toLocaleString();

}


// =================================
// ENTER KEY
// =================================

document
    .getElementById("cityInput")
    .addEventListener(
        "keypress",
        function(event) {

            if (event.key === "Enter") {

                getWeather();

            }

        }
    );
