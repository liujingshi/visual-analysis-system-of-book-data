import pymongo
from bson.objectid import ObjectId
from os.path import isfile
from tools import FileAction, JsonAction
# from spider import search, bookinfo5
from bson import json_util
import time

database_name = "vasofbd"
database_sheet_prefix = "vasofbd_"
database_field_prefix = []
database_url = "mongodb://localhost:27017/"

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

def getSheetName(key):
    if key in database_sheets.keys():
        return database_sheet_prefix + database_sheets[key]
    return None

def getSheetInsert(key):
    if key in database_sheets.keys():
        path = "./database/{0}.json".format(database_sheets[key])
        if isfile(path):
            text = FileAction(path).read()
            return JsonAction(text).toObj()
    return None

def getSheetCreate(key):
    if key in database_sheets.keys():
        path = "./database/create/{0}.json".format(database_sheets[key])
        if isfile(path):
            text = FileAction(path).read()
            return JsonAction(text).toObj()
    return None


def get_database_sheet(method):

    def wrapper(self, *args, **kwargs):
        collist = self.mydb.list_collection_names()
        for database_sheet in database_sheets.keys():
            sheetName = getSheetName(database_sheet)
            if sheetName:
                if not sheetName in collist:
                    sheet = self.mydb[sheetName]
                    datas = getSheetCreate(database_sheet)
                    if datas:
                        sheet.insert_many(datas)
        for database_sheet in database_sheets.keys():
            sheetName = getSheetName(database_sheet)
            if sheetName:
                setattr(self, database_sheet, self.mydb[sheetName])
        return method(self, *args, **kwargs)

    return wrapper


class Database:

    def __init__(self):
        self.myclient = pymongo.MongoClient(database_url)
        self.mydb = self.myclient[database_name]

    def find(self, sheet, where={}):
        result = []
        for item in sheet.find(where):
            result.append(JsonAction(json_util.dumps(item)).toObj())
        return result

    
    @get_database_sheet
    def verifyUser(self, username, password):
        users = self.find(self.user, {
            "username": username,
            "password": password,
        })
        for item in users:
            return item
        return None

    @get_database_sheet
    def getUser(self, username):
        return self.user.find_one({
            "username": username,
        })

    @get_database_sheet
    def getUsers(self):
        return self.find(self.user)

    @get_database_sheet
    def getBooks(self, keyword=""):
        return self.find(self.book, {
            "name": {'$regex': keyword},
        })

    @get_database_sheet
    def getPresses(self):
        return self.find(self.press, {})

    @get_database_sheet
    def getTags(self):
        return self.find(self.tag, {})

    @get_database_sheet
    def getBookByPress(self, press):
        return self.find(self.book, {
            "press": press,
        })

    @get_database_sheet
    def getBookByTag(self, tag):
        return self.find(self.book, {
            "tags": tag,
        })

    @get_database_sheet
    def insertMsg(self, username, text):
        msg = getSheetInsert("msg")
        msg["from_user"] = username
        msg["message"] = text
        msg["datetime"] = time.localtime()
        return self.msg.insert_one(msg)

    @get_database_sheet
    def getMsg(self):
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
    def insertCate(self, name):
        if not self.cate.find_one({
            "name": name
        }):
            self.cate.insert_one({
                "name": name
            })

    @get_database_sheet
    def insertPress(self, name):
        if not self.press.find_one({
            "name": name
        }):
            self.press.insert_one({
                "name": name
            })

    @get_database_sheet
    def insertBook(self, book):
        self.book.insert_one(book)

    @get_database_sheet
    def updateBook(self, oldbook, book):
        self.book.update_one(oldbook, {"$set": book})

    @get_database_sheet
    def deleteBook(self, id):
        self.book.delete_one({
            "_id": ObjectId(id)
        })

    @get_database_sheet
    def getOneBook(self, id):
        rst = self.find(self.book, {
            "_id": ObjectId(id)
        })
        for t in rst:
            return t
        return None

    @get_database_sheet
    def getBookById(self, id):
        rst = self.book.find({
            "_id": ObjectId(id)
        })
        for r in rst:
            return r
        return None

    @get_database_sheet
    def insertUser(self, user):
        self.user.insert_one(user)

    @get_database_sheet
    def updateUser(self, olduser, user):
        self.user.update_one(olduser, {"$set": user})

    @get_database_sheet
    def deleteUser(self, id):
        self.user.delete_one({
            "_id": ObjectId(id)
        })

    @get_database_sheet
    def getOneUser(self, id):
        rst = self.find(self.user, {
            "_id": ObjectId(id)
        })
        for t in rst:
            return t
        return None

    @get_database_sheet
    def getUserById(self, id):
        rst = self.user.find({
            "_id": ObjectId(id)
        })
        for r in rst:
            return r
        return None
        
