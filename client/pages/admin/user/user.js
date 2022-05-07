define(["text!./user.html", "util", "css!./user.css"], function (html, util) {

    let blockUI = null;
    let dt = null;

    const render = (results) => {
        dt.destroy();
        $("#ibody").empty();
        results.forEach(result => {
            $("#ibody").append(`
            <tr>
                <td>${result.name}</td>
                <td>${result.username}</td>
                <td>${result.permission}</td>
            </tr>
            `);
        });
        dt = $("#itable").DataTable();
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

    const add = () => {}

    const edit = () => {}

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
                    
                }
            });
        })
    }

    const init = ($parent) => {
        $parent.append(html);
        blockUI = new KTBlockUI($("#itable")[0]);
        dt = $("#itable").DataTable();;
        getData();
        add();
        edit();
        del();
    }

    return {
        init: init,
    }
});