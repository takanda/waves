import datetime
from django.core.management.base import BaseCommand
from quiz.models import QuizSchedule


class Command(BaseCommand):

    def handle(self, *args, **options):
        all_schedules = QuizSchedule.objects.all()
        oldest_next_date = all_schedules.order_by("next_date").first().next_date
        elapsed_days = datetime.date.today() - oldest_next_date

        for schedule in all_schedules:
            schedule.next_date += elapsed_days

        QuizSchedule.objects.bulk_update(all_schedules, fields=["next_date"])
