define(["text!./message.html", "util", "css!./message.css"], function (html, util) {

    let blockUI = null;

    const render = (results) => {
        const groupByFromUser = results.reduce((group, item) => {
            const { from_user } = item;
            group[from_user] = group[from_user] ?? [];
            group[from_user].push(item);
            return group;
        }, {});
        const boards = [];
        for (let key in groupByFromUser) {
            const item = {
                id: key,
                title: "用户：" + key,
                item: [],
            };
            boards.push(item);
            for (let i in groupByFromUser[key]) {
                item.item.push({
                    title: `<span class="font-weight-bold">${groupByFromUser[key][i].message}</span>`
                });
            }
        }
        var kanban = new jKanban({
            element: '#kt_docs_jkanban_basic',
            gutter: '0',
            widthBoard: '250px',
            boards: boards,
        });
    }

    const getData = () => {
        if (blockUI && !blockUI.isBlocked()) {
            blockUI.block();
        }
        util.ajax.get("http://localhost:8888/msg", {}, (result) => {
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
        blockUI = new KTBlockUI($("#kt_docs_jkanban_basic")[0]);
        getData();
    }

    return {
        init: init,
    }
});