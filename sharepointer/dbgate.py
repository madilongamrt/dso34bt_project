#/usr/bin/python2

from django.http import HttpResponse

import models
import jobs


@jobs.async
def upload_file(user, to, filename, content):
	file_entity = models.CentralFileStore(file_name=filename, file_content=content)
	file_entity.set_recipients([to])
	file_entity.save()
	sent_entity = models.SentFiles(user=user, file=file_entity)
	sent_entity.save()
	return file_entity, sent_entity


def get_all_files():
	return models.CentralFileStore.objects.all()


def get_all_received_files(user):
	files = models.CentralFileStore.objects.all()
	results = []
	for file in files:
		recepients = file.get_recipients()
		if str(user.email) in recepients:
			results.append(file)
	return results
		

def get_all_sent_files(user):
	return user.sentfiles_set.all()


def delete_file(oid, section):
	oid = int(oid)
	if section == "received":
		file = models.CentralFileStore.objects.get(pk=oid)
		file.delete()
	elif section == "sent":
		sent = models.SentFiles.objects.get(pk=oid)
		file = sent.file
		sent.delete()
		file.delete()


def download_file(oid, section):
	oid = int(oid)
	if section == "received":
		file = models.CentralFileStore.objects.get(pk=oid)
		response = HttpResponse(file.file_content)
		response['Content-Disposition'] = 'attachment; filename=%s' % file.file_name
		return response
	elif section == "sent":
		file = models.SentFiles.objects.get(pk=oid).file
		response = HttpResponse(file.file_content)
		response['Content-Disposition'] = 'attachment; filename=%s' % file.file_name
		return response


def update_file(uid, content):
	file = models.CentralFileStore.objects.get(pk=uid)
	if str(file.file_content) == content:
		return file
	file.file_content = content
	file.updated = True
	file.save()
	return file