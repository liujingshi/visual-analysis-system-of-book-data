define(["text!./import.html", "util", "css!./import.css"], function (html, util) {

    const init = ($parent) => {
        $parent.append(html);
    }

    return {
        init: init,
    }
});