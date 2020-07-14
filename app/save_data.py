import json
import os
import openpyxl
import pandas as pd
import pytz
from datetime import datetime

def save_json_data(json_file):

    with open('{}'.format(json_file), 'r') as f:
        record_json = json.load(f)

    excel = "Database.xlsx"

    india_time = datetime.now(pytz.timezone('Asia/Kolkata'))
    date_time = india_time.strftime("%d/%m/%Y") + " " + india_time.strftime("%H:%M:%S")

    row = [date_time]

    # Check if file exists, then get columns and append
    if (os.path.exists("{}".format(excel))):
        wb = openpyxl.load_workbook(filename='{}'.format(excel))
        sheet = wb.active
        # columns = [cell.value for cell in sheet[1]]

        for col in sheet[1]:
            print(col.value)
            if col.value == "Timestamp":
                continue
            if (len(record_json[0]["{}".format(col.value)]) > 1):
                row += ["\n".join(record_json[0]["{}".format(col.value)])]
            else:
                row += record_json[0]["{}".format(col.value)]

        print(row)
        sheet.append(tuple(row))
        wb.save("{}".format(excel))

    # If file does not exist, then create one with appropriate columns from Quiz_questions.xlsx
    else:
        questions_excel = pd.read_excel("Quiz Questions.xlsx", sheet_name='Sheet1')
        df = pd.DataFrame(questions_excel, columns=questions_excel.columns)

        df.columns = df.iloc[0]
        df.drop(df.index[0], inplace=True)

        questions = tuple(["Timestamp"] + list(df["Question"]))
        wb = openpyxl.Workbook()
        sheet = wb.active
        sheet.append(questions)
        sheet.freeze_panes = "{}2".format(chr(ord('A') + len(questions)))
        for col in sheet[1]:

            if col.value == "Timestamp":
                continue
            if (len(record_json[0]["{}".format(col.value)]) > 1):
                row += ["\n".join(record_json[0]["{}".format(col.value)])]
            else:
                row += record_json[0]["{}".format(col.value)]

        sheet.append(tuple(row))
        wb.save("{}".format(excel))
