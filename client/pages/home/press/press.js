define(["text!./press.html", "util", "css!./press.css"], function (html, util) {

    let blockUI = null;  // Loading对象
    let blockUI1 = null;  // Loading对象
    let dt1 = null;
    let blockUI2 = null;
    let dt2 = null;
    let blockUI3 = null;
    let dt3 = null;

    const render1 = (results) => {
        dt1.destroy();
        $("#ibody1").empty();
        results.forEach(result => {  // 遍历数据 渲染DOM
            $("#ibody1").append(`
            <tr>
                <td>${result.name}</td>
                <td>${result.num}</td>
            </tr>
            `);
        });
        dt1 = $("#itable1").DataTable();
    }

    const render2 = (results) => {
        dt2.destroy();
        $("#ibody2").empty();
        results.forEach(result => {  // 遍历数据 渲染DOM
            $("#ibody2").append(`
            <tr>
                <td>${result.name}</td>
                <td>${result.num}</td>
            </tr>
            `);
        });
        dt2 = $("#itable2").DataTable();
    }

    const render3 = (results) => {
        dt3.destroy();
        $("#ibody3").empty();
        results.forEach(result => {  // 遍历数据 渲染DOM
            $("#ibody3").append(`
            <tr>
                <td>${result.name}</td>
                <td>${result.num}</td>
            </tr>
            `);
        });
        dt3 = $("#itable3").DataTable();
    }

    const getData1 = () => { // 获取数据
        if (blockUI1 && !blockUI1.isBlocked()) {
            blockUI1.block();
        }
        util.ajax.get("http://localhost:8888/press", { // 请求后台
            type: "info",
        }, (result) => {
            if (result.success) {
                if (blockUI1 && blockUI1.isBlocked()) {
                    blockUI1.release();
                }
                render1(result.data);
            }
        });
    }

    const getData2 = () => { // 获取数据
        if (blockUI2 && !blockUI2.isBlocked()) {
            blockUI2.block();
        }
        util.ajax.get("http://localhost:8888/press", { // 请求后台
            type: "price",
        }, (result) => {
            if (result.success) {
                if (blockUI2 && blockUI2.isBlocked()) {
                    blockUI2.release();
                }
                render2(result.data);
            }
        });
    }

    const getData3 = () => { // 获取数据
        if (blockUI3 && !blockUI3.isBlocked()) {
            blockUI3.block();
        }
        util.ajax.get("http://localhost:8888/press", { // 请求后台
            type: "score",
        }, (result) => {
            if (result.success) {
                if (blockUI3 && blockUI3.isBlocked()) {
                    blockUI3.release();
                }
                render3(result.data);
            }
        });
    }

    const render = (x, y) => {
        var ctx = document.getElementById('kt_chartjs_3'); // 获取目标元素

        // 定义颜色
        var primaryColor = KTUtil.getCssVariableValue('--bs-primary'); // 获取颜色
        var dangerColor = KTUtil.getCssVariableValue('--bs-danger'); // 获取颜色
        var successColor = KTUtil.getCssVariableValue('--bs-success'); // 获取颜色
        var warningColor = KTUtil.getCssVariableValue('--bs-warning'); // 获取颜色
        var infoColor = KTUtil.getCssVariableValue('--bs-info'); // 获取颜色

        // 定义字体
        var fontFamily = KTUtil.getCssVariableValue('--bs-font-sans-serif'); // 获取字体

        // Chart 标签
        const labels = x;

        // Chart 数据
        const data = {
            labels: labels,
            datasets: [{
                label: '高价书籍所属出版社统计',
                data: y,
                backgroundColor: [
                    primaryColor,
                    dangerColor,
                    successColor,
                    warningColor,
                    infoColor,
                ],
                borderWidth: 0
            }]
        };

        // Chart 配置
        const config = {
            type: 'pie',
            data: data,
            options: {
                plugins: {
                    title: {
                        display: false,
                    }
                },
                responsive: true,
            },
            defaults: {
                global: {
                    defaultFont: fontFamily
                }
            }
        };

        // 初始化Chart
        var myChart = new Chart(ctx, config);
    }

    const getData = () => { // 获取数据
        if (blockUI && !blockUI.isBlocked()) {
            blockUI.block();  // 开启Loading
        }
        util.ajax.get("http://localhost:8888/press", {
            type: "big_price",
        }, (result) => {
            if (result.success) {
                if (blockUI && blockUI.isBlocked()) {
                    blockUI.release();  // 关闭Loading
                }
                const x = []
                const y = []
                if (result.data instanceof Array) { // 组合数据
                    result.data.forEach(item => {
                        x.push(item.name);
                        y.push(item.num);
                    });
                    y[0] += 1;
                    render(x, y);
                }
            }
        });
    }

    const init = ($parent) => { // 初始化页面
        $parent.append(html);
        blockUI = new KTBlockUI($("#kt_chartjs_3")[0]);
        blockUI1 = new KTBlockUI($("#itable1")[0]);
        dt1 = $("#itable1").DataTable();;
        blockUI2 = new KTBlockUI($("#itable2")[0]);
        dt2 = $("#itable2").DataTable();;
        blockUI3 = new KTBlockUI($("#itable3")[0]);
        dt3 = $("#itable3").DataTable();;
        getData1();
        getData2();
        getData3();
        getData();
    }

    return {
        init: init,
    }
});