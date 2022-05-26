from tools import Response
import tornado.ioloop
import tornado.web
from database import Database, getSheetInsert

db = Database() # 创建数据库对象

def auth(method): # 身份验证装饰器

    def wrapper(self, *args, **kwargs):
        username = self.request.headers.get("Authorization", None) # 获取请求头token
        if username:
            self.user = db.getUser(username)
            method(self, *args, **kwargs)
        else:
            self.set_status(401)
            self.error("身份验证失败", {})

    return wrapper

class BaseHandler(tornado.web.RequestHandler): # Handler 基类
    def set_default_headers(self): # 设置默认响应头 允许跨域
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Headers", "*")
        self.set_header('Access-Control-Allow-Methods', '*')

    def options(self): # 跨域域请求直接通过
        self.finish({})

    def success(self, msg, data={}, token=None): # 请求成功返回数据封装
        res = Response.success(msg, data, token)
        self.write(res)

    def error(self, msg, data={}):
        res = Response.error(msg, data) # 请求失败返回数据封装
        self.write(res)

    def getParam(self, key): # 获取请求参数
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

class BookHandler(BaseHandler): # 图书Handler
    @auth
    def post(self): # 插入
        book = getSheetInsert("book") # 创建插入数据
        book["name"] = self.getParam("name") # 获取请求参数
        book["category"] = self.getParam("category") # 获取请求参数
        book["authors"] = self.getParam("authors").split(",") # 获取请求参数
        book["price"] = self.getParam("price") # 获取请求参数
        book["author_desc"] = self.getParam("author_desc") # 获取请求参数
        book["press"] = self.getParam("press") # 获取请求参数
        book["press_datetime"] = self.getParam("press_datetime") # 获取请求参数
        book["level"] = self.getParam("level") # 获取请求参数
        book["popularity"] = self.getParam("popularity") # 获取请求参数
        book["comment_count"] = self.getParam("comment_count") # # 获取请求参数 获取请求参数
        book["desc"] = self.getParam("desc")
        db.insertPress(book["press"]) # 插入出版社
        db.insertCate(book["category"]) # 插入分类
        db.insertBook(book) ## 插入图书
        self.success("成功")

    @auth
    def put(self): # 修改
        id = self.getParam("id") # 获取请求参数
        oldbook = db.getBookById(id) # 获取旧数据
        book = db.getBookById(id) # 再次获取旧数据
        if book:
            book["name"] = self.getParam("name") # 获取请求参数
            book["category"] = self.getParam("category") # 获取请求参数
            book["authors"] = self.getParam("authors").split(",") # 获取请求参数
            book["price"] = self.getParam("price") # 获取请求参数
            book["author_desc"] = self.getParam("author_desc") # 获取请求参数
            book["press"] = self.getParam("press") # 获取请求参数
            book["press_datetime"] = self.getParam("press_datetime") # 获取请求参数
            book["level"] = self.getParam("level") # 获取请求参数
            book["popularity"] = self.getParam("popularity") # 获取请求参数
            book["comment_count"] = self.getParam("comment_count") # 获取请求参数
            book["desc"] = self.getParam("desc") # 获取请求参数
            db.updateBook(oldbook, book) # 更新数据
            self.success("修改成功")
        else:
            self.set_status(500)
            self.error("图书信息不存在")

    @auth
    def delete(self): # 删除
        id = self.getParam("id") # 获取请求参数
        db.deleteBook(id) # 删除数据
        self.success("删除成功")

    @auth
    def get(self): # 获取
        id = self.getParam("id") # 获取请求参数
        bookinfo = db.getOneBook(id) # 获取图书数据
        if bookinfo:
            self.success("", bookinfo)
        else:
            self.set_status(500)
            self.error("图书信息不存在")

class LoginHandler(BaseHandler): # 登录Handler
    def post(self): # 登录请求
        username = self.getParam("username") # 获取请求参数
        password = self.getParam("password") # 获取请求参数
        user = db.verifyUser(username, password) # 验证用户
        if user:
            self.success("登录成功", user, user["username"])
        else:
            self.set_status(500)
            self.error("登录失败")

    @auth
    def get(self): # 获取用户信息
        id = self.getParam("id") # 获取请求参数
        userinfo = db.getOneUser(id) # 获取用户信息
        if userinfo:
            self.success("", userinfo)
        else:
            self.set_status(500)
            self.error("用户信息不存在")

