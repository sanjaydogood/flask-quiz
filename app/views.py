from app import app
import json
from flask import render_template,request,app as a
import pandas as pd
from ordered_set import OrderedSet
from app.save_data import save_json_data

app_type = ""
@app.route("/",methods= ['POST','GET'])
def home():

    if request.method == 'GET':
        questions_excel = pd.read_excel("Quiz Questions.xlsx", sheet_name='Sheet1')
        df = pd.DataFrame(questions_excel, columns=questions_excel.columns)
        global app_type
        app_type = df.columns[0]
        df.columns = df.iloc[0]
        df.drop(df.index[0], inplace=True)

        # We have only 3 columns as of now - Questions, Type, Options
        # Delimit options by newline '\n'
        # Q dict consists of - question,type,options(delimited)

        questions = []
        for index in range(len(df)):
            Q = {}

            row = df.iloc[index]

            question = row['Question'].split("\n")
            q_type = row['Type']
            required = row['Required']
            options = row['Options'].split("\n")

            Q['Question'] = question
            Q['Type'] = q_type

            Q['Image_names'] = [option for option in options if option.endswith(".png") or
                                option.endswith(".jpeg") or
                                option.endswith(".jpg")]
            Q['Options'] = list(OrderedSet(options) - OrderedSet(Q['Image_names']))
            Q['Required'] = required
            questions.append(Q)
        return render_template("home.html", qs=questions)

    elif request.method == 'POST':
        json_obj = json.loads(request.form.get('json_data', None))
        with open('file.json', 'w') as f:
            json.dump(json_obj, f)
        save_json_data("file.json")

        if app_type == "Quiz":
            return render_template("result.html")
        else:
            return render_template("thanks.html")

@app.route("/about")
def about():
    return "All about Flask"
