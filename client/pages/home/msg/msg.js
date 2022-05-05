define(["text!./msg.html", "css!./msg.css"], function(html) {
    
    const init = ($parent) => {
        $parent.append(html);
    }

    return {
        init: init,
    }
});