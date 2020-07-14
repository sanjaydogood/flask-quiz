from flask import Flask

app = Flask(__name__)
if app.config["ENV"] == "production":
    app.config.from_object("config.ProductionConfig")
    print(app.config["APP_TYPE"])
    print(app.config["SECRET_KEY"])
    # print("production")
else:
    app.config.from_object("config.DevelopmentConfig")
    print(app.config["APP_TYPE"])
    print(app.config["SECRET_KEY"])
    # print("development")
from app import views
