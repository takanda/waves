from rest_framework import serializers
from .models import Vocabulary


class VocabularySerializer(serializers.ModelSerializer):
    search_text = serializers.CharField(max_length=512, required=False)
    class Meta:
        model = Vocabulary
        fields = "__all__"
