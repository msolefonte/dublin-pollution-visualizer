"use strict";

document.getElementById("dashboard-available-data-points").innerHTML = '411969';
document.getElementById("dashboard-last-update").innerHTML = '<i data-feather="clock" aria-hidden="true"></i>One minute ago';
document.getElementById("dashboard-emissions-monthly").innerHTML = '71341 kg/m³';
document.getElementById("dashboard-emissions-evolution").innerHTML = '<i data-feather="trending-up" aria-hidden="true"></i>1.64%';

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

function updateAllEmissionValues() {
    for (var area = 1; area <= 6; area++) {
        (function (area) {
            fetch('http://13.80.18.173:8080/v1/emissions/' + area)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    var one_day_from_now = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
                    var one_week_from_then = new Date(one_day_from_now.getTime() - 7 * 24 * 60 * 60 * 1000);

                    if (data.length > 0) {
                        updateLastEmissionValue(area, data[0].no2_level);
                    } else {
                        updateLastEmissionValue(area, undefined);
                    }

                    var results = [];
                    for (var i = 0; i < data.length; i++) {
                        if (new Date(data[i].timestamp) < one_day_from_now) {
                            if (new Date(data[i].timestamp) > one_week_from_then) {
                                results.push(data[i]);
                            } else {
                                break;
                            }
                        }
                    }
                });
        })(area);
    }
}

updateAllEmissionValues();

