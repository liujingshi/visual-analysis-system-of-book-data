define(["text!./base.html", "util", "css!./base.css"], function (html, util) {

    let blockUI = null;
    let dt = null;

    const render = (results) => {
        dt.destroy();
        $("#ibody").empty();
        results.forEach(result => {
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
        dt = $("#itable").DataTable();
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

    const init = ($parent) => {
        $parent.append(html);
        blockUI = new KTBlockUI($("#itable")[0]);
        dt = $("#itable").DataTable();;
        $('#ikeyword').on('keypress', function (e) {
            if (e.keyCode === 13) {
                getData($('#ikeyword').val());
            }
        });
        getData("");
    }

    return {
        init: init,
    }
});