define(["text!./price.html", "util", "css!./price.css"], function(html, util) {
    
    let blockUI = null;
    let dt = null;

    const render = (results) => {
        dt.destroy();
        $("#ibody").empty();
        results.forEach(result => {
            const autuor = result.authors.join(",");
            $("#ibody").append(`
            <tr>
                <td>${result.price}</td>
                <td>${result.name}</td>
                <td>${result.category}</td>
                <td>${autuor}</td>
                <td>${result.press}</td>
                <td>${result.press_datetime}</td>
                <td>${result.popularity}</td>
                <td>${result.comment_count}</td>
            </tr>
            `);
        });
        dt = $("#itable").DataTable();
    }

    const getData = () => {
        if (blockUI && !blockUI.isBlocked()) {
            blockUI.block();
        }
        util.ajax.get("http://localhost:8888/price", {
            type: "bp",
        }, (result) => {
            if (result.success) {
                if (blockUI && blockUI.isBlocked()) {
                    blockUI.release();
                }
                render(result.data);
            }
        });
    }

    let blockUI1 = null;

    const render1 = (x, y) => {
        let element = document.getElementById('kt_apexcharts_1');
        let height = parseInt(KTUtil.css(element, 'height'));
        let labelColor = KTUtil.getCssVariableValue('--bs-gray-500');
        let borderColor = KTUtil.getCssVariableValue('--bs-gray-200');
        let baseColor = KTUtil.getCssVariableValue('--bs-primary');
        let secondaryColor = KTUtil.getCssVariableValue('--bs-gray-300');

        if (!element) {
            return;
        }

        let options = {
            series: [{
                name: '数量',
                data: y
            }],
            chart: {
                fontFamily: 'inherit',
                type: 'bar',
                height: height,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: ['30%'],
                    endingShape: 'rounded'
                },
            },
            legend: {
                show: false
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: x,
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    style: {
                        colors: labelColor,
                        fontSize: '12px'
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: labelColor,
                        fontSize: '12px'
                    }
                }
            },
            fill: {
                opacity: 1
            },
            states: {
                normal: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                hover: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: 'none',
                        value: 0
                    }
                }
            },
            tooltip: {
                style: {
                    fontSize: '12px'
                },
                y: {
                    formatter: function (val) {
                        return val
                    }
                }
            },
            colors: [baseColor, secondaryColor],
            grid: {
                borderColor: borderColor,
                strokeDashArray: 4,
                yaxis: {
                    lines: {
                        show: true
                    }
                }
            }
        };

        let chart = new ApexCharts(element, options);
        chart.render();

    }

    const getData1 = () => {
        if (blockUI1 && !blockUI1.isBlocked()) {
            blockUI1.block();
        }
        util.ajax.get("http://localhost:8888/price", {
            type: "price",
        }, (result) => {
            if (result.success) {
                if (blockUI1 && blockUI1.isBlocked()) {
                    blockUI1.release();
                }
                const x = []
                const y = []
                if (result.data instanceof Array) {
                    result.data.forEach(item => {
                        x.push(item.name);
                        y.push(item.num);
                    });
                    render1(x, y);
                }
            }
        });
    }

    const init = ($parent) => {
        $parent.append(html);
        blockUI = new KTBlockUI($("#itable")[0]);
        dt = $("#itable").DataTable();;
        getData();
        blockUI1 = new KTBlockUI($("#kt_apexcharts_1")[0]);
        getData1();
    }

    return {
        init: init,
    }
});