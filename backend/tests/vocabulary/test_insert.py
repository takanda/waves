import pytest
from rest_framework import status
from rest_framework.reverse import reverse
from vocabulary.models import Vocabulary


VOCABULARY_POST_ENDPOINT = reverse("vocabulary:insert")


@pytest.fixture
def insert_word(api_client):
    insert_word = {
        "show_text": "Test",
        "meaning": "Meaning 1",
        "part_of_speech": "4",
    }
    return api_client.post(VOCABULARY_POST_ENDPOINT, insert_word)


@pytest.fixture
def insert_words(api_client):
    insert_words = [
        {
            "show_text": "Word 1",
            "meaning": "Meaning 1",
            "part_of_speech": "1"
        },
        {
            "show_text": "Word 2",
            "meaning": "Meaning 2",
            "part_of_speech": "2"
        },
    ]
    return api_client.post(VOCABULARY_POST_ENDPOINT, insert_words, format="json")


@pytest.fixture
def insert_phrase(api_client):
    insert_phrase = {
        "show_text": "Test Phrase",
        "meaning": "Meaning 1",
        "part_of_speech": "10",
    }
    return api_client.post(VOCABULARY_POST_ENDPOINT, insert_phrase)


@pytest.mark.django_db
class TestVocabularyInsert:
    class TestNormal:
        class TestEnglishWordInsert:
            class TestDataInsertionCanBeExecuted:
                def test_multiple_meanings_can_be_stored_simultaneously(self, insert_words):
                    response = insert_words
                    assert response.status_code == status.HTTP_201_CREATED
                    assert Vocabulary.objects.count() == 2

            def test_column_show_text_has_alphabetic_characters_which_were_entered_by_user(self, insert_word):
                response = insert_word
                assert response.data.get("show_text") == "Test"

            def test_column_search_text_has_low_case_alphabetic_characters_of_show_text(self, insert_word):
                response = insert_word
                print(response.data)
                assert response.data.get("search_text") == "test"

        class TestEnglishPhraseInsert:
            def test_data_insertion_is_executed(self, insert_phrase):
                response = insert_phrase
                assert response.status_code == status.HTTP_201_CREATED
                assert Vocabulary.objects.count() == 1

            def test_column_show_text_has_alphabetic_characters_which_were_entered_by_user(self, insert_phrase):
                response = insert_phrase
                assert response.data.get("show_text") == "Test Phrase"
                assert response.data.get("search_text") == "testphrase"

            def test_column_search_text_has_low_case_alphabetic_characters_of_show_text(self, insert_phrase):
                response = insert_phrase
                assert response.data.get("search_text") == "testphrase"
