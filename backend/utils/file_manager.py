import os

def create_folder(path):

    os.makedirs(
        path,
        exist_ok=True
    )


def file_exists(path):

    return os.path.exists(path)