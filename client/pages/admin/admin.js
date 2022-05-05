define(["text!./admin.html", "css!./admin.css"], function(html) {
    
    const init = () => {
        $("#app").empty();
        $("#app").append(html);
    }

    return {
        init: init,
    }
});