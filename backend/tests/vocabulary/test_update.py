import pytest
from datetime import datetime, timezone
from rest_framework import status
from vocabulary.models import Vocabulary
from tests.constants import set_endpoint


@pytest.mark.django_db
class TestVocabularyRetrieve:
    class TestNormal:
        class TestMeaningCanBeUpdated:
            def test_single_meaning_can_be_updated(self, api_client):
                update_data = {
                    "id": 2,
                    "search_text": "test2",
                    "show_text": "test2",
                    "meaning": "修正後",
                    "part_of_speech": 1,
                    "created_at": "2024-01-16T06:51:59.329Z",
                    "updated_at": "2024-01-16T06:51:59.329Z"
                }
                response = api_client.put(set_endpoint(method="UPDATE", search_text="test2"), update_data)

                assert response.status_code == status.HTTP_200_OK
                assert response.data.get("meaning") == "修正後"
                assert Vocabulary.objects.get(pk=2).meaning == "修正後"

            def test_multiple_meanings_can_be_updated_simultaneously(self, api_client):
                update_data = [
                    {
                        "id": 2,
                        "search_text": "test2",
                        "show_text": "test2",
                        "meaning": "修正後",
                        "part_of_speech": 1,
                        "created_at": "2024-01-16T06:51:59.329Z",
                        "updated_at": "2024-01-16T06:51:59.329Z"
                    },
                    {
                        "id": 3,
                        "search_text": "test2",
                        "show_text": "test2",
                        "meaning": "修正後2",
                        "part_of_speech": 2,
                        "created_at": "2024-01-16T06:51:59.329Z",
                        "updated_at": "2024-01-16T06:51:59.329Z"
                    },
                ]
                response = api_client.put(set_endpoint(method="UPDATE", search_text="test2"), update_data, format="json")

                assert response.status_code == status.HTTP_200_OK
                assert Vocabulary.objects.get(pk=2).meaning == "修正後"
                assert Vocabulary.objects.get(pk=3).meaning == "修正後2"

        class TestUpdatedAtCanBeUpdated:
            def test_updated_at_can_be_updated_at_the_update_date_and_time_when_single_data_update(self, api_client):
                update_data = {
                    "id": 2,
                    "search_text": "test2",
                    "show_text": "test2",
                    "meaning": "修正後",
                    "part_of_speech": 1,
                    "created_at": "2024-01-16T06:51:59.329Z",
                    "updated_at": "2024-01-16T06:51:59.329Z"
                }
                current_datetiem = datetime.now(timezone.utc)
                api_client.put(set_endpoint(method="UPDATE", search_text="test2"), update_data)

                updated_vocabulary = Vocabulary.objects.get(pk=2)
                
                assert updated_vocabulary.updated_at.year == current_datetiem.year
                assert updated_vocabulary.updated_at.month == current_datetiem.month
                assert updated_vocabulary.updated_at.day == current_datetiem.day
                assert updated_vocabulary.updated_at.hour == current_datetiem.hour
                assert updated_vocabulary.updated_at.minute == current_datetiem.minute

            def test_all_updated_at_can_be_updated_at_the_update_date_and_time_when_multiple_data_update(self, api_client):
                update_data = [
                    {
                        "id": 2,
                        "search_text": "test2",
                        "show_text": "test2",
                        "meaning": "修正後",
                        "part_of_speech": 1,
                        "created_at": "2024-01-16T06:51:59.329Z",
                        "updated_at": "2024-01-16T06:51:59.329Z"
                    },
                    {
                        "id": 3,
                        "search_text": "test2",
                        "show_text": "test2",
                        "meaning": "修正後2",
                        "part_of_speech": 2,
                        "created_at": "2024-01-16T06:51:59.329Z",
                        "updated_at": "2024-01-16T06:51:59.329Z"
                    },
                ]
                current_datetiem = datetime.now(timezone.utc)
                api_client.put(set_endpoint(method="UPDATE", search_text="test2"), update_data, format="json")

                updated_vocabulary = Vocabulary.objects.get(pk=2)
                
                assert updated_vocabulary.updated_at.year == current_datetiem.year
                assert updated_vocabulary.updated_at.month == current_datetiem.month
                assert updated_vocabulary.updated_at.day == current_datetiem.day
                assert updated_vocabulary.updated_at.hour == current_datetiem.hour
                assert updated_vocabulary.updated_at.minute == current_datetiem.minute