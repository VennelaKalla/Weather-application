let dashboardHistory = [];


async function getDashboardHistory() {

    const table =
        document.getElementById("dashboardTable");

    try {

        const response =
            await fetch("http://localhost:5000/history");

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                data.message ||
                "Unable to load history"
            );
        }

        dashboardHistory = data;

        updateStatistics(data);

        displayDashboardHistory(data);

    } catch (error) {

        console.error(
            "Dashboard history error:",
            error
        );

        table.innerHTML =
            "<tr><td colspan='5'>Unable to load weather history</td></tr>";
    }
}


function updateStatistics(data) {

    const totalCities =
        document.getElementById("totalCities");

    const averageTemperature =
        document.getElementById("averageTemperature");

    const averageHumidity =
        document.getElementById("averageHumidity");


    if (data.length === 0) {

        totalCities.textContent = "0";
        averageTemperature.textContent = "0 °C";
        averageHumidity.textContent = "0%";

        return;
    }


    totalCities.textContent = data.length;


    let temperatureTotal = 0;
    let humidityTotal = 0;


    data.forEach(function (record) {

        temperatureTotal +=
            Number(record.temperature);

        humidityTotal +=
            Number(record.humidity);

    });


    const avgTemperature =
        temperatureTotal / data.length;

    const avgHumidity =
        humidityTotal / data.length;


    averageTemperature.textContent =
        avgTemperature.toFixed(1) + " °C";

    averageHumidity.textContent =
        avgHumidity.toFixed(1) + "%";
}


function displayDashboardHistory(data) {

    const table =
        document.getElementById("dashboardTable");

    table.innerHTML = "";


    if (data.length === 0) {

        table.innerHTML =
            "<tr><td colspan='5'>No weather history found</td></tr>";

        return;
    }


    data.forEach(function (record) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${record.city}</td>
            <td>${record.temperature} °C</td>
            <td>${record.humidity}%</td>
            <td>${record.weather}</td>
            <td>${new Date(record.created_at).toLocaleString()}</td>
        `;


        table.appendChild(row);

    });
}


function filterDashboardHistory() {

    const searchText =
        document.getElementById("historySearch")
            .value
            .trim()
            .toLowerCase();


    const filteredData =
        dashboardHistory.filter(function (record) {

            return record.city
                .toLowerCase()
                .includes(searchText);

        });


    displayDashboardHistory(filteredData);
}


async function clearDashboardHistory() {

    const confirmed =
        confirm(
            "Are you sure you want to delete all weather history?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                "http://localhost:5000/history",
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                data.message
            );

        }


        alert(data.message);

        getDashboardHistory();


    } catch (error) {

        console.error(
            "Clear dashboard history error:",
            error
        );

        alert(
            "Unable to clear weather history"
        );
    }
}


function goToWeather() {

    window.location.href = "index.html";

}


window.onload = function () {

    getDashboardHistory();

};


document.getElementById("historySearch")
    .addEventListener(
        "input",
        function () {

            filterDashboardHistory();

        }
    );
