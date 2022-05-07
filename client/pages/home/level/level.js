define(["text!./level.html", "util", "css!./level.css"], function (html, util) {
    let blockUI1 = null;
    let blockUI2 = null;

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
        util.ajax.get("http://localhost:8888/level", {
            type: "level",
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

    const render2 = () => {
        var primaryColor = KTUtil.getCssVariableValue('--bs-primary');
        var dangerColor = KTUtil.getCssVariableValue('--bs-danger');
        var successColor = KTUtil.getCssVariableValue('--bs-success');
        var warningColor = KTUtil.getCssVariableValue('--bs-warning');
        var infoColor = KTUtil.getCssVariableValue('--bs-info');
        WordCloud(document.getElementById('my_canvas'), { 
            list: [
                ['foo', 6], 
                ['bar', 12],
                ['foo', 6], 
                ['bar', 12],
                ['foo', 6], 
                ['bar', 12],
                ['foo', 6], 
                ['bar', 12],
                ['foo', 6], 
                ['bar', 12],
                ['foo', 6], 
                ['bar', 12],
                ['foo', 6], 
                ['bar', 12],
                ['foo', 6], 
                ['bar', 12],
                ['foo', 6], 
                ['bar', 12],
                ['foo', 6], 
                ['bar', 12],
            ],
            fontFamily: '"Poppins", "Helvetica", "sans-serif"',
            color: () => {
                const randomsort = (a, b) => {
                    return Math.random()>.5 ? -1 : 1;
                }
                const colors = [primaryColor, dangerColor, successColor, warningColor, infoColor];
                return colors.sort(randomsort)[0];
            },
            weightFactor: 8,
        });
    }

    const init = ($parent) => {
        $parent.append(html);
        blockUI1 = new KTBlockUI($("#kt_apexcharts_1")[0]);
        blockUI2 = new KTBlockUI($("#my_canvas")[0]);
        getData1();
        render2();
    }

    return {
        init: init,
    }
});