from django.urls import path
from .views import ListCreateVocabularyView, ListPartOfSpeechView, UpdateDeleteVocabularyView


app_name = "vocabulary"
urlpatterns = [
    path("vocabulary", ListCreateVocabularyView.as_view(), name="vocabulary"),
    path("vocabulary/part_of_speech", ListPartOfSpeechView.as_view(), name="part_of_speech"),
    path("vocabulary/<str:search_text>", UpdateDeleteVocabularyView.as_view(), name="vocabulary-list"),
]
