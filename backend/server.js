const express = require("express");
const axios = require("axios");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


// =========================
// MYSQL CONNECTION
// =========================

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "weather_user",
    password: process.env.MYSQL_PASSWORD,
    database: "weather_app"
});


// =========================
// MYSQL CONNECTION TEST
// =========================

db.connect(function (err) {
    if (err) {
        console.error("MySQL connection failed:", err.message);
    } else {
        console.log("MySQL connected successfully");
    }
});


// =========================
// HEALTH CHECK
// =========================

app.get("/", function (req, res) {
    console.log("GET / request received");
    res.status(200).send("Weather API Server is running");
});

// =========================
// WEATHER API
// =========================

app.get("/weather", async function (req, res) {

    const city = req.query.city;

    if (!city) {
        return res.status(400).json({
            message: "Please provide a city name"
        });
    }

    try {

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
        // SAVE TO MYSQL
        // =========================

        const sql = `
            INSERT INTO weather_searches
            (city, temperature, humidity, weather_conditions)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                cityName,
                temperature,
                humidity,
                weatherDescription
            ],
            function (err) {

                if (err) {
                    console.error(
                        "Database error:",
                        err.message
                    );

                    return res.status(500).json({
                        message: "Database error",
                        error: err.message
                    });
                }

                res.json({
                    message:
                        "Weather data fetched and saved successfully",
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
        );

    } catch (error) {

        console.error(
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
// WEATHER HISTORY
// =========================

app.get("/history", function (req, res) {

    const sql =
        "SELECT * FROM weather_searches ORDER BY searched_at DESC";

    db.query(
        sql,
        function (err, results) {

            if (err) {

                console.error(
                    "History error:",
                    err.message
                );

                return res.status(500).json({
                    message:
                        "Unable to fetch weather history",
                    error: err.message
                });

            }

            res.json(results);

        }
    );

});


// =========================
// CLEAR HISTORY
// =========================

app.delete("/history", function (req, res) {

    const sql =
        "DELETE FROM weather_searches";

    db.query(
        sql,
        function (err) {

            if (err) {

                console.error(
                    "Clear history error:",
                    err.message
                );

                return res.status(500).json({
                    message:
                        "Unable to clear weather history",
                    error: err.message
                });

            }

            res.json({
                message:
                    "Weather history cleared successfully"
            });

        }
    );

});


// =========================
// START SERVER
// =========================

app.listen(PORT, "0.0.0.0", function () {

    console.log(
        "Server running on http://localhost:" + PORT
    );

});
