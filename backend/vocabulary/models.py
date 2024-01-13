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


class Vocabulary(models.Model):
    search_text = models.CharField(max_length=512)
    show_text = models.CharField(max_length=512)
    meaning = models.CharField(max_length=512)
    part_of_speech = models.ForeignKey(
        PartOfSpeech, on_delete=models.SET_DEFAULT, default=get_default_part_of_speech)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "Vocabulary"
    