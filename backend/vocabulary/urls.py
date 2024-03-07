from django.urls import path, include
from rest_framework import routers
from .views import DictionaryViewSet, DeleteEntryDefinitionView, ValicatateEntryView, ListPartOfSpeechView

app_name = "vocabulary"

router = routers.DefaultRouter()
router.register("dictionary", DictionaryViewSet, basename="dictionary")

urlpatterns = [
    path("part_of_speech", ListPartOfSpeechView.as_view(), name="part_of_speech"),
    path("definition", DeleteEntryDefinitionView.as_view(), name="definition"),
    path("check_entry/<str:entry>", ValicatateEntryView.as_view(), name="check_entry"),
    path("", include(router.urls)),
]
