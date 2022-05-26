define(["text!./price.html", "util", "css!./price.css"], function(html, util) {
    
    let blockUI = null;  // Loading对象
    let dt = null;  // grid对象

    const render = (results) => {  // 渲染方法
        dt.destroy();  // 销毁grid
        $("#ibody").empty(); // 清空tbody dom
        results.forEach(result => {  // 遍历数据 渲染DOM
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
        dt = $("#itable").DataTable(); // 创建Datatable
    }

    const getData = () => { // 获取数据
        if (blockUI && !blockUI.isBlocked()) {
            blockUI.block();  // 开启Loading
        }
        util.ajax.get("http://localhost:8888/price", {
            type: "bp",
        }, (result) => {
            if (result.success) {
                if (blockUI && blockUI.isBlocked()) {
                    blockUI.release();  // 关闭Loading
                }
                render(result.data);  // 开始渲染
            }
        });
    }

    let blockUI1 = null;  // Loading对象

    const render1 = (x, y) => { // 渲染
        let element = document.getElementById('kt_apexcharts_1'); // 获取目标元素
        let height = parseInt(KTUtil.css(element, 'height')); // 获取目标元素高度
        let labelColor = KTUtil.getCssVariableValue('--bs-gray-500'); // 获取颜色
        let borderColor = KTUtil.getCssVariableValue('--bs-gray-200'); // 获取颜色
        let baseColor = KTUtil.getCssVariableValue('--bs-primary'); // 获取颜色
        let secondaryColor = KTUtil.getCssVariableValue('--bs-gray-300'); // 获取颜色

        if (!element) { // 如果元素不存在直接返回
            return;
        }

        let options = { // chart配置
            series: [{ // y轴数据
                name: '数量',
                data: y
            }],
            chart: { // Chart基本数据
                fontFamily: 'inherit',
                type: 'bar',
                height: height,
                toolbar: {
                    show: false
                }
            },
            plotOptions: { // 坐标系配置
                bar: {
                    horizontal: false,
                    columnWidth: ['30%'],
                    endingShape: 'rounded'
                },
            },
            legend: {
                show: false
            },
            dataLabels: { // 数据标签
                enabled: false
            },
            stroke: { // 线条样式
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {  // x轴样式
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
            yaxis: {  // y轴样式
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
            states: { // 不同状态不同样式
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
            colors: [baseColor, secondaryColor], // 颜色列表
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
        util.ajax.get("http://localhost:8888/price", { // 请求后台数据
            type: "price",
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
                    render1(x, y);
                }
            }
        });
    }

    const init = ($parent) => { // 初始化页面
        $parent.append(html);
        blockUI = new KTBlockUI($("#itable")[0]);
        dt = $("#itable").DataTable(); // 创建Datatable;
        getData();
        blockUI1 = new KTBlockUI($("#kt_apexcharts_1")[0]);
        getData1();
    }

    return {
        init: init,
    }
});