import dash
import dash_bootstrap_components as dbc
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd

regtech_df = pd.read_csv("regtech.csv")
fintech_df = pd.read_csv("fintech.csv")

dash_app = dash.Dash(
    __name__, requests_pathname_prefix="/trend/", external_stylesheets=[dbc.themes.LUX]
)
dash_app.title = "Google 搜尋熱度趨勢"

colors = {"background": "#FFFFFF", "text": "#000000"}

dash_app.layout = html.Div(
    style={"backgroundColor": colors["background"]},
    children=[
        dbc.NavbarSimple(
            children=[
                dbc.NavItem(
                    dbc.NavLink("首頁", href="https://regtech-rm.herokuapp.com/")
                ),
                dbc.NavItem(
                    dbc.NavLink("問答預測", href="https://regtech-rm.herokuapp.com/predict")
                ),
            ],
            brand="風險管理期末報告",
            color="primary",
            dark=True,
        ),
        html.H1(
            children="Google 搜尋熱度趨勢",
            style={
                "textAlign": "center",
                "color": colors["text"],
                "margin-top": "50px",
            },
        ),
        dcc.Graph(
            id="Graph1",
            figure={
                "data": [
                    {
                        "x": regtech_df["月"],
                        "y": regtech_df["regtech: (全球)"],
                        "type": "line",
                        "name": "RegTech Trend",
                    },
                    {
                        "x": fintech_df["月"],
                        "y": fintech_df["fintech: (全球)"],
                        "type": "line",
                        "name": "Fintech Trend",
                    },
                ],
                "layout": {
                    "plot_bgcolor": colors["background"],
                    "paper_bgcolor": colors["background"],
                    "font": {"color": colors["text"]},
                },
            },
        ),
    ],
)


if __name__ == "__main__":
    dash_app.run_server(debug=True)
