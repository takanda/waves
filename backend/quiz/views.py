from rest_framework import generics, views, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
import datetime
from vocabulary.serializers import DictionarySerializer
from .models import QuizSchedule, QuizCount
from .serializers import QuizScheduleSerializer, QuizCountSerializer
from vocabulary.models import DictionaryEntry


class QuizStartView(generics.ListAPIView):
    serializer_class = DictionarySerializer

    def get_queryset(self):
        today_quiz = QuizSchedule.objects.filter(next_date=datetime.date.today())
        dictionary_entries = today_quiz.values_list("dictionary_entry", flat=True)
        return DictionaryEntry.objects.filter(id__in=dictionary_entries)


class QuizEndView(views.APIView):
    def post(self, request):
        schedule_instance = []
        count_instance = []
        updated_schedules = []
        updated_counts = []
        for item in request.data:
            entry = item["entry"]
            result = item["result"]

            updated_schedule = {}
            updated_count = {}
            
            entry_definition = get_object_or_404(DictionaryEntry, entry=entry)
            quiz_schedule = get_object_or_404(QuizSchedule, dictionary_entry=entry_definition)
            quiz_count = get_object_or_404(QuizCount, dictionary_entry=entry_definition)

            schedule_instance.append(quiz_schedule)
            count_instance.append(quiz_count)

            updated_count["trial"] = quiz_count.trial
            updated_count["failure"] = quiz_count.failure
            
            if result == "perfect":
                updated_schedule["rate"] = 2.0
            elif result == "pass":
                updated_schedule["rate"] = 1.5
            else:
                updated_schedule["rate"] = 1.5

            if result == "perfect" or result == "pass":
                updated_schedule["interval"] = quiz_schedule.interval * updated_schedule["rate"]
                updated_schedule["next_date"] = quiz_schedule.next_date + updated_schedule["interval"]
            else:
                updated_schedule["interval"] = datetime.timedelta(days=1)
                updated_schedule["next_date"] = datetime.date.today() + datetime.timedelta(days=1)
                updated_count["failure"] += 1

            updated_count["trial"] += 1
            
            updated_schedules.append(updated_schedule)
            updated_counts.append(updated_count)

        quiz_schedule_serializer = QuizScheduleSerializer(data=updated_schedules, instance=schedule_instance, many=True)
        quiz_schedule_serializer.is_valid(raise_exception=True)
        quiz_schedule_serializer.save()

        quiz_count_serializer = QuizCountSerializer(data=updated_counts, instance=count_instance, many=True)
        quiz_count_serializer.is_valid(raise_exception=True)
        quiz_count_serializer.save()
        
        return Response({"message": "更新完了"}, status=status.HTTP_200_OK)
