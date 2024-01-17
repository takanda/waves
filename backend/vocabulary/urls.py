from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VocabularyModelViewSet, BulkCreateVocabularyView, ListPartOfSpeechView


router = DefaultRouter()
router.register("vocabulary", VocabularyModelViewSet, basename="vocabulary")

app_name = "vocabulary"
urlpatterns = [
    path("", include(router.urls)),
    path("vocabulary/insert", BulkCreateVocabularyView.as_view(), name="insert"),
    path("vocabulary/part_of_speech", ListPartOfSpeechView.as_view(), name="part_of_speech"),
]
