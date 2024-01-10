from rest_framework import viewsets
from .models import Vocabulary
from .serializers import VocabularySerializer


class VocabularyModelViewSet(viewsets.ModelViewSet):
    queryset = Vocabulary.objects.all()
    serializer_class = VocabularySerializer
    
    def perform_create(self, serializer):
        search_text = serializer.validated_data.get("show_text").replace(" ", "").lower()
        serializer.save(search_text=search_text)
