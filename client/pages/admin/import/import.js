define(["text!./import.html", "util", "css!./import.css"], function (html, util) {

    const init = ($parent) => { // 初始化页面
        $parent.append(html);
    }

    return {
        init: init,
    }
});