from .base_class import BaseClass

class FileAction(BaseClass):

    def __init__(self,
                filename="./fileaction",
                encoding="utf-8"):
        self.filename = filename
        self.encoding = encoding

    def read(self):
        f = open(self.filename, "r", encoding=self.encoding)
        result = f.read()
        f.close()
        return result

    def readLines(self):
        f = open(self.filename, "r", encoding=self.encoding)
        result = f.readlines()
        f.close()
        for i in range(len(result)):
            result[i] = result[i].replace("\n", "").replace("\r", "")
        return result

    def write(self, text = ""):
        f = open(self.filename, "w", encoding=self.encoding)
        f.write(text)
        f.close()
