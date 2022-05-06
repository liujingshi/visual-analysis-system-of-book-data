define(["text!./msg.html", "util", "css!./msg.css"], function(html, util) {
    
    const init = ($parent) => {
        $parent.append(html);
        const autosize_element = document.querySelector('#tomsg');
        autosize(autosize_element);
        $("#submit").on("click", () => {
            const text = $('#tomsg').val();
            util.ajax.post("http://localhost:8888/msg", {
                text: text,
            }, (result) => {
                if (result) {
                    $('#tomsg').val("");
                    toastr.success("留言成功");
                }
            })
        });
    }

    return {
        init: init,
    }
});