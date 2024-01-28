import pytest
from rest_framework import status
from vocabulary.models import Vocabulary
from tests.constants import VOCABULARY_GET_OR_POST_ENDPOINT, set_endpoint


@pytest.mark.parametrize("count_table", [Vocabulary], indirect=True)
@pytest.mark.django_db
class TestVocabularyDelete:
    class TestNormal:
        def test_all_data_matching_the_search_text_specified_in_the_URL_can_be_retrieved(self, api_client, count_table):
            delete_data = "test2"
            before_data_count = count_table
            delete_data_count = len(api_client.get(f"{VOCABULARY_GET_OR_POST_ENDPOINT}?search_text={delete_data}").data)
            response = api_client.delete(set_endpoint(method="DELETE", value=delete_data))
            after_data_count = Vocabulary.objects.count()
            assert response.status_code == status.HTTP_204_NO_CONTENT
            assert before_data_count - after_data_count == delete_data_count

        def test_the_same_data_is_deleted_even_if_the_value_passed_to_the_query_parameter_search_text_contains_uppercase_letters_or_spaces(self, api_client, count_table):
            delete_data = "Test 2"
            before_data_count = count_table
            delete_data_count = len(api_client.get(f"{VOCABULARY_GET_OR_POST_ENDPOINT}?search_text={delete_data}").data)
            response = api_client.delete(set_endpoint(method="DELETE", value=delete_data))
            after_data_count = Vocabulary.objects.count()
            assert response.status_code == status.HTTP_204_NO_CONTENT
            assert before_data_count - after_data_count == delete_data_count
            