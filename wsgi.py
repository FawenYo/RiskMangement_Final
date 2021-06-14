from werkzeug.middleware.dispatcher import DispatcherMiddleware

from main import app as flask_app
from trend import dash_app as dash_app

application = DispatcherMiddleware(
    flask_app,
    {
        "/trend": dash_app.server,
    },
)
