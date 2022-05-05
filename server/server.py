from tools import Response, auth
import tornado.ioloop
import tornado.web
from datetime import datetime
import jwt

secret = "hhLgDUloTO2hKpawAGathnZEwNDbDEAOrNZQLj1DAzk="

class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Headers", "*")
        self.set_header('Access-Control-Allow-Methods', '*')

    def success(self, msg, data, token=None):
        res = Response.success(msg, data, token)
        self.write(res)

    def error(self, msg, data):
        res = Response.error(msg, data)
        self.write(res)

class MainHandler(BaseHandler):
    @auth
    def get(self):
        self.write("Hello, world")

class LoginHandler(BaseHandler):
    def post(self):
        payload = {
            "id": "8AD9B8B2-AA0D-4D77-935A-A49CB9036030",
            "username": "username",
            "exp": datetime.utcnow(),
        }
        token = jwt.encode(payload, secret, algorithm='HS256')
        self.success("登录成功", {}, str(token, encoding='utf-8'))

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/login", LoginHandler),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
