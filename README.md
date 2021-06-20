# RiskMangement_Final

Source Code of the Team 4 of Risk Management Class by Professor 何率慈

## Introduction

The Final project is to introduce RegTech and how it works.

## Files

- `WordCloud`: Scrap all the news from [金融管理監督委員會](https://www.fsc.gov.tw/ch/home.jsp?id=96&parentpath=0,2), then generate the word cloud of the content and analyze keyword frequency.
- `BERT/*`: Train BERT question answering model.
- `generator/*` and `generate.py`: Python version of the [唬爛產生器](https://github.com/StillFantastic/bullshit). Big thanks to
  fjp666666
- `Risk_Management_Final_Project_ML_Backend.ipynb`: Backend of the ML prediction. Because Heroku doesn't have GPU cores, answer prediction might be very slow with Heroku server, so I host the ML part on Google Colab, where I can use even NVIDIA V100 GPU.
- the rest of the files are the WEB framework of the project, using `Flask` with `Dash`.

## How to run

You can just install required packages with

```bash
pip install -r requirements.txt
```

and then type

```bash
gunicorn wsgi:application
```

to start up the server.

As for `Jupyter Notebook` files, you can also run it on Google Colab

- `BERT_Training_based.ipynb`: <a href="https://colab.research.google.com/drive/1o-lWFsgS9ZS-eeWLD6nZaICBTfDTdfeq?usp=sharing"><img style="display: inline-block;" src="https://colab.research.google.com/assets/colab-badge.svg"></a>
- `BERT_Training_CKIP_Lab.ipynb`: <a href="https://colab.research.google.com/drive/1qoquKN1Zf-HlUb9l95Tlhh8rtvGM05Vp?usp=sharing"><img style="display: inline-block;" src="https://colab.research.google.com/assets/colab-badge.svg"></a>
- `BERT_Training_RoBERTa_wwm_ext_large.ipynb`: <a href="https://colab.research.google.com/drive/1jo7pBasx-iOLgXobT3gPQWhQBLTzbnLr?usp=sharing"><img style="display: inline-block;" src="https://colab.research.google.com/assets/colab-badge.svg"></a>
- `BERT_Visualization.ipynb`: <a href="https://colab.research.google.com/drive/1l0HQmw9hP7d4nIN_IsWgqPXgP0RiGpks?usp=sharing"><img style="display: inline-block;" src="https://colab.research.google.com/assets/colab-badge.svg"></a>
- `WordCloud.ipynb`: <a href="https://colab.research.google.com/drive/1Ahvthbg3IJX-ZdmZ0f6eg_k_dX3UnXeZ?usp=sharing"><img style="display: inline-block;" src="https://colab.research.google.com/assets/colab-badge.svg"></a>
- `Risk_Management_Final_Project_ML_Backend.ipynb`: <a href="https://colab.research.google.com/drive/1fMCZPZZSfgxUhZuOQfkLCvG98yeGymLx?usp=sharing"><img style="display: inline-block;" src="https://colab.research.google.com/assets/colab-badge.svg"></a>
