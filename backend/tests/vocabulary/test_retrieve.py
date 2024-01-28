import pytest
from vocabulary.models import Vocabulary
from tests.constants import VOCABULARY_GET_OR_POST_ENDPOINT


@pytest.mark.django_db
class TestVocabularyRetrieve:
    class TestNormal:
        @pytest.mark.parametrize("count_table", [Vocabulary], indirect=True)
        def test_all_data_can_be_retrieved_when_no_query_parameter(self, api_client, count_table):
            before_data_count = count_table
            response = api_client.get(VOCABULARY_GET_OR_POST_ENDPOINT)
            assert len(response.data) == before_data_count

        def test_all_data_matching_the_search_text_in_query_parameter_can_be_retrieved(self, api_client):
            vocabularies = Vocabulary.objects.filter(search_text="test3")
            response = api_client.get(f"{VOCABULARY_GET_OR_POST_ENDPOINT}?search_text=test3")
            assert len(response.data) == len(vocabularies)
            assert response.data[0].get("search_text") == vocabularies[0].search_text
            
        def test_the_same_search_result_is_returned_even_if_the_value_passed_to_the_query_parameter_search_text_contains_uppercase_letters_or_spaces(self, api_client):
            vocabularies = Vocabulary.objects.filter(search_text="test3")
            response = api_client.get(f"{VOCABULARY_GET_OR_POST_ENDPOINT}?search_text=Test 3")
            assert len(response.data) == len(vocabularies)
            assert response.data[0].get("search_text") == vocabularies[0].search_text
            