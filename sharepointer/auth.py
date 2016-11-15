from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login, logout
from django.contrib import messages

from django.core.mail import send_mail
from django.core.validators import validate_email

from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes

from django.shortcuts import loader

import jobs


# setup email
EMAIL_USE_TLS = True
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_PASSWORD = 'sizweE$' #my gmail password
EMAIL_HOST_USER = 'codegeek77@gmail.com' #my gmail username
EMAIL_PORT = 587
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

@jobs.async
def send_validation_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    params = {
        'email': user.email,
        'site_name': 'http://localhost:8000', 
        'uid': uid,
        'user': user,
        'token': token,
        'protocol': 'http',
        'verify_link': 'http://localhost:8000/verifyaccount?cid=%s&email=%s' % (str(user.pk), user.email)
        }
    subject_template_name = 'validate_email_email.txt' 
    mail = loader.render_to_string(subject_template_name, params)
    send_mail("Procurement SharePoint", mail, DEFAULT_FROM_EMAIL , [user.email], fail_silently=False)
    return True

def register_user(firstname, lastname, email, password):
    user = User.objects.create_user(email, email, password)
    user.first_name = firstname
    user.last_name = lastname
    user.is_active = False
    send_validation_email(user)
    user.save()
    return user


def change_password(email, oldpass, newpass):
    user = User.objects.get(email=email)
    if user.password == oldpass:
        user.set_password(newpass)
        user.save()
        return True
    return False


def authenticate_user(email, password):
    user = authenticate(username=email, password=password)
    if user:
        return user if user.is_active else False
    return False


def does_account_exist(email):
    try:
        user = User.objects.get(email=email)
        return user if user.is_active else False
    except User.DoesNotExist:
        return False


def reset_password(request, cred):
    user = does_account_exist(cred)
    if not user:
        return False
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    params = {
        'email': user.email,
        'domain': request.META['HTTP_HOST'],
        'site_name': 'your site', 
        'uid': uid,
        'user': user,
        'token': token,
        'protocol': 'http',
        'reset_link': 'http://localhost:8000/changepassword?uid=%s&pk=%s&token=%s' % (str(uid), str(user.pk), str(uid))
        }
    subject_template_name='password_reset_subject.txt' 
    email_template_name='password_reset_email.html'    
    subject = loader.render_to_string(subject_template_name, params)
    subject = ''.join(subject.splitlines())
    email = loader.render_to_string(email_template_name, params)
    # send email on another thread to avoid loading
    jobs.new_job(send_mail, subject, email, DEFAULT_FROM_EMAIL , [user.email], fail_silently=False)
    return True