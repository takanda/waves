import datetime
from django.core.management.base import BaseCommand
from quiz.models import QuizSchedule


class Command(BaseCommand):

    def handle(self, *args, **options):
        all_schedules = QuizSchedule.objects.all()
        
        if all_schedules:
            oldest_next_date = all_schedules.order_by("next_date").first().next_date

            # バッチ処理が毎日起動している場合は
            # (1)前日テストしてfailureになったもの(2)前日テストだったが未受講のもの
            # 上記二つは+1日、それ以外は元々のnext_dateのまま
            if oldest_next_date == datetime.date.today() - datetime.timedelta(days=1):
                all_schedules = all_schedules.filter(next_date=oldest_next_date)

                for schedule in all_schedules:
                    schedule.next_date = datetime.date.today()

            # バッチ処理が毎日起動していなかった場合は
            # 全てのnext_dateを並び順変えずに今日の日付でリセットする
            else:
                elapsed_days = datetime.date.today() - oldest_next_date

                for schedule in all_schedules:
                    schedule.next_date += elapsed_days

            QuizSchedule.objects.bulk_update(all_schedules, fields=["next_date"])
