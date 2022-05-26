define(["text!./base.html", "util", "css!./base.css"], function (html, util) {

    let blockUI = null;  // Loading对象
    let dt = null;  // grid对象

    const render = (results) => {  // 渲染方法
        dt.destroy();  // 销毁grid
        $("#ibody").empty(); // 清空tbody dom
        results.forEach(result => {  // 遍历数据 渲染DOM
            const autuor = result.authors.join(",");
            $("#ibody").append(`
            <tr>
                <td>${result.name}</td>
                <td>${result.category}</td>
                <td>${result.price}</td>
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

    const getData = (keyword) => {  // 请求后台数据
        if (blockUI && !blockUI.isBlocked()) {
            blockUI.block();  // 开启Loading
        }
        util.ajax.get("http://localhost:8888/base", {  // 请求后台
            keyword: keyword,
        }, (result) => {
            if (result.success) {
                if (blockUI && blockUI.isBlocked()) {
                    blockUI.release();  // 关闭Loading
                }
                render(result.data);  // 开始渲染
            }
        });
    }

    const init = ($parent) => { // 初始化页面
        $parent.append(html);
        blockUI = new KTBlockUI($("#itable")[0]);
        dt = $("#itable").DataTable(); // 创建Datatable;
        $('#ikeyword').on('keypress', function (e) {
            if (e.keyCode === 13) {
                getData($('#ikeyword').val());
            }
        });
        getData(""); // 刷新表格
    }

    return {
        init: init,
    }
});