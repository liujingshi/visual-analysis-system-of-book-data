from tools import Request, HTMLSelector, JsonAction, Proxy
from copy import deepcopy

proxy=True
def proxies():
    return Proxy().get()

def search(keyword):
    url = "http://search.dangdang.com/"
    method = "GET"
    param = {
        "act": "input",
        "key": keyword,
    }
    req = Request(url, method, param, encoding="GB2312")
    res = req.start()
    result = []
    if res:
        html = HTMLSelector(res, encoding="GB2312")
        listHTML = html.find("#search_nature_rg ul")
        if listHTML:
            results = listHTML.getAll("li")
            for res in results:
                result.append(res["id"].replace("p", ""))
    return result

def bookdesc(id, pro):
    url = "http://product.dangdang.com/index.php"
    method = "GET"
    param = {
        "r": "callback/detail",
        "productId": id,
        "templateType": "publish",
        "describeMap": "0100003040:1",
        "shopId": "0",
        "categoryPath": "01.41.26.03.00.00",
    }
    req = Request(url, method, param, encoding="GB2312", proxy=proxy, proxies=pro)
    res = req.start()
    return res

def bookinfo(id, rst):
    try:
        pro = proxies()
        result = deepcopy(rst)
        url = "http://product.dangdang.com/{0}.html".format(id)
        method = "GET"
        req = Request(url, method, encoding="GB2312", proxy=proxy, proxies=pro)
        res = req.start()
        descres = bookdesc(id, pro)
        succ = True
        if res:
            try:
                html = HTMLSelector(res, encoding="GB2312")
                isSuc = False
                try:
                    htmldesc = HTMLSelector(JsonAction(descres).toObj()["data"]["html"], encoding="GB2312")
                    isSuc = True
                except:
                    pass
                nameHTML = html.get("#product_info .name_info h1")
                name = nameHTML["title"] # 书名
                result["name"] = name
                categoryHTML = html.getAll("#detail-category-path .lie a")
                if len(categoryHTML) > 0:
                    category = categoryHTML[-1].text # 分类
                    result["category"] = category
                priceHTML = html.get("#dd-price")
                price = float(priceHTML.text.replace("\n", "").replace("\r", "").replace(" ", "").replace("$", "").replace("¥", "")) # 价格
                result["price"] = price
                authorsHTML = html.getAll("a[dd_name='作者']")
                authors = [] # 作者
                for item in authorsHTML:
                    authors.append(item.text.replace("\n", "").replace("\r", "").replace(" ", ""))
                result["authors"] = authors
                if isSuc:
                    authorDescHTML = htmldesc.get("#authorIntroduction .descrip")
                    if authorDescHTML:
                        authorDesc = authorDescHTML.text.replace("\n", "").replace("\r", "").replace(" ", "") # 作者简介
                        result["author_desc"] = authorDesc
                pressHTML = html.get("a[dd_name='出版社']")
                press = pressHTML.text.replace("\n", "").replace("\r", "").replace(" ", "") # 出版社
                result["press"] = press
                pressDatetimeHTML = html.getAll(".messbox_info span.t1")
                if len(pressDatetimeHTML) > 2:
                    pressDate = pressDatetimeHTML[2].text.replace("\n", "").replace("\r", "").replace(" ", "").replace("出版时间", "").replace(":", "") # 出版日期
                    result["press_datetime"] = pressDate
                levelHTML = html.get("#messbox_info_comm_num .star")
                level = float(levelHTML["style"].replace("\n", "").replace("\r", "").replace(" ", "").replace("width", "").replace(":", "").replace("%", "")) # 星级
                result["level"] = level
                popularityHTML = html.get("#collect_left")
                collect = popularityHTML.text.replace("\n", "").replace("\r", "").replace(" ", "")
                popularity = collect.replace("(", "").replace(")", "").replace("人气", "").replace("收藏商品", "")
                if popularity != "":
                    popularity = int(popularity) # 人气
                    result["popularity"] = popularity
                # commentsHTML = html.getAll("#comment_list")
                # print(commentsHTML)
                commentCountHTML = html.get("#comm_num_down")
                commentCount = int(commentCountHTML.text.replace("\n", "").replace("\r", "").replace(" ", "")) # 评论数
                result["comment_count"] = commentCount
                if isSuc:
                    descHTML = htmldesc.get("#content .descrip")
                    if descHTML:
                        result["desc"] = descHTML.text.replace("\n", "").replace("\r", "").replace(" ", "") # 简介
            except:
                succ = False
        if succ:
            return result
    except:
        pass
    return None

def bookinfo5(id, rst):
    count = 0
    while count < 5:
        result = bookinfo(id, rst)
        if result:
            return result
        else:
            count += 1
    return None
