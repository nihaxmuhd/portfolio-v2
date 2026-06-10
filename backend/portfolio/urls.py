from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"skills", views.SkillViewSet, basename="skill")
router.register(r"projects", views.ProjectViewSet, basename="project")
router.register(r"experience", views.ExperienceViewSet, basename="experience")
router.register(r"messages", views.MessageViewSet, basename="message")

urlpatterns = [
    path("profile/", views.ProfileView.as_view(), name="profile"),
    path("stats/", views.StatsView.as_view(), name="stats"),
    path("resume/", views.ResumeView.as_view(), name="resume"),
    path("contact/", views.ContactView.as_view(), name="contact"),
    path("", include(router.urls)),
]
