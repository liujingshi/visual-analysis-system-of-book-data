import requests
import json

class Proxy():

    def get(self):
        rst = requests.get("http://dev.qydailiip.com/api/?apikey=7d4eac724092c7873249427e4a57c59304afc2a4&num=1&type=json&line=win&proxy_type=putong&sort=rand&model=all&protocol=http&address=&kill_address=&port=&kill_port=&today=false&abroad=1&isp=&anonymity=")
        return {
            "http": "http://" + json.loads(rst.text)[0],
            "https": "https://" + json.loads(rst.text)[0],
        }
