import os

import redis
from flask import Flask, render_template, request

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("home.html")


@app.route("/predict")
def predict():
    return render_template("predict.html")


@app.route("/api/set_server", methods=["POST"])
def api_set_server():
    server_url = request.get_json().get("server_url")
    r = redis.Redis.from_url(os.getenv("REDIS_URL"))
    r.set("colab_server", server_url)
    return 200


@app.route("/api/get_server", methods=["GET"])
def api_get_server():
    # r = redis.Redis.from_url(os.getenv("REDIS_URL"))
    r = redis.Redis.from_url(
        "redis://:pb5969aca57e58415aaa13b9fd67c5bad6e600d5f0dd11f127b428c91b7d609dd@ec2-54-221-236-65.compute-1.amazonaws.com:13469"
    )
    server_url = r.get("colab_server").decode("utf-8")
    return {"server_url": server_url}
