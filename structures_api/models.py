from django.db import models
from django.contrib.postgres.fields import JSONField

# Create your models here.
class Presentation(models.Model):
    ''' Model to store presentation data '''
    presentation = JSONField()

    created_at = models.DateTimeField(auto_now_add=True)