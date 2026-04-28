import pandas as pd
import json

# ===================== 配置项 =====================
EXCEL_FILE_PATH = "teams.xlsx"  # Excel文件路径（同目录直接写文件名）
JSON_SAVE_PATH = "team_data.json"  # 生成的JSON文件保存路径
# ==================================================

def generate_team_data(excel_path):
    """
    从Excel读取数据并生成指定格式的队伍数据列表
    """
    # 读取Excel文件
    df = pd.read_excel(excel_path)
    all_team_data = []

    # 遍历每一行数据
    for index, row in df.iterrows():
        # 提取字段
        icpc_id = row["ICPC_ID"]
        team_name = row["TEAM_NAME"]
        location = row["LOCATION"]
        groups_id = row["GROUPS_ID"]
        orid = row["ORGANIZATION_ID"]
        members = row["MEMBERS"]
        coaches = row["COACHES"]

        coaches = str(coaches) if coaches is not None and str(coaches) != 'nan' else ''
        members = str(members) if members is not None and str(members) != 'nan' else ''

        # 拼接 members 字段
        if coaches.strip() != "":
            members_str = f"Players: {members} Coaches: {coaches}"
        else:
            members_str = f"Players: {members}"

        team_data = {
            "id": icpc_id,
            "icpc_id": icpc_id,
            "group_ids": [groups_id],
            "name": team_name,
            "display_name": team_name,
            "organization_id": orid,
            "members": members_str,  # 填入拼接好的字符串
            "location": {"description": location}
        }
        all_team_data.append(team_data)

    return all_team_data

def generate_team_account(excel_path):
    df = pd.read_excel(excel_path)
    all_team_data = []

    # 遍历每一行数据
    for index, row in df.iterrows():
        # 提取字段
        icpc_id = row["ICPC_ID"]
        team_name = row["TEAM_NAME"]

        # 构造目标数据结构
        team_data = {
            "team": team_name,
            "team_id": icpc_id,
            "type": "team",
            "id": "User_{}".format(icpc_id),
            "username": icpc_id,
            "name": team_name
        }
        all_team_data.append(team_data)

    return all_team_data

def save_to_json(data, save_path):
    """
    将数据保存为格式化的JSON文件（中文不乱码）
    """
    with open(save_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"JSON文件已成功保存至：{save_path}")

if __name__ == "__main__":
    # 生成队伍数据
    team_list = generate_team_data(EXCEL_FILE_PATH)
    account = generate_team_account(EXCEL_FILE_PATH)
    # 保存为JSON文件
    save_to_json(team_list, JSON_SAVE_PATH)
    save_to_json(account, "account_"+JSON_SAVE_PATH)