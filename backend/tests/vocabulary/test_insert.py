import pytest
from rest_framework import status
from vocabulary.models import DictionaryEntry, EntryDefinition
from tests.constants import DICTIONARY_GET_OR_POST_ENDPOINT

@pytest.fixture
def insert_words(api_client):
    insert_words = {
        "entry": "InsertTest",
        "entry_definitions": [
            {
                "meaning": "テスト1",
                "part_of_speech": 1
            },
            {
                "meaning": "テスト2",
                "part_of_speech": 2
            }
        ]
    }
    return api_client.post(DICTIONARY_GET_OR_POST_ENDPOINT, insert_words, format="json")

@pytest.mark.django_db
class TestDictionaryInsert:
    class TestNormal:
        class TestDataInsertionCanBeExecuted:
            @pytest.mark.parametrize("count_table", [DictionaryEntry], indirect=True)
            def test_insert_a_record_with_multi_definition_into_dictionary_entry(self, count_table, insert_words):
                before_data_count = count_table
                response = insert_words
                after_data_count = DictionaryEntry.objects.count()
                assert response.status_code == status.HTTP_201_CREATED
                assert after_data_count - before_data_count == 1

            @pytest.mark.parametrize("count_table", [EntryDefinition], indirect=True)
            def test_insert_a_record_with_multi_definition_into_entry_definition(self, count_table, insert_words):
                before_data_count = count_table
                response = insert_words
                after_data_count = EntryDefinition.objects.count()
                assert response.status_code == status.HTTP_201_CREATED
                assert after_data_count - before_data_count == 2

        def test_inserted_record_has_entry_with_user_entered_value(self, insert_words):
            response = insert_words
            assert response.data.get("entry") == "InsertTest"
