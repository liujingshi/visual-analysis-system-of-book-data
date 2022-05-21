define(["text!./user.html", "util", "css!./user.css"], function (html, util) {

    let blockUI = null;
    let blockUI1 = null;
    let dt = null;
    let mode = null;
    let id = "";
    let form = {
        username: null,
        password: null,
        name: null,
        permission: null,
    }

    const render = (results) => {
        dt.destroy();
        $("#ibody").empty();
        results.forEach(result => {
            $("#ibody").append(`
            <tr>
                <td style="display: none;">${result._id.$oid}</td>
                <td>${result.name}</td>
                <td>${result.username}</td>
                <td>${result.permission}</td>
            </tr>
            `);
        });
        dt = $("#itable").DataTable({
            select: true
        });
        dt.column('0').order('desc').draw();
    }

    const getData = () => {
        if (blockUI && !blockUI.isBlocked()) {
            blockUI.block();
        }
        util.ajax.get("http://localhost:8888/user", {}, (result) => {
            if (result.success) {
                if (blockUI && blockUI.isBlocked()) {
                    blockUI.release();
                }
                render(result.data);
            }
        });
    }

    const add = () => {
        $("#add").on("click", () => {
            clearFormData();
            mode = "add";
        });
        $("#submit").on("click", () => {
            let data = getFormData();
            if (blockUI1 && !blockUI1.isBlocked()) {
                blockUI1.block();
            }
            if (mode == "edit") {
                data.id = id;
                util.ajax.put("http://localhost:8888/user", data, (result) => {
                    if (result.success) {
                        if (blockUI1 && blockUI1.isBlocked()) {
                            blockUI1.release();
                        }
                        var myModalEl = document.getElementById('kt_modal_1')
                        var modal = bootstrap.Modal.getInstance(myModalEl)
                        modal.hide();
                        getData("");
                    }
                });
            } else {
                util.ajax.post("http://localhost:8888/user", data, (result) => {
                    if (result.success) {
                        if (blockUI1 && blockUI1.isBlocked()) {
                            blockUI1.release();
                        }
                        var myModalEl = document.getElementById('kt_modal_1')
                        var modal = bootstrap.Modal.getInstance(myModalEl)
                        modal.hide();
                        getData("");
                    }
                });
            }
        });
    }

    const edit = () => {
        $("#edit").on("click", () => {
            clearFormData();
            mode = "edit";
            let data = dt.rows({ selected: true }).data();
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
                        var myModalEl = document.getElementById('kt_modal_1')
                        var modal = bootstrap.Modal.getInstance(myModalEl)
                        if (!modal) {
                            modal = new bootstrap.Modal(myModalEl)
                        }
                        modal.show();
                        setFormData(result.data);
                        id = result.data._id.$oid;
                    }
                });
            }
        });
    }

    const del = () => {
        $("#delete").on("click", () => {
            Swal.fire({
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
                    let data = dt.rows({ selected: true }).data();
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
                                getData("");
                            }
                        });
                    }
                }
            });
        })
    }

    const getFormData = () => {
        let data = {};
        for (let f in form) {
            data[f] = form[f] ? form[f].val() : "";
        }
        return data;
    }

    const setFormData = (data) => {
        for (let f in form) {
            if (form[f] && (data[f] || data[f] == 0)) {
                form[f].val(data[f]);
            }
        }
    }

    const clearFormData = () => {
        for (let f in form) {
            form[f] && form[f].val("");
        }
    }

    const init = ($parent) => {
        $parent.append(html);
        blockUI = new KTBlockUI($("#itable")[0]);
        blockUI1 = new KTBlockUI($("#bui1")[0]);
        dt = $("#itable").DataTable();;
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