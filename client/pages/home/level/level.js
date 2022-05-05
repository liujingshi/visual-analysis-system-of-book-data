define(["text!./level.html", "css!./level.css"], function(html) {
    
    const init = ($parent) => {
        $parent.append(html);
    }

    return {
        init: init,
    }
});