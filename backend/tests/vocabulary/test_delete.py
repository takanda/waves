import pytest
from rest_framework import status
from vocabulary.models import Vocabulary
from tests.constants import set_endpoint


@pytest.mark.parametrize("count_table", [Vocabulary], indirect=True)
@pytest.mark.django_db
class TestVocabularyDelete:
    class TestNormal:
        def test_all_data_matching_the_search_text_specified_in_the_URL_can_be_retrieved(self, api_client, count_table):
            delete_data = "test2"
            before_data_count = count_table
            delete_data_count = Vocabulary.objects.filter(search_text=delete_data).count()
            response = api_client.delete(set_endpoint(method="DELETE", value=delete_data))
            after_data_count = Vocabulary.objects.count()
            assert response.status_code == status.HTTP_204_NO_CONTENT
            assert before_data_count - after_data_count == delete_data_count