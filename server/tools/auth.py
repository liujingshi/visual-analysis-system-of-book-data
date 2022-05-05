from .response import Response
import functools
import jwt

secret = "hhLgDUloTO2hKpawAGathnZEwNDbDEAOrNZQLj1DAzk="

def auth(method):
    @functools.wraps(method)
    async def wrapper(self, *args, **kwargs):
        tsessionid = self.request.headers.get("Authorization", None)
        if tsessionid:
            try:
                send_data = jwt.decode(tsessionid, secret, leeway=7*24*3600,
                                       options={"verify_exp": True})
                # user_id = send_data["id"]
                print(send_data)
                await method(self, *args, **kwargs)
                # try:
                #     user = await self.application.objects.get(User, id=user_id)
                #     self._current_user = user
                #     await method(self, *args, **kwargs)
                # except User.DoesNotExist as e:
                #     self.set_status(401)
            except jwt.ExpiredSignatureError as e:
                self.set_status(401)
                self.error("身份验证失败", {})
        else:
            self.set_status(401)
            self.error("身份验证失败", {})
        # self.finish({})

    return wrapper