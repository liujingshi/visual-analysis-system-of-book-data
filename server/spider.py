from tools import Request, HTMLSelector, FileAction

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

def bookinfo(id):
    url = "http://product.dangdang.com/{0}.html".format(id)
    method = "GET"
    req = Request(url, method, encoding="GB2312")
    res = req.start()
    if res:
        html = HTMLSelector(res, encoding="GB2312")
        nameHTML = html.get("#product_info .name_info h1")
        name = nameHTML["title"] # 书名
        print("书名:", name)
        categoryHTML = html.getAll("#detail-category-path .lie a")
        if len(categoryHTML) > 0:
            category = categoryHTML[-1].text # 分类
            print("分类:", category)
        priceHTML = html.get("#dd-price")
        price = float(priceHTML.text.replace("\n", "").replace("\r", "").replace(" ", "").replace("$", "").replace("¥", "")) # 价格
        print("价格:", price)
        authorsHTML = html.getAll("a[dd_name='作者']")
        authors = [] # 作者
        for item in authorsHTML:
            authors.append(item.text.replace("\n", "").replace("\r", "").replace(" ", ""))
        print("作者:", authors)
        authorDescHTML = html.get("#authorIntroduction .descrip")
        if authorDescHTML:
            authorDesc = authorDescHTML.text # 作者简介
            print("作者简介:", authorDesc)
        pressHTML = html.get("a[dd_name='出版社']")
        press = pressHTML.text.replace("\n", "").replace("\r", "").replace(" ", "") # 出版社
        print("出版社:", press)
        pressDatetimeHTML = html.getAll(".messbox_info span.t1")
        if len(pressDatetimeHTML) > 2:
            pressDate = pressDatetimeHTML[2].text.replace("\n", "").replace("\r", "").replace(" ", "").replace("出版时间", "").replace(":", "") # 出版日期
            print("出版日期:", pressDate)
        levelHTML = html.get("#messbox_info_comm_num .star")
        level = int(levelHTML["style"].replace("\n", "").replace("\r", "").replace(" ", "").replace("width", "").replace(":", "").replace("%", "")) # 星级
        print("星级:", level)
        popularityHTML = html.get("#collect_left")
        collect = popularityHTML.text.replace("\n", "").replace("\r", "").replace(" ", "")
        popularity = collect.replace("(", "").replace(")", "").replace("人气", "").replace("收藏商品", "")
        if popularity != "":
            popularity = int(popularity) # 人气
            print("人气:", popularity)
        # commentsHTML = html.getAll("#comment_list")
        # print(commentsHTML)
        commentCountHTML = html.get("#comm_num_down")
        commentCount = int(commentCountHTML.text.replace("\n", "").replace("\r", "").replace(" ", "")) # 评论数
        print("评论数:", commentCount)
        # descHTML = html.get("#content")
        # print(descHTML)

ids = search("果壳中的宇宙")
bookinfo(ids[0])
