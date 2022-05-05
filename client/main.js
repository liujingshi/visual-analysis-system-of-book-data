require.config({
    urlArgs: "v=" + (new Date()).getTime(),
    waitSeconds: 1500,
    paths: {
        'async': './libs/require/async',
        'text': './libs/require/text',
        'css': './libs/require/css',
        'json': './libs/require/json',
        'util': './libs/utils/util',
    },
    shim: {},
});

define([
    "util",
    "./pages/login/login",
    "./pages/home/home",
    "./pages/admin/admin",
], function (
    util,
    login,
    home,
    admin
) {
    util.setup.setUp();

    const router = [
        {
            url: "login",
            view: login,
        },
        {
            url: "home",
            view: home,
        },
        {
            url: "admin",
            view: admin,
        },
    ];

    const url = window.location.hash.replace(/\#/g, "");

    if (url !== "") {
        const arr = url.split("/");
        const r = router.find((t) => t.url === arr[1]);
        if (r) {
            r.view.init();
        } else {
            // 默认访问第一个路由
            router[0].view.init();
        }
    } else {
        // 默认访问第一个路由
        router[0].view.init();
    }


});
