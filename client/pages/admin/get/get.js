define(["text!./get.html", "util", "css!./get.css"], function (html, util) {

    const init = ($parent) => { // 初始化页面
        $parent.append(html);
    }

    return {
        init: init,
    }
});