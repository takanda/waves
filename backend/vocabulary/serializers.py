from rest_framework import serializers
from .models import Vocabulary, PartOfSpeech


class CreateVocabularyListSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        result = [Vocabulary(**attrs) for attrs in validated_data]
        Vocabulary.objects.bulk_create(result)
        return result

class VocabularySerializer(serializers.ModelSerializer):
    search_text = serializers.CharField(max_length=512, required=False)
    class Meta:
        model = Vocabulary
        fields = "__all__"
        list_serializer_class = CreateVocabularyListSerializer

class PartOfSpeechSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartOfSpeech
        fields = "__all__"
