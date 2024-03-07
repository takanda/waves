from django.shortcuts import get_object_or_404
from rest_framework import serializers
from .models import DictionaryEntry, EntryDefinition, PartOfSpeech


class EntryDefinitionSerializer(serializers.ModelSerializer):
    """
    シリアライザー内ではread_onlyのフィールドは削除されるため使用できない
    そのためシリアライザー内でidを使用する場合は明示的にread_onlyを外す必要がある
    """
    id = serializers.IntegerField(required=False)

    class Meta:
        model = EntryDefinition
        fields = ["id", "meaning", "part_of_speech"]


class DictionarySerializer(serializers.ModelSerializer):
    entry_definitions = EntryDefinitionSerializer(many=True)

    class Meta:
        model = DictionaryEntry
        fields = "__all__"

    def create(self, validated_data):
        entry_definitions = validated_data.pop("entry_definitions")
        try:
            created_dictionary_entry =DictionaryEntry.objects.get(entry=validated_data.get("entry"))
        except:
            created_dictionary_entry =DictionaryEntry.objects.create(**validated_data)

        bulk_create_entry_definitions = [EntryDefinition(dictionary_entry=created_dictionary_entry, **entry_definition) for entry_definition in entry_definitions]
        EntryDefinition.objects.bulk_create(bulk_create_entry_definitions)

        return created_dictionary_entry
    
    def update(self, instance, validated_data):
        entry_definitions = validated_data.pop("entry_definitions")
        instance.show_text = validated_data.get("entry")

        ebtry_definition_instance_list = []
        for entry_definition in entry_definitions:
            entry_definition_instance = get_object_or_404(EntryDefinition, pk=entry_definition.get("id"))
            entry_definition_instance.meaning = entry_definition.get("meaning")
            ebtry_definition_instance_list.append(entry_definition_instance)

        EntryDefinition.objects.bulk_update(ebtry_definition_instance_list, fields=["meaning"])
        instance.save()

        return instance

class PartOfSpeechSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartOfSpeech
        fields = "__all__"
