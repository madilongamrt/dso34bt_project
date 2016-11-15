# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import json
from django.contrib.auth.models import User


# Create your models here.



class CentralFileStore(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    file_name = models.CharField(max_length=50)
    file_content = models.TextField()
    upload_date = models.DateTimeField(auto_now_add=True)
    updated = models.BooleanField(default=False)
    recipients = models.CharField(max_length=300, default="[]")

    def set_recipients(self, x):
        self.recipients = json.dumps(x)

    def get_recipients(self):
        return json.loads(self.recipients)

    def add_recipient(self, email):
        users = self.get_recipients()
        users.append(email)
        self.set_recipients(users)


class SentFiles(models.Model):
    user = models.ForeignKey(User)
    file = models.ForeignKey(CentralFileStore)