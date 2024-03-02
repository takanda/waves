from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from .models import DictionaryEntry, EntryDefinition, PartOfSpeech
from .serializers import DictionarySerializer, PartOfSpeechSerializer


class DictionaryViewSet(viewsets.ModelViewSet):
    serializer_class = DictionarySerializer
    queryset = DictionaryEntry.objects.all()
    lookup_field = "entry"

class DeleteEntryDefinitionView(generics.GenericAPIView):
    def post(self, request):
        deleted_definition_ids = request.data.get("deleted_definition_ids", [])
        EntryDefinition.objects.filter(id__in=deleted_definition_ids).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ListPartOfSpeechView(generics.ListAPIView):
    queryset = PartOfSpeech.objects.all()
    serializer_class = PartOfSpeechSerializer
    