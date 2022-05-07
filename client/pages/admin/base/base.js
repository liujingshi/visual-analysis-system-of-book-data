define(["text!./base.html", "util", "css!./base.css"], function (html, util) {

    let blockUI = null;
    let blockUI1 = null;
    let dt = null;
    let mode = null;
    let id = "";
    let form = {
        name: null,
        category: null,
        authors: null,
        price: null,
        author_desc: null,
        press: null,
        press_datetime: null,
        level: null,
        popularity: null,
        comment_count: null,
        desc: null,
    }

    const render = (results) => {
        dt.destroy();
        $("#ibody").empty();
        results.forEach(result => {
            const autuor = result.authors.join(",");
            $("#ibody").append(`
            <tr>
                <td style="display: none;">${result._id.$oid}</td>
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
        dt = $("#itable").DataTable({
            select: true
        });
        dt.column('0').order('desc').draw();
    }

    const getData = (keyword) => {
        if (blockUI && !blockUI.isBlocked()) {
            blockUI.block();
        }
        util.ajax.get("http://localhost:8888/base", {
            keyword: keyword,
        }, (result) => {
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
                util.ajax.put("http://localhost:8888/book", data, (result) => {
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
                util.ajax.post("http://localhost:8888/book", data, (result) => {
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
                util.ajax.get("http://localhost:8888/book", {
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
                        util.ajax.delete("http://localhost:8888/book", {
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
        dt = $("#itable").DataTable();
        document.querySelectorAll('textarea').forEach(autosize_element => {
            autosize(autosize_element);
        });
        for (let f in form) {
            form[f] = $(`[name="${f}"]`);
        }
        $('#ikeyword').on('keypress', function (e) {
            if (e.keyCode === 13) {
                getData($('#ikeyword').val());
            }
        });
        getData("");
        add();
        edit();
        del();
    }

    return {
        init: init,
    }
});