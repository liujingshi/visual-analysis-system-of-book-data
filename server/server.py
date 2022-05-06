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

class BaseHandler(BaseHandler):
    @auth
    def get(self):
        keyword = self.getParam("keyword") or ""
        results = db.getBooks(keyword)
        self.success("", results)

class PressHandler(BaseHandler):
    @auth
    def get(self):
        type = self.getParam("type")
        presses = db.getPresses()
        info = []
        price = []
        score = []
        bp = []
        for press in presses:
            books = db.getBookByPress(press["name"])
            info.append({
                "name": press["name"],
                "num": len(books)
            })
            p = 0
            pc = 0
            s = 0
            sc = 0
            b = 0
            for book in books:
                try:
                    p += float(book["price"])
                    pc += 1
                except:
                    pass
                try:
                    s += float(book["level"])
                    sc += 1
                except:
                    pass
                try:
                    if float(book["price"]) >= 50:
                        b += 1
                except:
                    pass
            if pc > 0:
                price.append({
                    "name": press["name"],
                    "num": p / pc,
                })
            if sc > 0:
                score.append({
                    "name": press["name"],
                    "num": s / sc,
                })
            bp.append({
                "name": press["name"],
                "num": b,
            })
        if type == "info":
            self.success("", info)
        elif type == "price":
            self.success("", price)
        elif type == "score":
            self.success("", score)
        elif type == "big_price":
            self.success("", bp)
        else:
            self.error("无效参数")

class LevelHandler(BaseHandler):
    @auth
    def get(self):
        type = self.getParam("type")
        books = db.getBooks()
        tags = db.getTags()
        bp = []
        price = [{
            "name": "一星",
            "num": 0,
        },{
            "name": "二星",
            "num": 0,
        },{
            "name": "三星",
            "num": 0,
        },{
            "name": "四星",
            "num": 0,
        },{
            "name": "五星",
            "num": 0,
        }]

        for tag in tags:
            t = tag["name"]
            bp.append({
                "name": t,
                "num": len(db.getBookByTag(t))
            })

        for book in books:
            try:
                ppp = float(book["level"])
                if 0 < ppp <= 20:
                    price[0]["num"] += 1
                elif 20 < ppp <= 40:
                    price[1]["num"] += 1
                elif 40 < ppp <= 60:
                    price[2]["num"] += 1
                elif 60 < ppp <= 80:
                    price[3]["num"] += 1
                elif 80 < ppp:
                    price[4]["num"] += 1
            except:
                pass
        if type == "cloud":
            self.success("", bp)
        elif type == "level":
            self.success("", price)
        else:
            self.error("无效参数")

class PriceHandler(BaseHandler):
    @auth
    def get(self):
        type = self.getParam("type")
        books = db.getBooks()
        bp = []
        price = [{
            "name": "0~20",
            "num": 0,
        },{
            "name": "20~50",
            "num": 0,
        },{
            "name": "50~100",
            "num": 0,
        },{
            "name": "100~200",
            "num": 0,
        },{
            "name": "200~500",
            "num": 0,
        },{
            "name": "500+",
            "num": 0,
        }]

        for book in books:
            try:
                ppp = float(book["price"])
                if ppp >= 50:
                    bp.append(book)
                if 0 < ppp <= 20:
                    price[0]["num"] += 1
                elif 20 < ppp <= 50:
                    price[1]["num"] += 1
                elif 50 < ppp <= 100:
                    price[2]["num"] += 1
                elif 100 < ppp <= 200:
                    price[3]["num"] += 1
                elif 200 < ppp <= 500:
                    price[4]["num"] += 1
                elif 500 < ppp:
                    price[5]["num"] += 1
            except:
                pass
        if type == "bp":
            self.success("", bp)
        elif type == "price":
            self.success("", price)
        else:
            self.error("无效参数")

class MsgHandler(BaseHandler):
    @auth
    def post(self):
        text = self.getParam("text") or ""
        msg = db.insertMsg(self.user["username"], text)
        if msg:
            self.success("留言成功")
        else:
            self.set_status("500")
            self.error("留言失败")

class SpiderHandler(BaseHandler):
    def post(self):
        keyword = self.getParam("keyword")
        results = db.spider(keyword)
        self.success("", results)

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/login", LoginHandler),
        (r"/spider", SpiderHandler),
        (r"/base", BaseHandler),
        (r"/press", PressHandler),
        (r"/price", PriceHandler),
        (r"/msg", MsgHandler),
        (r"/level", LevelHandler),
    ])

if __name__ == "__main__":
    print("Server Start: ", "http://localhost:8888/")
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
