import pymongo
from bson.objectid import ObjectId
from os.path import isfile
from tools import FileAction, JsonAction
# from spider import search, bookinfo5
from bson import json_util
import time

database_name = "vasofbd" # 数据名称
database_sheet_prefix = "vasofbd_" # 表前缀
database_field_prefix = [] # 字段前缀
database_url = "mongodb://localhost:27017/" # 数据库连接url

database_sheets = {
    "user": "users",  # 用户表
    "msg": "messages",  # 留言板
    "press": "presses",  # 出版社
    "press": "presses",  # 出版社
    "press": "presses",  # 出版社
    "cate": "book_category",  # 图书分类
    "tag": "tags",  # 标签
    "book": "books",  # 图书
}

def getSheetName(key): # 获取表名称
    if key in database_sheets.keys():
        return database_sheet_prefix + database_sheets[key]
    return None

def getSheetInsert(key): # 获取表插入数据
    if key in database_sheets.keys():
        path = "./database/{0}.json".format(database_sheets[key])
        if isfile(path):
            text = FileAction(path).read()
            return JsonAction(text).toObj()
    return None

def getSheetCreate(key): # 获取表初始化数据
    if key in database_sheets.keys():
        path = "./database/create/{0}.json".format(database_sheets[key])
        if isfile(path):
            text = FileAction(path).read()
            return JsonAction(text).toObj()
    return None


def get_database_sheet(method): # 装饰器获取表

    def wrapper(self, *args, **kwargs):
        collist = self.mydb.list_collection_names() # 获取全部表
        for database_sheet in database_sheets.keys(): # 遍历全部表
            sheetName = getSheetName(database_sheet)
            if sheetName:
                if not sheetName in collist: # 如果不存在 则创建表
                    sheet = self.mydb[sheetName]
                    datas = getSheetCreate(database_sheet)
                    if datas:
                        sheet.insert_many(datas)
        for database_sheet in database_sheets.keys(): # 获取全部表对象
            sheetName = getSheetName(database_sheet)
            if sheetName:
                setattr(self, database_sheet, self.mydb[sheetName])
        return method(self, *args, **kwargs)

    return wrapper


class Database: # 数据库类

    def __init__(self):
        self.myclient = pymongo.MongoClient(database_url) # 连接数据库
        self.mydb = self.myclient[database_name] # 选择数据库

    def find(self, sheet, where={}): # 查找数据
        result = []
        for item in sheet.find(where):
            result.append(JsonAction(json_util.dumps(item)).toObj())
        return result

    
    @get_database_sheet
    def verifyUser(self, username, password): # 验证用户
        users = self.find(self.user, {
            "username": username,
            "password": password,
        })
        for item in users:
            return item
        return None

    @get_database_sheet
    def getUser(self, username): # 获取用户
        return self.user.find_one({
            "username": username,
        })

    @get_database_sheet
    def getUsers(self): # 获取用户
        return self.find(self.user)

    @get_database_sheet
    def getBooks(self, keyword=""): # 获取图书
        return self.find(self.book, {
            "name": {'$regex': keyword},
        })

    @get_database_sheet
    def getPresses(self): # 获取出版社信息
        return self.find(self.press, {})

    @get_database_sheet
    def getTags(self): # 获取标签
        return self.find(self.tag, {})

    @get_database_sheet
    def getBookByPress(self, press): # 通过出版社获取图书
        return self.find(self.book, {
            "press": press,
        })

    @get_database_sheet
    def getBookByTag(self, tag): # 通过标签获取图书
        return self.find(self.book, {
            "tags": tag,
        })

    @get_database_sheet
    def insertMsg(self, username, text): # 插入留言
        msg = getSheetInsert("msg")
        msg["from_user"] = username
        msg["message"] = text
        msg["datetime"] = time.localtime()
        return self.msg.insert_one(msg)

    @get_database_sheet
    def getMsg(self): # 获取留言
        return self.find(self.msg)

    # @get_database_sheet
    # def spider(self, keyword):
    #     for key in ["时间简史", "人生海海", "蛤蟆先生去看心理医生", "生死疲劳", "活着", "被讨厌的勇气", "房思琪的初恋乐园", "三体", "你当像鸟飞往你的山", 
    #     "青铜葵花", "大话中国艺术史", "语言表达第一课", "杀死一只知更鸟", "月光落在左手上", "百年孤独", "法治的细节"]:
    #         bids = search(key)
    #         results = []
    #         for bid in bids:
    #             result = getSheetInsert("book")
    #             result = bookinfo5(bid, result)
    #             if result:
    #                 dbResult = self.book.insert_one(result)
    #                 results.append(dbResult)
    #     return results

    @get_database_sheet
    def insertCate(self, name): # 插入分类
        if not self.cate.find_one({
            "name": name
        }):
            self.cate.insert_one({
                "name": name
            })

    @get_database_sheet
    def insertPress(self, name): # 插入出版社
        if not self.press.find_one({
            "name": name
        }):
            self.press.insert_one({
                "name": name
            })

    @get_database_sheet
    def insertBook(self, book): # 插入图书
        self.book.insert_one(book)

    @get_database_sheet
    def updateBook(self, oldbook, book): # 更新图书
        self.book.update_one(oldbook, {"$set": book})

    @get_database_sheet
    def deleteBook(self, id): # 删除图书
        self.book.delete_one({
            "_id": ObjectId(id)
        })

    @get_database_sheet
    def getOneBook(self, id): # 通过ID获取图书
        rst = self.find(self.book, {
            "_id": ObjectId(id)
        })
        for t in rst:
            return t
        return None

    @get_database_sheet
    def getBookById(self, id): # 通过ID获取图书
        rst = self.book.find({
            "_id": ObjectId(id)
        })
        for r in rst:
            return r
        return None

    @get_database_sheet
    def insertUser(self, user): # 插入用户
        self.user.insert_one(user)

    @get_database_sheet
    def updateUser(self, olduser, user): # 更新用户
        self.user.update_one(olduser, {"$set": user})

    @get_database_sheet
    def deleteUser(self, id): # 删除用户
        self.user.delete_one({
            "_id": ObjectId(id)
        })

    @get_database_sheet
    def getOneUser(self, id): # 通过ID获取用户
        rst = self.find(self.user, {
            "_id": ObjectId(id)
        })
        for t in rst:
            return t
        return None

    @get_database_sheet
    def getUserById(self, id): # 通过ID获取用户
        rst = self.user.find({
            "_id": ObjectId(id)
        })
        for r in rst:
            return r
        return None
        
