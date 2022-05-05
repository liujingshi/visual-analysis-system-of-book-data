define(["text!./login.html", "util", "css!./login.css"], function(html, util) {
    
    const init = () => {
        $("#app").empty();
        $("#app").append(html);
        
        $("#kt_sign_in_form").submit(() => {
            const username = kt_sign_in_form.username.value;
            const password = kt_sign_in_form.password.value;
            util.ajax.post("http://localhost:8888/login", {
                username: username,
                password: password,
            }, (result) => {
                console.log(result);
            });
            util.ajax.get("http://localhost:8888/")
            return false;
        });
    }

    return {
        init: init,
    }
});