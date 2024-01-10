from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VocabularyModelViewSet


router = DefaultRouter()
router.register("vocabulary", VocabularyModelViewSet, basename="vocabulary")

app_name = "vocabulary"
urlpatterns = [
    path("", include(router.urls)),
]
