define(["text!./press.html", "css!./press.css"], function(html) {
    
    const init = ($parent) => {
        $parent.append(html);
    }

    return {
        init: init,
    }
});