
from threading import Thread
import thread


def async(function):
    def decorator(*args, **kwargs):
        t = Thread(target=function, args=args, kwargs=kwargs)
        t.daemon = True
        t.start()
    return decorator


def new_job(function, *args, **kwargs):
    thread.start_new_thread(function, args, kwargs)
