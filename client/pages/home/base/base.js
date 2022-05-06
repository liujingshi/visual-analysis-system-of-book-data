define(["text!./base.html", "util", "css!./base.css"], function (html, util) {

    let blockUI = null;

    const render = (results) => {
        $("#ibody").empty();
        results.forEach(result => {
            $("#ibody").appned(`
            <tr>
                <td>${result.name}</td>
                <td>${result.category}</td>
                <td>${result.price}</td>
                <td>${result.authors.join(",")}</td>
                <td>${result.press}</td>
                <td>${result.press_datetime}</td>
                <td>${result.popularity}</td>
                <td>${result.comment_count}</td>
            </tr>
            `);
        });
        $("#itable").DataTable();
    }

    const getData = (keyword) => {
        if (blockUI && !blockUI.isBlocked()) {
            blockUI.block();
        }
        util.ajax.post("http://localhost:8888/base", {
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