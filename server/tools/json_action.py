from .base_class import BaseClass
from json import loads, dumps

class JsonAction(BaseClass):

    def __init__(self,
                json=None):
        self.json = json

    def toObj(self):
        if self.json == None:
            self.json = "[]"
        return loads(self.json)

    def toStr(self):
        if self.json == None:
            self.json = []
        return dumps(self.json, ensure_ascii=False)
