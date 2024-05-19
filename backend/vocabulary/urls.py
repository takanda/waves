from django.urls import path, include
from rest_framework import routers
from .views import DictionaryViewSet, DeleteEntryDefinitionView, ValicatateEntryView, ListPartOfSpeechView, CreateEntryDefinitionView

app_name = "vocabulary"

router = routers.DefaultRouter()
router.register("dictionary", DictionaryViewSet, basename="dictionary")

urlpatterns = [
    path("part_of_speech", ListPartOfSpeechView.as_view(), name="part_of_speech"),
    path("definition/delete", DeleteEntryDefinitionView.as_view(), name="delete_definition"),
    path("definition/create", CreateEntryDefinitionView.as_view(), name="create_definition"),
    path("check_entry/<str:entry>", ValicatateEntryView.as_view(), name="check_entry"),
    path("", include(router.urls)),
]
