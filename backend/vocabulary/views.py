from rest_framework import views, generics, viewsets, status
from rest_framework.response import Response
from .models import DictionaryEntry, EntryDefinition, PartOfSpeech
from .serializers import DictionarySerializer, PartOfSpeechSerializer


class DictionaryViewSet(viewsets.ModelViewSet):
    serializer_class = DictionarySerializer
    queryset = DictionaryEntry.objects.all()
    lookup_field = "entry"

class ValicatateEntryView(views.APIView):
    def get(self, request, entry):
        try:
            entry = DictionaryEntry.objects.get(entry=entry)
            return Response({"error_message": "すでに登録された入力値です"}, status=status.HTTP_200_OK)
        except DictionaryEntry.DoesNotExist:
            return Response(status=status.HTTP_200_OK)


class DeleteEntryDefinitionView(generics.GenericAPIView):
    def post(self, request):
        deleted_definition_ids = request.data.get("deleted_definition_ids", [])
        EntryDefinition.objects.filter(id__in=deleted_definition_ids).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ListPartOfSpeechView(generics.ListAPIView):
    queryset = PartOfSpeech.objects.all()
    serializer_class = PartOfSpeechSerializer
    