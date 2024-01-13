import pytest
from rest_framework import status
from vocabulary.models import PartOfSpeech
from tests.constants import PART_OF_SPEECH_GET_ENDPOINT

@pytest.mark.django_db
class TestRetrievePartOfSpeech:
    def test_retrive_10_parts_of_speech(self, api_client):
        response = api_client.get(PART_OF_SPEECH_GET_ENDPOINT)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 10

    def test_retrive_countable_noun(self, api_client):
        response = api_client.get(PART_OF_SPEECH_GET_ENDPOINT)
        list_index = PartOfSpeech.objects.get(en_name="countable noun").id
        assert response.data[list_index-1].get("en_name") == "countable noun"

    def test_retrive_uncountable_noun(self, api_client):
        response = api_client.get(PART_OF_SPEECH_GET_ENDPOINT)
        list_index = PartOfSpeech.objects.get(en_name="uncountable noun").id
        assert response.data[list_index-1].get("en_name") == "uncountable noun"

    def test_retrive_intransitive_verb(self, api_client):
        response = api_client.get(PART_OF_SPEECH_GET_ENDPOINT)
        list_index = PartOfSpeech.objects.get(en_name="intransitive verb").id
        assert response.data[list_index-1].get("en_name") == "intransitive verb"

    def test_retrive_transitive_verb(self, api_client):
        response = api_client.get(PART_OF_SPEECH_GET_ENDPOINT)
        list_index = PartOfSpeech.objects.get(en_name="transitive verb").id
        assert response.data[list_index-1].get("en_name") == "transitive verb"

    def test_retrive_adjective(self, api_client):
        response = api_client.get(PART_OF_SPEECH_GET_ENDPOINT)
        list_index = PartOfSpeech.objects.get(en_name="adjective").id
        assert response.data[list_index-1].get("en_name") == "adjective"

    def test_retrive_adverb(self, api_client):
        response = api_client.get(PART_OF_SPEECH_GET_ENDPOINT)
        list_index = PartOfSpeech.objects.get(en_name="adverb").id
        assert response.data[list_index-1].get("en_name") == "adverb"

    def test_retrive_auxiliary_verb(self, api_client):
        response = api_client.get(PART_OF_SPEECH_GET_ENDPOINT)
        list_index = PartOfSpeech.objects.get(en_name="auxiliary verb").id
        assert response.data[list_index-1].get("en_name") == "auxiliary verb"

    def test_retrive_preposition(self, api_client):
        response = api_client.get(PART_OF_SPEECH_GET_ENDPOINT)
        list_index = PartOfSpeech.objects.get(en_name="preposition").id
        assert response.data[list_index-1].get("en_name") == "preposition"

    def test_retrive_conjunction(self, api_client):
        response = api_client.get(PART_OF_SPEECH_GET_ENDPOINT)
        list_index = PartOfSpeech.objects.get(en_name="conjunction").id
        assert response.data[list_index-1].get("en_name") == "conjunction"

    def test_retrive_others(self, api_client):
        response = api_client.get(PART_OF_SPEECH_GET_ENDPOINT)
        list_index = PartOfSpeech.objects.get(en_name="others").id
        assert response.data[list_index-1].get("en_name") == "others"
