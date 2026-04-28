import json

COLLEGE_MAP = [
    "大气科学学院",
    "资源环境学院",
    "电子工程学院（大气探测学院）",
    "自动化学院",
    "通信工程学院（微电子学院）",
    "计算机学院",
    "软件工程学院",
    "网络空间安全学院",
    "光电工程学院（人工影响天气学院）",
    "应用数学学院",
    "管理学院",
    "物流学院",
    "统计学院",
    "文化艺术学院",
    "外国语学院",
    "马克思主义学院",
    "人工智能学院（区块链产业学院）"
]

organizations = []

id = 1

for name in COLLEGE_MAP:
    organizations.append({
        "id": "c" + id.__str__(),
        "name": name,
        "formal_name": "CUIT_"+name,
        "country": "CHN"
    })
    id += 1

with open("organizations.json", "w") as f:
    json.dump(organizations, f, indent=2)