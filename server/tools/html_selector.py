from .base_class import BaseClass
from bs4 import BeautifulSoup

class HTMLSelector(BaseClass):

    def __init__(self,
                html=None,
                encoding="UTF-8"):
        self.html = html
        self.encoding = encoding
        self.htmlObj = BeautifulSoup(self.html, "html.parser")
        self.htmlObj.encode = self.encoding

    def find(self, selector):
        rst = self.htmlObj.select_one(selector)
        if rst:
            result = HTMLSelector("<div></div>")
            result.htmlObj = rst
            return result
        return None

    def findAll(self, selector):
        rsts = self.htmlObj.select(selector)
        result = []
        for rst in rsts:
            tmp = HTMLSelector("<div></div>")
            tmp.htmlObj = rst
            result.append(tmp)
        return result

    def get(self, selector):
        return self.htmlObj.select_one(selector)

    def getAll(self, selector):
        return self.htmlObj.select(selector)
