from rest_framework.reverse import reverse

PART_OF_SPEECH_GET_ENDPOINT = reverse("vocabulary:part_of_speech")

DICTIONARY_GET_OR_POST_ENDPOINT = reverse("vocabulary:dictionary-list")

def set_endpoint(**kwargs):
    if kwargs.get("method") == "GET" or kwargs.get("method") == "UPDATE" or kwargs.get("method") == "DELETE":
        return reverse("vocabulary:dictionary-detail", kwargs={"entry": kwargs.get("entry")})
