from urllib.parse import urlencode
from requests import session
from .base_class import BaseClass

class Request(BaseClass):

    def __init__(self, **args):
        """
        属性
        """
        self.url = None  # 请求url
        self.method = None  # 请求方法
        self.data = None  # 请求数据
        self.header = None  # 请求头
        self.encoding = None  # 字符
        self.session = None  # 会话
        
        # 初始化
        self._initialize()
        
        """
        用户传值
        """
        self._setProperty(args, "url")
        self._setProperty(args, "method")
        self._setProperty(args, "data")
        self._setProperty(args, "session")
        self._setProperty(args, "encoding")
        if self._existField(args, "header") and isinstance(args["header"], dict):
            self.setHeader(self, args["header"])

    def _initialize(self):
        self.url = None  # 请求url
        self.method = "GET"  # 请求方法
        self.data = {}  # 请求数据
        self.session = session()  # 会话
        self.encoding = "UTF-8"  # 字符
        self.header = {  # 请求头
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
        }

    def _get(self):
        if self.url:
            param = urlencode(self.data)
            if param != "":
                if "?" in self.url:
                    if self.url[-1] != "?":
                        param = "&" + param
                else:
                    param = "?" + param
            url_uri = self.url + param
            return self.session.get(url_uri, headers=self.header)
        return None

    def _post(self):
        if self.url:
            return self.session.post(self.url, data=self.data, headers=self.header)
        return None

    def setHeader(self, header = {}):
        for k, v in header.items():
            self.header[k] = v

    def start(self):
        response = None
        if self.method.upper() == "GET":
            response = self._get()
        elif self.method.upper() == "POST":
            response = self._post()
        if response and response.status_code == 200:
            response.encoding = self.encoding
            return response.text
        return None
        


