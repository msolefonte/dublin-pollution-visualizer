"use strict";

var apiUrl = 'http://localhost:8080/v1/';

function updateTotalEmissions(thisMonth, previousMonth) {
    if (document.getElementById("dashboard-emissions-monthly")) {
        document.getElementById("dashboard-emissions-monthly").innerHTML = Math.round(thisMonth) / 1000 + ' kg';

        const evolution = Math.round(thisMonth / previousMonth * 100) / 100;
        document.getElementById("dashboard-emissions-evolution").innerHTML =
            '<span  class="stat-cards-info__profit danger ">' +
            '<i data-feather="trending-up" aria-hidden="true"></i>+' + evolution + '%' +
            '</span>Last month';
    }
}

function updateLastEmissionValue(area, value) {
    if (document.getElementById("area-" + area + "-last-emission-value")) {
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
}



function updateColor(chart, firstCall) {
    const darkMode = localStorage.getItem('darkMode');

    let titleColor;

    if (darkMode === 'enabled') {
        titleColor = '#EFF0F6';
    } else {
        titleColor = '#171717';
    }

    chart.options.plugins.title.color = titleColor;
    chart.update();
}

function updateEmissionsChart(labels, normalized_emissions, emissions, traffic) {
    const options = {
            spanGaps: 1000 * 60 * 60 * 24 * 2, // 2 days
            responsive: true,
            scales: {
                x: [{
                    type: 'time',
                    title: {
                        display: true,
                        text: 'Date'
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                        major: {
                            enabled: true
                        },
                        font: function (context) {
                            if (context.tick && context.tick.major) {
                                return {
                                    weight: 'bold',
                                };
                            }
                        }
                    }
                }]
            },
            elements: {
                point: {
                    radius: 2
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        boxWidth: 8,
                        boxHeight: 8,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                title: {
                    display: true,
                    text: ['Emissions this week (μg/m³)'],
                    align: 'start',
                    color: '#171717',
                    font: {
                        size: 16,
                        family: 'Inter',
                        weight: '600',
                        lineHeight: 1.4
                    }
                }
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: true
            }
        };

    const data = {
        labels: labels,
        datasets: [{
            label: 'South Canal',
            data: normalized_emissions[0],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgba(95, 46, 234, 1)'],
            borderColor: ['rgba(95, 46, 234, 1)'],
            borderWidth: 2
        }, {
            label: 'The Liberties',
            data: normalized_emissions[1],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgb(227,234,130, 1)'],
            borderColor: ['rgba(227,234,130, 1)'],
            borderWidth: 2
        }, {
            label: 'Dublin Heuston',
            data: normalized_emissions[2],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgba(95, 146, 234, 1)'],
            borderColor: ['rgba(95, 146, 234, 1)'],
            borderWidth: 2
        }, {
            label: 'Tech. University',
            data: normalized_emissions[3],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgb(234,35,53, 1)'],
            borderColor: ['rgba(234,35,53, 1)'],
            borderWidth: 2
        }, {
            label: 'North City Center',
            data: normalized_emissions[4],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgba(95, 46, 134, 1)'],
            borderColor: ['rgba(95, 46, 134, 1)'],
            borderWidth: 2
        }, {
            label: 'City Port',
            data: normalized_emissions[5],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgba(75, 222, 151, 1)'],
            borderColor: ['rgba(75, 222, 151, 1)'],
            borderWidth: 2
        }]
    };

    const data1 = {
        labels: labels,
        datasets: [{
            label: 'Emissions',
            data: emissions[0],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgba(95, 46, 234, 1)'],
            borderColor: ['rgba(95, 46, 234, 1)'],
            borderWidth: 2
        },{
            label: 'Avg. Travel Time (s)',
            data: traffic[0],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgba(245, 230, 40, 1)'],
            borderColor: ['rgba(245, 230, 40, 1)'],
            borderWidth: 2
        }]
    };

    const data2 = {
        labels: labels,
        datasets: [{
            label: 'Emissions',
            data: emissions[1],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgba(95, 46, 234, 1)'],
            borderColor: ['rgba(95, 46, 234, 1)'],
            borderWidth: 2
        },{
            label: 'Avg. Travel Time (s)',
            data: traffic[1],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgba(245, 230, 40, 1)'],
            borderColor: ['rgba(245, 230, 40, 1)'],
            borderWidth: 2,
            spanGaps: false
        }]
    };

    const data3 = {
        labels: labels,
        datasets: [{
            label: 'Emissions',
            data: emissions[2],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgba(95, 46, 234, 1)'],
            borderColor: ['rgba(95, 46, 234, 1)'],
            borderWidth: 2
        },{
            label: 'Avg. Travel Time (s)',
            data: traffic[2],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgba(245, 230, 40, 1)'],
            borderColor: ['rgba(245, 230, 40, 1)'],
            borderWidth: 2
        }]
    };

    const data4 = {
        labels: labels,
        datasets: [{
            label: 'Emissions',
            data: emissions[3],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgba(95, 46, 234, 1)'],
            borderColor: ['rgba(95, 46, 234, 1)'],
            borderWidth: 2
        },{
            label: 'Avg. Travel Time (s)',
            data: traffic[3],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgba(245, 230, 40, 1)'],
            borderColor: ['rgba(245, 230, 40, 1)'],
            borderWidth: 2
        }]
    };

    const data5 = {
        labels: labels,
        datasets: [{
            label: 'Emissions',
            data: emissions[4],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgba(95, 46, 234, 1)'],
            borderColor: ['rgba(95, 46, 234, 1)'],
            borderWidth: 2
        },{
            label: 'Avg. Travel Time (s)',
            data: traffic[4],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgba(245, 230, 40, 1)'],
            borderColor: ['rgba(245, 230, 40, 1)'],
            borderWidth: 2
        }]
    };

    const data6 = {
        labels: labels,
        datasets: [{
            label: 'Emissions',
            data: emissions[5],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgba(95, 46, 234, 1)'],
            borderColor: ['rgba(95, 46, 234, 1)'],
            borderWidth: 2
        },{
            label: 'Avg. Travel Time (s)',
            data: traffic[5],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: ['rgba(245, 230, 40, 1)'],
            borderColor: ['rgba(245, 230, 40, 1)'],
            borderWidth: 2
        }]
    };

    const emissionsChartCtx = document.getElementById('dashboard-emissions-chart');
    if (emissionsChartCtx) {
        const emissionsCanvas = emissionsChartCtx.getContext('2d');
        const emissionsChart = new Chart(emissionsCanvas, {
            type: "line",
            options: options,
            data: data,
        });

        updateColor(emissionsChart);

        document.getElementById('theme-switcher').onclick = function () {
            updateColor(emissionsChart);
        };
    }

    const emissions1ChartCtx = document.getElementById('dashboard-emissions-1-chart');
    if (emissions1ChartCtx) {
        const emissions1Canvas = emissions1ChartCtx.getContext('2d');
        const emissions1Chart = new Chart(emissions1Canvas, {
            type: "line",
            options: options,
            data: data1,
        });

        updateColor(emissions1Chart);

        document.getElementById('theme-switcher').onclick = function () {
            updateColor(emissions1Chart);
        };
    }

    const emissions2ChartCtx = document.getElementById('dashboard-emissions-2-chart');
    if (emissions2ChartCtx) {
        const emissions2Canvas = emissions2ChartCtx.getContext('2d');
        const emissions2Chart = new Chart(emissions2Canvas, {
            type: "line",
            options: options,
            data: data2,
        });

        updateColor(emissions2Chart);

        document.getElementById('theme-switcher').onclick = function () {
            updateColor(emissions2Chart);
        };
    }

    const emissions3ChartCtx = document.getElementById('dashboard-emissions-3-chart');
    if (emissions3ChartCtx) {
        const emissions3Canvas = emissions3ChartCtx.getContext('2d');
        const emissions3Chart = new Chart(emissions3Canvas, {
            type: "line",
            options: options,
            data: data3,
        });

        updateColor(emissions3Chart);

        document.getElementById('theme-switcher').onclick = function () {
            updateColor(emissions3Chart);
        };
    }

    const emissions4ChartCtx = document.getElementById('dashboard-emissions-4-chart');
    if (emissions4ChartCtx) {
        const emissions4Canvas = emissions4ChartCtx.getContext('2d');
        const emissions4Chart = new Chart(emissions4Canvas, {
            type: "line",
            options: options,
            data: data4,
        });

        updateColor(emissions4Chart);

        document.getElementById('theme-switcher').onclick = function () {
            updateColor(emissions4Chart);
        };
    }

    const emissions5ChartCtx = document.getElementById('dashboard-emissions-5-chart');
    if (emissions5ChartCtx) {
        const emissions5Canvas = emissions5ChartCtx.getContext('2d');
        const emissions5Chart = new Chart(emissions5Canvas, {
            type: "line",
            options: options,
            data: data5,
        });

        updateColor(emissions5Chart);

        document.getElementById('theme-switcher').onclick = function () {
            updateColor(emissions5Chart);
        };
    }

    const emissions6ChartCtx = document.getElementById('dashboard-emissions-6-chart');
    if (emissions6ChartCtx) {
        const emissions6Canvas = emissions6ChartCtx.getContext('2d');
        const emissions6Chart = new Chart(emissions6Canvas, {
            type: "line",
            options: options,
            data: data6,
        });

        updateColor(emissions6Chart);

        document.getElementById('theme-switcher').onclick = function () {
            updateColor(emissions6Chart);
        };
    }
}

async function updateAllEmissionValues() {
    const one_day_from_now = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const one_week_from_then = new Date(one_day_from_now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const one_month_from_then = new Date(one_day_from_now.getTime() - 31 * 24 * 60 * 60 * 1000);
    const two_months_from_then = new Date(one_day_from_now.getTime() - 62 * 24 * 60 * 60 * 1000);

    const chart_emissions = [];
    const chart_emissions_normalized = [];
    const chart_emissions_labels = {};
    const chart_traffic = [];
    let this_month_total_emissions = 0;
    let previous_month_total_emissions = 0;

    for (let area = 1; area <= 6; area++) {
        const emissionsResponse = await fetch(apiUrl + 'emissions/' + area);
        const emissionsData = await emissionsResponse.json();

        const trafficResponse = await fetch(apiUrl + 'traffic/' + area);
        const trafficData = await trafficResponse.json();

        if (emissionsData.length > 0) {
            updateLastEmissionValue(area, emissionsData[0].no2_level);
        } else {
            updateLastEmissionValue(area, undefined);
        }

        const chart_emissions_local = [];
        const chart_emissions_normalized_local = [];
        const chart_traffic_local = [];

        for (let i = 0; i < emissionsData.length; i++) {
            const entry_date = new Date(emissionsData[i].timestamp);

            if (entry_date > one_week_from_then) {;
                chart_emissions_local.push(
                    {x: entry_date, y: emissionsData[i].no2_level}
                );
                chart_emissions_normalized_local.push(
                    {x: entry_date.toISOString().substring(5, 16), y: emissionsData[i].no2_level}
                );
                this_month_total_emissions += emissionsData[i].no2_level;
                chart_emissions_labels[entry_date.toISOString().substring(5, 16)] = 1;
            } else if (entry_date > one_month_from_then) {
                this_month_total_emissions += emissionsData[i].no2_level;
            } else if (entry_date > two_months_from_then) {
                previous_month_total_emissions += emissionsData[i].no2_level;
            } else {
                break;
            }
        }

        const averaged_traffic = {};
        for (let i = 0; i < trafficData.length; i++) {
            const entry_date = new Date(trafficData[i].timestamp);
            entry_date.setMinutes(0);
            entry_date.setSeconds(0);

            if (entry_date in averaged_traffic) {
                averaged_traffic[entry_date][0] += trafficData[i].current_travel_time;
                averaged_traffic[entry_date][1] += 1
            } else {
                averaged_traffic[entry_date] = [trafficData[i].current_travel_time, 1]
            }
        }

        for (let i = 0; i < Object.keys(averaged_traffic).length; i++) {
            const key = Object.keys(averaged_traffic)[i];
            const entry_date = new Date(key);

            if (entry_date > one_week_from_then) {
                chart_traffic_local.push(
                    {
                        x: new Date(key),
                        y: averaged_traffic[key][0] / averaged_traffic[key][1]
                    }
                );
            } else {
                break;
            }
        }

        chart_emissions.push(chart_emissions_local);
        chart_traffic.push(chart_traffic_local);
        chart_emissions_normalized.push(chart_emissions_normalized_local);
    }

    updateTotalEmissions(this_month_total_emissions, previous_month_total_emissions);
    updateEmissionsChart(Object.keys(chart_emissions_labels).sort(), chart_emissions_normalized, chart_emissions, chart_traffic);
}

async function updateDataPointsAvailable() {
    if (document.getElementById("dashboard-available-data-points")) {
        const response = await fetch(apiUrl + 'data-points');
        const data = await response.json();

        document.getElementById("dashboard-available-data-points").innerHTML = data;
    }
}


async function updateLastUpdate() {
    if (document.getElementById("dashboard-last-update")) {
        const response = await fetch(apiUrl + 'last-update');
        const data = await response.json();

        document.getElementById("dashboard-last-update").innerHTML =
            't ' + new Date(data).toTimeString().substring(0, 8);
    }
}

updateAllEmissionValues();
updateDataPointsAvailable();
updateLastUpdate();
