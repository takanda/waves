from django.db import models
from vocabulary.models import DictionaryEntry
import datetime


class DailyQuizLimit(models.Model):
    limit = models.IntegerField(default=100)

    class Meta:
        db_table = "DailyQuizLimit"


class QuizSchedule(models.Model):
    dictionary_entry = models.OneToOneField(DictionaryEntry, on_delete=models.CASCADE)
    rate = models.DecimalField(default=1.5, max_digits=3, decimal_places=2)
    interval = models.DurationField(default=datetime.timedelta(days=1))
    next_date = models.DateField(default=datetime.date.today)

    class Meta:
        db_table = "QuizSchedule"


class QuizCount(models.Model):
    dictionary_entry = models.OneToOneField(DictionaryEntry, on_delete=models.CASCADE)
    trial = models.IntegerField(default=0)
    failure = models.IntegerField(default=0)

    class Meta:
        db_table = "QuizCount"
