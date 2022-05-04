from urllib.parse import urlencode
from requests import session as sess
from .base_class import BaseClass

class Request(BaseClass):

    def __init__(self,
                url=None,
                method="GET",
                data={},
                header={},
                encoding="UTF-8",
                session=None):
        self.url = url  # 请求url
        self.method = method  # 请求方法
        self.data = data  # 请求数据
        self.header = header  # 请求头
        self.encoding = encoding  # 字符
        self.session = session  # 会话

        if self.session == None:
            self.session = sess()
        
        if not "User-Agent" in self.header.keys():
            self.header["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36"

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
        


