from rest_framework.reverse import reverse

PART_OF_SPEECH_GET_ENDPOINT = reverse("vocabulary:part_of_speech")

VOCABULARY_GET_OR_POST_ENDPOINT = reverse("vocabulary:vocabulary")
