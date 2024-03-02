from django.db import models, InternalError


def get_default_part_of_speech():
    try: 
        return PartOfSpeech.objects.get(en_name="others").pk
    except PartOfSpeech.DoesNotExist:
        raise InternalError("There should be 'others' record before deleting a part of speech")

class PartOfSpeech(models.Model):
    ja_name = models.CharField(max_length=50)
    en_name = models.CharField(max_length=50)

    class Meta:
        db_table = "PartOfSpeech"
    def __str__(self):
        return self.ja_name

class DictionaryEntry(models.Model):
    entry = models.CharField(max_length=512, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "DictionaryEntry"
        
class EntryDefinition(models.Model):
    dictionary_entry = models.ForeignKey(DictionaryEntry, related_name="entry_definitions", on_delete=models.CASCADE)
    meaning = models.CharField(max_length=512)
    part_of_speech = models.ForeignKey(
        PartOfSpeech, on_delete=models.SET_DEFAULT, default=get_default_part_of_speech)

    class Meta:
        db_table = "EntryDefinition"