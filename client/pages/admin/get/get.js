define(["text!./get.html", "util", "css!./get.css"], function (html, util) {

    const init = ($parent) => {
        $parent.append(html);
    }

    return {
        init: init,
    }
});