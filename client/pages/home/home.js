define(["text!./home.html", "css!./home.css"], function(html) {
    
    const init = () => {
        $("#app").empty();
        $("#app").append(html);
    }

    return {
        init: init,
    }
});