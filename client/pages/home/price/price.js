define(["text!./price.html", "css!./price.css"], function(html) {
    
    const init = ($parent) => {
        $parent.append(html);
    }

    return {
        init: init,
    }
});