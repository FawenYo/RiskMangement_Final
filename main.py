import os

import redis
from flask import Flask, render_template, request, jsonify
from generate import generate

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("home.html")


@app.route("/predict")
def predict():
    return render_template("predict.html")


@app.route("/api/text_generate", methods=["POST"])
def api_text_generate():
    topic = request.get_json(force=True).get("topic")
    min_len = request.get_json(force=True).get("min_len")
    generate_text = generate(topic=topic, min_len=min_len)
    return jsonify({"text": generate_text})


@app.route("/api/set_server", methods=["POST"])
def api_set_server():
    server_url = request.get_json().get("server_url")
    r = redis.Redis.from_url(os.getenv("REDIS_URL"))
    r.set("colab_server", server_url)
    return 200


@app.route("/api/get_server", methods=["GET"])
def api_get_server():
    r = redis.Redis.from_url(os.getenv("REDIS_URL"))
    server_url = r.get("colab_server").decode("utf-8")
    return {"server_url": server_url}
