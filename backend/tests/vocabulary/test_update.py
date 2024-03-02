import pytest
from datetime import datetime
from vocabulary.models import DictionaryEntry, EntryDefinition
from tests.constants import set_endpoint

@pytest.fixture
def update_words(api_client):
    endpoint = set_endpoint(method="UPDATE", entry="Test")
    update_content = {
        "entry": "UpdatedTest",
        "entry_definitions": [
            {
                "id": 1,
                "meaning": "修正後テスト1",
                "part_of_speech": 1
            },
            {
                "id": 2,
                "meaning": "修正後テスト2",
                "part_of_speech": 2
            },
        ],
    }
    return api_client.put(endpoint, update_content, format="json")


@pytest.mark.django_db
class TestVocabularyRetrieve:
    class TestNormal:
        def test_update_entry(self, update_words):
            response = update_words
            assert response.data.get("entry") == DictionaryEntry.objects.get(id=1).entry

        def test_update_definitions(self, update_words):
            response = update_words
            assert response.data.get("entry_definitions")[0].get("meaning") == EntryDefinition.objects.get(id=1).meaning
            assert response.data.get("entry_definitions")[1].get("meaning") == EntryDefinition.objects.get(id=2).meaning

        def test_definition_unchanged_with_no_update(self, update_words):
            update_words
            assert EntryDefinition.objects.get(id=3).meaning == "テスト3"

        def test_update_updated_at(self, update_words):
            response = update_words
            assert datetime.fromisoformat(response.data.get("updated_at")) == DictionaryEntry.objects.get(id=1).updated_at

        def test_no_update_created_at(self, update_words):
            response = update_words
            assert datetime.fromisoformat(response.data.get("updated_at")) != DictionaryEntry.objects.get(id=1).created_at