class UserHandler(BaseHandler): # 用户Handler
    @auth
    def get(self):
        users = db.getUsers()
        self.success("", users)

    @auth
    def post(self):
        user = getSheetInsert("user") # 创建插入数据
        user["username"] = self.getParam("username") # 获取请求参数
        user["password"] = self.getParam("password") # 获取请求参数
        user["name"] = self.getParam("name") # 获取请求参数
        user["permission"] = self.getParam("permission") # 获取请求参数
        db.insertUser(user) # 插入用户
        self.success("成功")

    @auth
    def put(self):
        id = self.getParam("id") # 获取请求参数
        olduser = db.getUserById(id) # 获取旧数据
        user = db.getUserById(id) # 再次获取旧数据
        if user:
            user["username"] = self.getParam("username") # 获取请求参数
            user["password"] = self.getParam("password") # 获取请求参数
            user["name"] = self.getParam("name") # 获取请求参数
            user["permission"] = self.getParam("permission") # 获取请求参数
            db.updateUser(olduser, user) # 更新用户
            self.success("修改成功")
        else:
            self.set_status(500)
            self.error("用户信息不存在")

    @auth
    def delete(self):
        id = self.getParam("id") # 获取请求参数
        db.deleteUser(id) # 删除用户
        self.success("删除成功")

class BaseHandler(BaseHandler): # 基础信息Handler
    @auth
    def get(self):
        keyword = self.getParam("keyword") or "" # 获取请求参数
        results = db.getBooks(keyword) # 获取图书数据
        self.success("", results)

class PressHandler(BaseHandler): # 出版社Handler
    @auth
    def get(self):
        type = self.getParam("type") # 获取请求参数
        presses = db.getPresses() # 获取出版社数据
        info = [] # 高价书籍所属出版社统计
        price = [] # 出社版信息统计
        score = [] # 各出版社图书价格均值
        bp = [] # 各出版社出版图书口碑分析
        for press in presses: # 遍历出版社信息
            books = db.getBookByPress(press["name"]) # 通过出版社获取图书
            info.append({
                "name": press["name"],
                "num": len(books)
            })
            p = 0
            pc = 0
            s = 0
            sc = 0
            b = 0
            for book in books: # 遍历图书数据
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
        if type == "info": # 高价书籍所属出版社统计
            self.success("", info)
        elif type == "price": # 出社版信息统计
            self.success("", price)
        elif type == "score": # 各出版社图书价格均值
            self.success("", score)
        elif type == "big_price": # 各出版社出版图书口碑分析
            self.success("", bp)
        else:
            self.error("无效参数")

class LevelHandler(BaseHandler): # 人气Handler
    @auth
    def get(self):
        type = self.getParam("type") # 获取请求参数
        books = db.getBooks() # 获取图书数据
        tags = db.getTags() # 获取标签数据
        bp = [] # 人气标签词云
        price = [{ # 各星级图书数量统计直方图
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

        for tag in tags: # 遍历标签
            t = tag["name"]
            bp.append({
                "name": t,
                "num": len(db.getBookByTag(t))
            })

        for book in books: # 遍历图书
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
        if type == "cloud": # 人气标签词云
            self.success("", bp)
        elif type == "level": # 各星级图书数量统计直方图
            self.success("", price)
        else:
            self.error("无效参数")

class PriceHandler(BaseHandler): # 价格Handler
    @auth
    def get(self):
        type = self.getParam("type") # 获取请求参数
        books = db.getBooks() # 获取图书数据
        bp = [] # 高价书籍筛选
        price = [{ # 图书价格直方图
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

        for book in books: # 遍历图书
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
        if type == "bp": # 高价书籍筛选
            self.success("", bp)
        elif type == "price": # 图书价格直方图
            self.success("", price)
        else:
            self.error("无效参数")

class MsgHandler(BaseHandler): # 留言板Handler
    @auth
    def get(self):
        self.success("留言成功", db.getMsg())

    @auth
    def post(self):
        text = self.getParam("text") or "" # 获取请求参数
        msg = db.insertMsg(self.user["username"], text) # 留言
        if msg:
            self.success("留言成功")
        else:
            self.set_status("500")
            self.error("留言失败")

class SpiderHandler(BaseHandler): # 爬虫Handler
    def post(self):
        keyword = self.getParam("keyword") # 获取请求参数
        results = db.spider(keyword) # 开始爬虫
        self.success("", results)

def make_app(): # 路由配置
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/login", LoginHandler),
        # (r"/spider", SpiderHandler),
        (r"/base", BaseHandler),
        (r"/press", PressHandler),
        (r"/price", PriceHandler),
        (r"/msg", MsgHandler),
        (r"/level", LevelHandler),
        (r"/user", UserHandler),
        (r"/book", BookHandler),
    ])

if __name__ == "__main__":
    print("Server Start: ", "http://localhost:8888/")
    app = make_app() # 配置路由
    app.listen(8888) # 设置监听端口
    tornado.ioloop.IOLoop.current().start() # 启动服务器
