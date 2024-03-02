import pytest
from vocabulary.models import DictionaryEntry
from tests.constants import DICTIONARY_GET_OR_POST_ENDPOINT, set_endpoint

@pytest.mark.django_db
class TestVocabularyRetrieve:
    class TestNormal:
        @pytest.mark.parametrize("count_table", [DictionaryEntry], indirect=True)
        def test_retrieve_all_data(self, api_client, count_table):
            before_data_count = count_table
            response = api_client.get(DICTIONARY_GET_OR_POST_ENDPOINT)
            assert len(response.data) == before_data_count

        def test_retrieve_data_matching_query_parameter(self, api_client):
            url = set_endpoint(method="GET", entry="Test")
            response = api_client.get(url)
            assert len(response.data.get("entry_definitions")) == 4
            