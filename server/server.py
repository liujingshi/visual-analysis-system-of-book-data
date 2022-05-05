from tools import Response
import tornado.ioloop
import tornado.web
from database import Database

db = Database()

def auth(method):

    def wrapper(self, *args, **kwargs):
        username = self.request.headers.get("Authorization", None)
        if username:
            self.user = db.getUser(username)
            method(self, *args, **kwargs)
        else:
            self.set_status(401)
            self.error("身份验证失败", {})

    return wrapper

class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Headers", "*")
        self.set_header('Access-Control-Allow-Methods', '*')

    def options(self):
        self.finish({})

    def success(self, msg, data={}, token=None):
        res = Response.success(msg, data, token)
        self.write(res)

    def error(self, msg, data={}):
        res = Response.error(msg, data)
        self.write(res)

    def getParam(self, key):
        if key in self.request.arguments.keys():
            if len(self.request.arguments[key]) > 1:
                result = []
                for item in self.request.arguments[key]:
                    result.append(str(item, encoding="UTF-8"))
                return result
            if len(self.request.arguments[key]) == 1:
                return str(self.request.arguments[key][0], encoding="UTF-8")
        return None


class MainHandler(BaseHandler):
    @auth
    def get(self):
        self.success("成功")

class LoginHandler(BaseHandler):
    def post(self):
        username = self.getParam("username")
        password = self.getParam("password")
        user = db.verifyUser(username, password)
        if user:
            self.success("登录成功", {}, user["username"])
        else:
            self.set_status(500)
            self.error("登录失败")
        

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/login", LoginHandler),
    ])

if __name__ == "__main__":
    print("Server Start: ", "http://localhost:8888/")
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
