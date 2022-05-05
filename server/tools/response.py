from .json_action import JsonAction
from .base_class import BaseClass

class Response(BaseClass):

    @classmethod
    def json(cls, success, msg, data, token=None):
        return JsonAction(cls.obj(success, msg, data, token)).toStr()

    @classmethod
    def obj(cls, success, msg, data, token=None):
        return {
            "success": success,
            "msg": msg,
            "data": data,
            "token": token,
        }

    @classmethod
    def success(cls, msg, data, token=None):
        return cls.json(True, msg, data, token)

    @classmethod
    def error(cls, msg, data):
        return cls.json(False, msg, data)

    @classmethod
    def writeSuccess(cls, s, msg, data, token=None):
        s.write(cls.json(True, msg, data, token))

    @classmethod
    def writeError(cls, s, msg, data):
        s.write(cls.json(False, msg, data))
