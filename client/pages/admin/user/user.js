define(["text!./user.html", "util", "css!./user.css"], function (html, util) {

    let blockUI = null;  // Loading对象
    let blockUI1 = null;  // Loading对象
    let dt = null;  // grid对象
    let mode = null;  // grid操作模式
    let id = "";  // 当前操作row的id
    let form = {  // 表单对象集
        username: null,
        password: null,
        name: null,
        permission: null,
    }

    const render = (results) => {  // 渲染方法
        dt.destroy();  // 销毁grid
        $("#ibody").empty(); // 清空tbody dom
        results.forEach(result => {  // 遍历数据 渲染DOM
            $("#ibody").append(`
            <tr>
                <td style="display: none;">${result._id.$oid}</td>
                <td>${result.name}</td>
                <td>${result.username}</td>
                <td>${result.permission}</td>
            </tr>
            `);
        });
        dt = $("#itable").DataTable({  // 创建Datatable
            select: true
        });
        dt.column('0').order('desc').draw();  // 对id进行排序
    }

    const getData = () => { // 获取数据
        if (blockUI && !blockUI.isBlocked()) {
            blockUI.block();  // 开启Loading
        }
        util.ajax.get("http://localhost:8888/user", {}, (result) => {
            if (result.success) {
                if (blockUI && blockUI.isBlocked()) {
                    blockUI.release();  // 关闭Loading
                }
                render(result.data);  // 开始渲染
            }
        });
    }

    const add = () => {  // 添加
        $("#add").on("click", () => {
            clearFormData();  // 清空Form表单数据
            mode = "add";  // 设置当前模式为添加
        });
        $("#submit").on("click", () => {  // 绑定点击事件
            let data = getFormData(); // 获取表单数据
            if (blockUI1 && !blockUI1.isBlocked()) {
                blockUI1.block();  // 开启Loading
            }
            //  编辑模式
            if (mode == "edit") {
                data.id = id;
                util.ajax.put("http://localhost:8888/user", data, (result) => {
                    if (result.success) {
                        if (blockUI1 && blockUI1.isBlocked()) {
                            blockUI1.release();
                        }
                        var myModalEl = document.getElementById('kt_modal_1') // 获取模态框
                        var modal = bootstrap.Modal.getInstance(myModalEl)  // 获取模态框实例
                        modal.hide();  // 隐藏模态框
                        getData(""); // 刷新表格 // 刷新表格
                    }
                });
            } else {
                util.ajax.post("http://localhost:8888/user", data, (result) => {
                    if (result.success) {
                        if (blockUI1 && blockUI1.isBlocked()) {
                            blockUI1.release();
                        }
                        var myModalEl = document.getElementById('kt_modal_1') // 获取模态框
                        var modal = bootstrap.Modal.getInstance(myModalEl)  // 获取模态框实例
                        modal.hide();  // 隐藏模态框
                        getData(""); // 刷新表格 // 刷新表格
                    }
                });
            }
        });
    }

    const edit = () => { // 编辑
        $("#edit").on("click", () => {
            clearFormData(); // 清空表单数据
            mode = "edit"; // 设置当前模式为编辑
            let data = dt.rows({ selected: true }).data(); // 获取选中行数据 // 获取选中行数据
            if (data.length == 1) {
                if (blockUI && !blockUI.isBlocked()) {
                    blockUI.block();
                }
                util.ajax.get("http://localhost:8888/login", {
                    id: data[0][0],
                }, (result) => {
                    if (result.success) {
                        if (blockUI && blockUI.isBlocked()) {
                            blockUI.release();
                        }
                        var myModalEl = document.getElementById('kt_modal_1') // 获取模态框
                        var modal = bootstrap.Modal.getInstance(myModalEl)  // 获取模态框实例
                        if (!modal) {
                            modal = new bootstrap.Modal(myModalEl) // 创建模态框实例
                        }
                        modal.show();  // 显示模态框
                        setFormData(result.data); // 设置表单数据
                        id = result.data._id.$oid; // 设置当前操作ID
                    }
                });
            }
        });
    }

    const del = () => { // 删除
        $("#delete").on("click", () => { // 绑定点击事件
            Swal.fire({ // 弹出提示框
                html: "确定要删除吗？",
                icon: "warning",
                buttonsStyling: false,
                showCancelButton: true,
                reverseButtons: true,
                confirmButtonText: "确定",
                cancelButtonText: '取消',
                customClass: {
                    confirmButton: "btn btn-primary two-word",
                    cancelButton: 'btn btn-light two-word'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    let data = dt.rows({ selected: true }).data(); // 获取选中行数据
                    if (data.length == 1) {
                        if (blockUI && !blockUI.isBlocked()) {
                            blockUI.block();
                        }
                        util.ajax.delete("http://localhost:8888/user", {
                            id: data[0][0],
                        }, (result) => {
                            if (result.success) {
                                if (blockUI && blockUI.isBlocked()) {
                                    blockUI.release();
                                }
                                getData(""); // 刷新表格
                            }
                        });
                    }
                }
            });
        })
    }

    const getFormData = () => { // 获取表单数据
        let data = {};
        for (let f in form) {
            data[f] = form[f] ? form[f].val() : "";
        }
        return data;
    }

    const setFormData = (data) => { // 设置表单数据
        for (let f in form) {
            if (form[f] && (data[f] || data[f] == 0)) {
                form[f].val(data[f]);
            }
        }
    }

    const clearFormData = () => { // 清空表单数据
        for (let f in form) {
            form[f] && form[f].val("");
        }
    }

    const init = ($parent) => { // 初始化页面
        $parent.append(html);
        blockUI = new KTBlockUI($("#itable")[0]);
        blockUI1 = new KTBlockUI($("#bui1")[0]);
        dt = $("#itable").DataTable(); // 创建Datatable;
        for (let f in form) {
            form[f] = $(`[name="${f}"]`);
        }
        form.permission.select2();
        getData();
        add();
        edit();
        del();
    }

    return {
        init: init,
    }
});