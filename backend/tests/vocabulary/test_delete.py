import pytest
from rest_framework import status
from vocabulary.models import DictionaryEntry, EntryDefinition
from tests.constants import set_endpoint


@pytest.mark.django_db
class TestVocabularyDelete:
    class TestNormal:
        def test_delete_entry(self, api_client):
            deleted_entry = DictionaryEntry.objects.get(id=1)
            response = api_client.delete(set_endpoint(method="DELETE", entry=deleted_entry.entry))
            assert response.status_code == status.HTTP_204_NO_CONTENT
            assert not DictionaryEntry.objects.filter(entry=deleted_entry.entry).exists()

        def test_delete_all_definitions_related_to_deleted_entry(self, api_client):
            deleted_entry = DictionaryEntry.objects.get(id=1)
            api_client.delete(set_endpoint(method="DELETE", entry=deleted_entry.entry))
            assert not EntryDefinition.objects.filter(dictionary_entry=deleted_entry).exists()
            