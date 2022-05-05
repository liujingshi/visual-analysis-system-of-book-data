define([], function () {

    var setCurr = function (token) {
        sessionStorage.setItem("x-auth-token", token);
        // TODO 开发 - 测试环境 支持swagger 自动带入登录信息
        localStorage.setItem("x-auth-token", token);
    };

    var setJwt = function (token) {
        if (!token)
            return;
        setCurr(token);
    };

    // 清空当前 jwt token
    var cleanJwt = function () {
        sessionStorage.setItem("x-auth-token", "");
    };

    // 获取本地JWT
    var getJwt = function () {
        var token = sessionStorage.getItem("x-auth-token");
        return token;
    };

    // 更新Jwt
    var refreshJwt = function (token) {
        if (!token) {
            return;
        }
        setCurr(token);
    };

    return {
        get: getJwt,
        set: setJwt,
        clean: cleanJwt,
        refresh: refreshJwt
    };

});