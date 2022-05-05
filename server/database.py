import pymongo
from os.path import isfile
from tools import FileAction, JsonAction
from spider import search, bookinfo5

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
    
    @get_database_sheet
    def verifyUser(self, username, password):
        users = self.user.find({
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
    def spider(self, keyword):
        bids = search(keyword)
        results = []
        for bid in bids:
            result = getSheetInsert("book")
            result = bookinfo5(bid, result)
            if result:
                dbResult = self.book.insert_one(result)
                results.append(dbResult)
        return results
