from django.urls import path, include
from rest_framework import routers
from .views import DictionaryViewSet, DeleteEntryDefinitionView, ListPartOfSpeechView

app_name = "vocabulary"

router = routers.DefaultRouter()
router.register("dictionary", DictionaryViewSet, basename="dictionary")

urlpatterns = [
    path("part_of_speech", ListPartOfSpeechView.as_view(), name="part_of_speech"),
    path("definition", DeleteEntryDefinitionView.as_view(), name="definition"),
    path("", include(router.urls)),
]
