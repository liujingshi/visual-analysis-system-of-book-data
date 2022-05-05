define([
    "text!./home.html",
    "./base/base",
    "./press/press",
    "./level/level",
    "./price/price",
    "./msg/msg",
    "css!./home.css"
], function (
    html,
    base,
    press,
    level,
    price,
    msg
) {

    const router = [
        {
            url: "base",
            view: base,
            name: "基本信息",
        },
        {
            url: "press",
            view: press,
            name: "出版社信息",
        },
        {
            url: "level",
            view: level,
            name: "人气信息",
        },
        {
            url: "price",
            view: price,
            name: "价格信息",
        },
        {
            url: "msg",
            view: msg,
            name: "留言板",
        },
    ];

    const init = () => {
        $("#app").append(html);

        $("#menu_items").empty();
        router.forEach(r => {
            const $item = $(`
            <div data-item="${r.url}" class="menu-item menu-lg-down-accordion me-lg-1">
                <span class="menu-link py-3">
                    <span class="menu-title">${r.name}</span>
                </span>
            </div>
            `);
            $("#menu_items").append($item);
            $item.on("click", () => {
                window.location.hash = "/home/" + r.url;
                window.location.reload();
            });
        })
        
        const url = window.location.hash.replace(/\#/g, "");

        if (url !== "") {
            const arr = url.split("/");
            if (arr.length > 2) {
                const r = router.find((t) => t.url === arr[2]);
                if (r) {
                    $("#content_body").empty();
                    r.view.init($("#content_body"));
                    $(`[data-item="${r.url}"]`).addClass("here");
                } else {
                    // 默认访问第一个路由
                    $("#content_body").empty();
                    router[0].view.init($("#content_body"));
                    $(`[data-item="${router[0].url}"]`).addClass("here");
                }
            } else {
                // 默认访问第一个路由
                $("#content_body").empty();
                router[0].view.init($("#content_body"));
                $(`[data-item="${router[0].url}"]`).addClass("here");
            }
        } else {
            // 默认访问第一个路由
            $("#content_body").empty();
            router[0].view.init($("#content_body"));
            $(`[data-item="${router[0].url}"]`).addClass("here");
        }
    }

    return {
        init: init,
    }
});