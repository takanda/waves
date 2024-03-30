from django.urls import path
from .views import QuizStartView, QuizEndView

urlpatterns = [
    path("start/", QuizStartView.as_view(), name="start"),
    path("end/", QuizEndView.as_view(), name="end"),
]
