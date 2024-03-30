from rest_framework import serializers
from .models import QuizSchedule, QuizCount


class BulkQuizScheduleSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        for quiz_schedule_instance, data in zip(instance, validated_data):
            quiz_schedule_instance.rate = data.get("rate")
            quiz_schedule_instance.interval = data.get("interval")
            quiz_schedule_instance.next_date = data.get("next_date")

        QuizSchedule.objects.bulk_update(instance, fields=["rate", "interval", "next_date"])
        return instance


class QuizScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizSchedule
        fields = ["rate", "interval", "next_date"]
        list_serializer_class = BulkQuizScheduleSerializer


class BulkQuizCountSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        for quiz_count_instance, data in zip(instance, validated_data):
            quiz_count_instance.trial = data.get("trial")
            quiz_count_instance.failure = data.get("failure")

        QuizCount.objects.bulk_update(instance, fields=["trial", "failure"])
        return instance


class QuizCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizCount
        fields = ["trial", "failure"]
        list_serializer_class = BulkQuizCountSerializer
        