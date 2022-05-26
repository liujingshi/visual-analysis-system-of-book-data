define(["text!./level.html", "util", "css!./level.css"], function (html, util) {
    let blockUI1 = null;  // Loading对象
    let blockUI2 = null;

    const render1 = (x, y) => { // 渲染
        let element = document.getElementById('kt_apexcharts_1');  // 获取目标元素
        let height = parseInt(KTUtil.css(element, 'height'));  // 获取目标元素高度
        let labelColor = KTUtil.getCssVariableValue('--bs-gray-500');  // 获取颜色
        let borderColor = KTUtil.getCssVariableValue('--bs-gray-200');  // 获取颜色
        let baseColor = KTUtil.getCssVariableValue('--bs-primary');  // 获取颜色
        let secondaryColor = KTUtil.getCssVariableValue('--bs-gray-300');  // 获取颜色

        if (!element) {  // 如果元素不存在直接返回
            return;
        }

        let options = { // chart配置
            series: [{ // y轴数据
                name: '数量',
                data: y
            }],
            chart: { // chart基本属性
                fontFamily: 'inherit',
                type: 'bar',
                height: height,
                toolbar: {
                    show: false
                }
            },
            plotOptions: { // 坐标系选项
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
            stroke: { // 线条样式
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: { // x轴数据和样式
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
            yaxis: { // y轴数据和样式
                labels: {
                    style: {
                        colors: labelColor,
                        fontSize: '12px'
                    }
                }
            },
            fill: { // 填充样式
                opacity: 1
            },
            states: { // 不同状态的样式
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
            tooltip: { // 工具提示栏
                style: {
                    fontSize: '12px'
                },
                y: {
                    formatter: function (val) {
                        return val
                    }
                }
            },
            colors: [baseColor, secondaryColor],  // 颜色
            grid: { // 表格
                borderColor: borderColor,
                strokeDashArray: 4,
                yaxis: {
                    lines: {
                        show: true
                    }
                }
            }
        };

        let chart = new ApexCharts(element, options); // 创建Chart
        chart.render(); // 渲染Chart

    }

    const getData1 = () => { // 获取数据
        if (blockUI1 && !blockUI1.isBlocked()) {
            blockUI1.block();
        }
        util.ajax.get("http://localhost:8888/level", { // 请求后台
            type: "level",
        }, (result) => {
            if (result.success) {
                if (blockUI1 && blockUI1.isBlocked()) {
                    blockUI1.release();
                }
                const x = []
                const y = []
                if (result.data instanceof Array) { // 组合数据
                    result.data.forEach(item => {
                        x.push(item.name);
                        y.push(item.num);
                    });
                    render1(x, y); // 开始渲染
                }
            }
        });
    }

    const render2 = () => { // 渲染
        var primaryColor = KTUtil.getCssVariableValue('--bs-primary');  // 获取颜色
        var dangerColor = KTUtil.getCssVariableValue('--bs-danger');  // 获取颜色
        var successColor = KTUtil.getCssVariableValue('--bs-success');  // 获取颜色
        var warningColor = KTUtil.getCssVariableValue('--bs-warning');  // 获取颜色
        var infoColor = KTUtil.getCssVariableValue('--bs-info');  // 获取颜色
        WordCloud(document.getElementById('my_canvas'), {  // 创建词云
            list: [ // 词云数据（demo 如果使用请把list中数据删掉）
                ['艺术', 6], 
                ['管理', 12],
                ['历史', 16], 
                ['宗教', 24],
                ['家教', 36], 
                ['养生', 12],
                ['考试', 6], 
                ['科技', 12],
                ['进口', 24], 
                ['文学', 12],
                ['天文', 6], 
                ['概念', 12],
                ['理论', 26], 
                ['古籍', 12],
                ['科普', 46], 
                ['医学', 12],
                ['工业', 36], 
                ['农林', 12],
                ['自然', 6], 
                ['休闲', 12],
            ],
            fontFamily: '"Poppins", "Helvetica", "sans-serif"', // 字体
            color: () => { // 自定义样式
                const randomsort = (a, b) => {
                    return Math.random()>.5 ? -1 : 1;
                }
                const colors = [primaryColor, dangerColor, successColor, warningColor, infoColor];
                return colors.sort(randomsort)[0];
            },
            weightFactor: 3,
        });
    }

    const init = ($parent) => { // 初始化页面
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