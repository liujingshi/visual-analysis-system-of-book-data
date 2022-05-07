define(["text!./user.html", "util", "css!./user.css"], function (html, util) {

    const init = ($parent) => {
        $parent.append(html);
    }

    return {
        init: init,
    }
});