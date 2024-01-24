from django.utils import timezone
from rest_framework import serializers
from .models import Vocabulary, PartOfSpeech


class BulkSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        result = [Vocabulary(**attrs) for attrs in validated_data]
        instance = Vocabulary.objects.bulk_create(result)
        return instance
    
    def update(self, instance, validated_data):
        for vocabulary_instance, data in zip(instance, validated_data):
            vocabulary_instance.meaning = data.get("meaning")
            vocabulary_instance.updated_at = timezone.now()
        Vocabulary.objects.bulk_update(instance, fields=["meaning", "updated_at"])
        return instance


class VocabularySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    search_text = serializers.CharField(max_length=512, required=False)
    class Meta:
        model = Vocabulary
        fields = "__all__"
        list_serializer_class = BulkSerializer

class PartOfSpeechSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartOfSpeech
        fields = "__all__"
