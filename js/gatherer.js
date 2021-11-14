"use strict";

// var apiUrl = 'http://13.80.18.173:8080/v1/';
var apiUrl = 'http://localhost:8080/v1/';

function updateTotalEmissions(thisMonth, previousMonth) {
    document.getElementById("dashboard-emissions-monthly").innerHTML = Math.round(thisMonth)/1000 + ' kg';

    const evolution = Math.round(thisMonth/previousMonth * 100) / 100;
    document.getElementById("dashboard-emissions-evolution").innerHTML =
        '<span  class="stat-cards-info__profit danger ">' +
            '<i data-feather="trending-up" aria-hidden="true"></i>+' + evolution + '%' +
        '</span>Last month';
}

function updateLastEmissionValue(area, value) {
    if (typeof value !== "undefined") {
        var flag = 'danger';

        if (value < 25) {
            flag = 'success';
        } else if (value < 50) {
            flag = 'warning';
        }

        document.getElementById("area-" + area + "-last-emission-value").innerHTML =
            '<span  class="stat-cards-info__profit ' + flag + '">' +
            '<i data-feather="cloud" aria-hidden="true"></i>' + value + ' μg/m³' +
            '</span>';
    } else {
        document.getElementById("area-" + area + "-last-emission-value").innerHTML =
            '<span  class="stat-cards-info__profit danger ">' +
            '<i data-feather="warning" aria-hidden="true"></i> Sensor not available' +
            '</span>';
    }
}

async function updateAllEmissionValues() {
    const one_day_from_now = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const one_week_from_then = new Date(one_day_from_now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const one_month_from_then = new Date(one_day_from_now.getTime() - 31 * 24 * 60 * 60 * 1000);
    const two_months_from_then = new Date(one_day_from_now.getTime() - 62 * 24 * 60 * 60 * 1000);

    let this_month_total_emissions = 0;
    let previous_month_total_emissions = 0;

    for (let area = 1; area <= 6; area++) {
        const response = await fetch(apiUrl + 'emissions/' + area);
        const data = await response.json();

        if (data.length > 0) {
            updateLastEmissionValue(area, data[0].no2_level);
        } else {
            updateLastEmissionValue(area, undefined);
        }

        const last_week = [];

        for (var i = 0; i < data.length; i++) {
            var entry_date = new Date(data[i].timestamp);
            if (entry_date < one_day_from_now) {
                if (entry_date > one_week_from_then) {
                    last_week.push(data[i]);
                    this_month_total_emissions += data[i].no2_level;
                } else if (entry_date > one_month_from_then) {
                    this_month_total_emissions += data[i].no2_level;
                } else if (entry_date > two_months_from_then) {
                    previous_month_total_emissions += data[i].no2_level;
                } else {
                    break;
                }
            }
        }
    }

    updateTotalEmissions(this_month_total_emissions, previous_month_total_emissions);
}

async function updateDataPointsAvailable() {
    const response = await fetch(apiUrl + 'data-points');
    const data = await response.json();

    document.getElementById("dashboard-available-data-points").innerHTML = data;
}


async function updateLastUpdate() {
    const response = await fetch(apiUrl + 'last-update');
    const data = await response.json();

    document.getElementById("dashboard-last-update").innerHTML =
        't ' + new Date(data).toTimeString().substring(0, 8);
}


updateAllEmissionValues();
updateDataPointsAvailable();
updateLastUpdate();
