from rest_framework import viewsets, generics, status
from rest_framework.response import Response 
from .models import Vocabulary, PartOfSpeech
from .serializers import VocabularySerializer, PartOfSpeechSerializer


class ListCreateVocabularyView(generics.ListCreateAPIView):
    serializer_class = VocabularySerializer

    def get_queryset(self):
        queryset = Vocabulary.objects.all()
        search_text = self.request.query_params.get("search_text", None)
        if search_text:
            queryset = queryset.filter(search_text=search_text)
        return queryset

    def create(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            new_data = []
            for data in request.data:
                search_text = data.get("show_text").replace(" ", "").lower()
                new_data.append({**data, "search_text": search_text})
        else:
            new_data = request.data.copy()
            search_text = new_data.get("show_text").replace(" ", "").lower()
            new_data["search_text"] = search_text

        serializer = self.get_serializer(data=new_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True
        return super().get_serializer(*args, **kwargs)


class ListPartOfSpeechView(generics.ListAPIView):
    queryset = PartOfSpeech.objects.all()
    serializer_class = PartOfSpeechSerializer
    