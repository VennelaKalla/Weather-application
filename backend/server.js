const express = require("express");
const axios = require("axios");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());


// ===============================
// MYSQL CONNECTION
// ===============================

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "weather_db"
});

db.connect(function (err) {

    if (err) {

        console.log(
            "MySQL connection failed:",
            err.message
        );

        return;
    }

    console.log(
        "MySQL connected successfully"
    );
});


// ===============================
// HOME
// ===============================

app.get("/", function (req, res) {

    res.send(
        "Weather API Server is running"
    );

});


// ===============================
// GET WEATHER
// ===============================

app.get("/weather", async function (req, res) {

    try {

        const city = req.query.city;

        if (!city) {

            return res.status(400).json({
                message: "Please provide a city name"
            });

        }


        // ===============================
        // OPENWEATHER API
        // ===============================

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


        // ===============================
        // WEATHER DATA
        // ===============================

        const weatherData =
            response.data;

        const cityName =
            weatherData.name;

        const temperature =
            weatherData.main.temp;

        const feelsLike =
            weatherData.main.feels_like;

        const minTemperature =
            weatherData.main.temp_min;

        const maxTemperature =
            weatherData.main.temp_max;

        const humidity =
            weatherData.main.humidity;

        const pressure =
            weatherData.main.pressure;

        const visibility =
            weatherData.visibility
                ? weatherData.visibility / 1000
                : 0;

        const windSpeed =
            weatherData.wind
                ? weatherData.wind.speed
                : 0;

        const weatherDescription =
            weatherData.weather[0].description;

        const weatherIcon =
            weatherData.weather[0].icon;
        // ===============================

                city,
                temperature,
                humidity,
                weather
            )
            VALUES (?, ?, ?, ?)

            ON DUPLICATE KEY UPDATE

                temperature = VALUES(temperature),

                humidity = VALUES(humidity),

                weather = VALUES(weather),

                created_at = CURRENT_TIMESTAMP
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

                    console.log(
                        "Database error:",
                        err.message
                    );

                    return res.status(500).json({

                        message:
                            "Database error",

                    });

                }


                // ===============================
                // SEND DATA TO FRONTEND
                // ===============================

                res.json({

                    message:
                        "Weather data fetched and saved successfully",

                    city:
                        cityName,

                    temperature:
                        temperature,

                    feelsLike:
                        feelsLike,

                    minTemperature:
                        minTemperature,

                    maxTemperature:
                        maxTemperature,

                    humidity:
                        humidity,

                    pressure:
                        pressure,

                    visibility:
                        visibility,

                    windSpeed:
                        windSpeed,

                    weather:
                        weatherDescription,

                    weatherIcon:
                        weatherIcon

                });

            }
        );

    }

    catch (error) {
            error:
                error.response
                    ? error.response.data
                    : error.message

        });

    }

});


// ===============================
// WEATHER HISTORY
// ===============================

app.get("/history", function (req, res) {

    const sql =
        "SELECT * FROM weather ORDER BY created_at DESC";


    db.query(
        sql,
        function (err, results) {

            if (err) {

                console.log(
                    "History error:",
                    err.message
                );

                return res.status(500).json({

                    message:
                        "Unable to fetch weather history",

                    error:
                        err.message

                });

            }


            res.json(results);

        }
    );

});


// ===============================
// CLEAR HISTORY
// ===============================

app.delete("/history", function (req, res) {

    const sql =
        "DELETE FROM weather";


    db.query(
            if (err) {

                console.log(
                    "Clear history error:",
                return res.status(500).json({

                    error:
                        err.message

                });

            }

                message:
                    "Weather history cleared successfully"

            });

        }
    );

});


// ===============================
// START SERVER
// ===============================

app.listen(
    PORT,
    function () {

        console.log(
            "Server running on http://localhost:" +
            PORT
        );

    }
);
            res.json({

                    message:
                        "Unable to clear weather history",

                    err.message
                );

        sql,
        function (err) {


        );


            message:
                "Unable to fetch weather data",


        res.status(500).json({
        console.log(
            "Weather API error:",
            error.message

                        error:
                            err.message
        const sql = `
            INSERT INTO weather
            (

        // ===============================
        // SAVE TO MYSQL

