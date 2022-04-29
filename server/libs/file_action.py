from .base_class import BaseClass

class FileAction(BaseClass):

    def __init__(self, **args):
        self.filename = None
        self.encoding = None

        self._initialize()

        self._setProperty(args, "filename")
        self._setProperty(args, "encoding")
    

    def _initialize(self):
        self.filename = "./fileaction"
        self.encoding = "utf-8"

    def read(self):
        f = open(self.filename, "r", encoding=self.encoding)
        result = f.read()
        f.close()
        return result

    def write(self, text = ""):
        f = open(self.filename, "w", encoding=self.encoding)
        f.write(text)
        f.close()
