define(["text!./message.html", "util", "css!./message.css"], function (html, util) {

    let blockUI = null;  // Loading对象

    const render = (results) => {  // 渲染方法
        const groupByFromUser = results.reduce((group, item) => {  // groupBy操作
            const { from_user } = item;
            group[from_user] = group[from_user] ?? [];
            group[from_user].push(item);
            return group;
        }, {});
        const boards = [];
        for (let key in groupByFromUser) { // 遍历group
            const item = {
                id: key,
                title: "用户：" + key,
                item: [],
            };
            boards.push(item); // 插入数据
            for (let i in groupByFromUser[key]) {
                item.item.push({
                    title: `<span class="font-weight-bold">${groupByFromUser[key][i].message}</span>`
                });
            }
        }
        var kanban = new jKanban({ // 初始化看板
            element: '#kt_docs_jkanban_basic',
            gutter: '0',
            widthBoard: '250px',
            boards: boards,
        });
    }

    const getData = () => { // 获取数据
        if (blockUI && !blockUI.isBlocked()) {
            blockUI.block();  // 开启Loading
        }
        util.ajax.get("http://localhost:8888/msg", {}, (result) => {
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
        blockUI = new KTBlockUI($("#kt_docs_jkanban_basic")[0]);
        getData();
    }

    return {
        init: init,
    }
});