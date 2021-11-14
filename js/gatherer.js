"use strict";

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

function updateColor(chart, firstCall) {
    const darkMode = localStorage.getItem('darkMode');

    let gridLine;
    let titleColor;

    if (firstCall) {
        if (darkMode === 'enabled') {
            gridLine = '#37374F';
            titleColor = '#EFF0F6';
        } else {
            gridLine = '#EEEEEE';
            titleColor = '#171717';
        }
    } else {
        if (darkMode === 'enabled') {
            gridLine = '#EEEEEE';
            titleColor = '#171717';
        } else {
            gridLine = '#37374F';
            titleColor = '#EFF0F6';
        }
    }

    chart.options.scales.x.grid.color = gridLine;
    chart.options.plugins.title.color = titleColor;
    chart.options.scales.y.ticks.color = titleColor;
    chart.options.scales.x.ticks.color = titleColor;
    chart.update();
}

async function updateEmissionsChart() {
    const emissionsChartCtx = document.getElementById('dashboard-emissions-chart');

    let darkMode = localStorage.getItem('darkMode');

    let gridLine;
    let titleColor;

    if (emissionsChartCtx) {
        const myCanvas = emissionsChartCtx.getContext('2d');
        const emissionsChart = new Chart(myCanvas, {
            type: 'line',
            data: {
                labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Area 1',
                    data: getEmissions(1),
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4,
                    backgroundColor: ['rgba(95, 46, 234, 1)'],
                    borderColor: ['rgba(95, 46, 234, 1)'],
                    borderWidth: 2
                }, {
                    label: 'Area 2',
                    data: getEmissions(2),
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4,
                    backgroundColor: ['rgb(227,234,130, 1)'],
                    borderColor: ['rgba(227,234,130, 1)'],
                    borderWidth: 2
                }, {
                    label: 'Area 3',
                    data: getEmissions(3),
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4,
                    backgroundColor: ['rgba(95, 146, 234, 1)'],
                    borderColor: ['rgba(95, 146, 234, 1)'],
                    borderWidth: 2
                }, {
                    label: 'Area 4',
                    data: getEmissions(4),
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4,
                    backgroundColor: ['rgba(95, 46, 134, 1)'],
                    borderColor: ['rgba(95, 46, 134, 1)'],
                    borderWidth: 2
                }, {
                    label: 'Area 5',
                    data: getEmissions(5),
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4,
                    backgroundColor: ['rgb(234,35,53, 1)'],
                    borderColor: ['rgba(234,35,53, 1)'],
                    borderWidth: 2
                }, {
                    label: 'Area 6',
                    data: getEmissions(6),
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4,
                    backgroundColor: ['rgba(75, 222, 151, 1)'],
                    borderColor: ['rgba(75, 222, 151, 1)'],
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    y: {
                        min: 0,
                        max: 250,
                        ticks: {
                            stepSize: 25
                        },
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            color: gridLine
                        }
                    }
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
                        text: ['Visitor statistics', 'Nov - July'],
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
            }
        });

        updateColor(emissionsChart, true);

        document.getElementById('theme-switcher').onclick = function () {
            updateColor(emissionsChart, false);
        };
    }
}

updateAllEmissionValues();
updateDataPointsAvailable();
updateLastUpdate();
updateEmissionsChart();

function getEmissions(area) {
  return [
      Math.floor(Math.random()*200),
      Math.floor(Math.random()*200),
      Math.floor(Math.random()*200),
      Math.floor(Math.random()*200),
      Math.floor(Math.random()*200),
      Math.floor(Math.random()*200),
      Math.floor(Math.random()*200),
      Math.floor(Math.random()*200),
      Math.floor(Math.random()*200),
      Math.floor(Math.random()*200),
      Math.floor(Math.random()*200),
      Math.floor(Math.random()*200),
      Math.floor(Math.random()*200),
      Math.floor(Math.random()*200)
  ];
}
