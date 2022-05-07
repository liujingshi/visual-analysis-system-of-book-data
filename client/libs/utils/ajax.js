define(['./jwt'], function (jwt) {

    // 私有方法
    // 将 obj 对象里面的所有符合 ISO 日期格式的属性转换为日期对象
    var convertISODateStringPropertiesToDatetime = function (obj) {
        if (obj) {
            for (var prop in obj) {
                var v = obj[prop];

                if (typeof (v) == 'object') {
                    convertISODateStringPropertiesToDatetime(obj[prop]);
                } else if (v && v.toString && v.toString() &&
                    /\d{4}[-]\d{2}[-]\d{2}T\d{2}[:]\d{2}[:]\d{2}/.test(v.toString())) {
                    obj[prop] = new Date(Date.parse(v.toString().replace('T', ' ').replace(/[-]/g, '/')));
                }
            }
        }
    };

    // 私有方法
    // 公共请求成功方法
    var success = function (result, successfn, errorfn) {
        if (!(result instanceof Object))
            result = JSON.parse(result);
        convertISODateStringPropertiesToDatetime(result);

        if (result.success) {
            successfn(result);
        }
        else {
            if (errorfn)
                errorfn(result);
        }
    }

    var convertUri = function (url, id) {
    }

    // ajax封装
    // url 发送请求的地址
    // data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
    // async 默认值: true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
    //       注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
    // type 请求方式("POST" 或 "GET")， 默认为 "GET"
    // dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text
    // successfn 成功回调函数
    // errorfn 失败回调函数
    var ax = function (url, data, async, type, dataType, successfn, errorfn) {
        async = (async == null || async == "" || typeof (async) == "undefined") ? "true" : async;
        type = (type == null || type == "" || typeof (type) == "undefined") ? "post" : type;
        dataType = (dataType == null || dataType == "" || typeof (dataType) == "undefined") ? "json" : dataType;
        $.ajax({
            type: type,
            async: async,
            data: data,
            url: url,
            dataType: dataType,
            success: function (result) {
                success(result, successfn);
            },
            error: function (e) {
                if (errorfn)
                    errorfn(e);
            }
        });
    };


    // ajax封装
    // url 发送请求的地址
    // data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
    // successfn 成功回调函数
    var axse_sync = function (url, data, successfn, errorfn) {
        $.ajax({
            type: "post",
            data: data,
            url: url,
            async: false,
            dataType: "json",
            success: function (result) {
                success(result, successfn);
            },
            error: function (e) {
                if (errorfn)
                    errorfn(e);
            }
        });
    };

    // ajax封装
    // url 发送请求的地址
    // data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
    // dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text
    // successfn 成功回调函数
    // errorfn 失败回调函数
    var axse = function (url, data, successfn, errorfn) {
        $.ajax({
            type: "post",
            data: data,
            url: url,
            success: function (result) {
                success(result, successfn);
            },
            error: function (e) {
                if (errorfn)
                    errorfn(e);
            }
        });
    };

    var get = function (url, data, successfn, errorfn) {
        $.ajax({
            type: "GET",
            data: data,
            url: url,
            success: function (result) {
                success(result, successfn, errorfn);
            },
            error: function (e) {
                if (errorfn)
                    errorfn(e);
            }
        });
    };
    var get_sync = function (url, data, successfn, errorfn) {
        $.ajax({
            type: "GET",
            data: data,
            url: url,
            async: false,
            success: function (result) {
                success(result, successfn, errorfn);
            },
            error: function (e) {
                if (errorfn)
                    errorfn(e);
            }
        });
    };

    var post = function (url, data, successfn, errorfn) {
        $.ajax({
            type: "POST",
            data: data,
            url: url,

            success: function (result) {
                success(result, successfn, errorfn);
            },
            error: function (e) {
                if (errorfn)
                    errorfn(e);
            }
        });
    };

    var put = function (url, data, successfn, errorfn) {
        $.ajax({
            type: "POST",
            data: data,
            url: url,
            headers:
            {
                "X-HTTP-Method-Override": "PUT"
            },
            success: function (result) {
                success(result, successfn, errorfn);
            },
            error: function (e) {
                if (errorfn)
                    errorfn(e);
            }
        });
    };

    var del = function (url, data, successfn, errorfn) {
        $.ajax({
            type: "POST",
            data: data,
            url: url,
            headers:
            {
                "X-HTTP-Method-Override": "Delete"
            },
            success: function (result) {
                success(result, successfn, errorfn);
            },
            error: function (e) {
                if (errorfn)
                    errorfn(e);
            }
        });
    };

    var patch = function (url, data, successfn, errorfn) {
        $.ajax({
            type: "POST",
            data: data,
            url: url,
            headers:
            {
                "X-HTTP-Method-Override": "PATCH"
            },
            success: function (result) {
                success(result, successfn, errorfn);
            },
            error: function (e) {
                if (errorfn)
                    errorfn(e);
            }
        });
    }

    // 设置全局 ajax 默认参数
    // 设置 header jwt token
    var ajaxSetUp = function () {
        $.ajaxSetup({
            // 发送请求前，添加Authorization
            beforeSend: function (xhr) {
                var token = jwt.get();
                if (token) {
                    xhr.setRequestHeader('Authorization', token);
                }
            },
            // 请求结束后,更新token(如果需要的话)
            // 或 跳转登录页
            complete: function (xhr, status) {
                var result = xhr.responseJSON;
                // 更新 token
                if (!result) {
                    result = xhr.responseText;
                    if (!(result instanceof Object))
                        result = JSON.parse(result);
                }
                if (result && result.success) {
                    jwt.refresh(result.token);
                } else {
                    // 异常处理
                    switch (xhr.status) {
                        // Unauthorized 用户验证失败
                        case 401:
                            toastr.error(result.msg);
                            jwt.clean();
                            // window.location.hash = '/';
                            // window.location.reload();
                            break;
                        // bad request 服务器阻绝满足请求,用于验证性错误
                        case 400:
                            toastr.warning();(result.msg);
                            break;
                        // InternalServerError 系统异常
                        case 500:
                            // TODO 开发阶段对报错进行返回 正式上线关闭
                            toastr.error(result.msg);
                            break;
                        default:
                            break;
                    }
                }
            }
        });
    };

    return {
        setUp: ajaxSetUp,
        ax: ax,
        axse: axse,
        axse_sync: axse_sync,
        get: get,
        get_sync: get_sync,
        post: post,
        put: put,
        delete: del,
        patch: patch
    };
});