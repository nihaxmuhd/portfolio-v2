from django.urls import path

from . import views
from .views import create_admin

app_name = "accounts"

urlpatterns = [
    path("login/", views.LoginView.as_view(), name="login"),
    path("logout/", views.LogoutView.as_view(), name="logout"),
    path("me/", views.MeView.as_view(), name="me"),

    path("reset-users/", views.reset_users, name="reset-users"),
]
