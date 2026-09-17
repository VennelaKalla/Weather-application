const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// =========================
// HOME ROUTE
// =========================

app.get("/", function (req, res) {
    res.send("Weather API Server is running");
});


// =========================
// WEATHER API
// =========================

app.get("/weather", async function (req, res) {

    try {

        const city = req.query.city;

        if (!city) {
            return res.status(400).json({
                message: "Please provide a city name"
            });
        }


        // =========================
        // CALL OPENWEATHER API
        // =========================

        const response = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            {
                params: {
                    q: city,
                    appid: process.env.WEATHER_API_KEY,
                    units: "metric"
                }
            }
        );


        const weatherData = response.data;


        // =========================
        // WEATHER DATA
        // =========================

        const cityName = weatherData.name;

        const temperature = weatherData.main.temp;

        const feelsLike = weatherData.main.feels_like;

        const minTemperature = weatherData.main.temp_min;

        const maxTemperature = weatherData.main.temp_max;

        const humidity = weatherData.main.humidity;

        const pressure = weatherData.main.pressure;

        const visibility = weatherData.visibility
            ? weatherData.visibility / 1000
            : 0;

        const windSpeed = weatherData.wind
            ? weatherData.wind.speed
            : 0;

        const weatherDescription =
            weatherData.weather[0].description;

        const weatherIcon =
            weatherData.weather[0].icon;


        // =========================
        // SEND RESPONSE
        // =========================

        res.json({

            message: "Weather data fetched successfully",

            city: cityName,

            temperature: temperature,

            feelsLike: feelsLike,

            minTemperature: minTemperature,

            maxTemperature: maxTemperature,

            humidity: humidity,

            pressure: pressure,

            visibility: visibility,

            windSpeed: windSpeed,

            weather: weatherDescription,

            weatherIcon: weatherIcon

        });

    }

    catch (error) {

        console.log(
            "Weather API error:",
            error.message
        );

        res.status(500).json({

            message: "Unable to fetch weather data",

            error: error.response
                ? error.response.data
                : error.message

        });

    }

});


// =========================
// START SERVER
// =========================

app.listen(
    PORT,
    "0.0.0.0",
    function () {

        console.log(
            "Server running on port " + PORT
        );

    }
);