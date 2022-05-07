define([
    "text!./admin.html", 
    "./get/get",
    "./import/import",
    "./user/user",
    "./base/base",
    "css!./admin.css"
], function(
    html,
    get,
    imp,
    user,
    base
) {

    const dataRouter = [
        {
            url: "get",
            view: get,
            name: "数据获取",
        },
        {
            url: "import",
            view: imp,
            name: "数据导入",
        },
        {
            url: "manage",
            view: base,
            name: "图书管理",
        },
    ];

    const sysRouter = [
        {
            url: "user",
            view: user,
            name: "用户管理",
        },
        {
            url: "home",
            view: {
                init: ($parent) => {
                    window.location.hash = "/home";
                    window.location.reload();
                }
            },
            name: "查看前台",
        },
    ];
    
    const init = () => {
        $("#app").append(html);
        KTMenu.createInstances();

        $("#data-menu").empty();
        $("#sys-menu").empty();
        dataRouter.forEach(r => {
            const $item = $(`
            <div class="menu-item">
                <a href="javascript:;" class="menu-link py-3">
                    <span class="menu-bullet">
                        <span class="bullet bullet-dot"></span>
                    </span>
                    <span class="menu-title">${r.name}</span>
                </a>
            </div>
            `);
            $("#data-menu").append($item);
            $item.on("click", () => {
                $(".admin-body").empty();
                r.view.init($(".admin-body"));
            });
        });
        sysRouter.forEach(r => {
            const $item = $(`
            <div class="menu-item">
                <a href="javascript:;" class="menu-link py-3">
                    <span class="menu-bullet">
                        <span class="bullet bullet-dot"></span>
                    </span>
                    <span class="menu-title">${r.name}</span>
                </a>
            </div>
            `);
            $("#sys-menu").append($item);
            $item.on("click", () => {
                $(".admin-body").empty();
                r.view.init($(".admin-body"));
            });
        });
        
    }

    return {
        init: init,
    }
});