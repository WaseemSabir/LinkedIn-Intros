# Intros

This Django Application is only application running in production, serving client application through templates. The output bundles of angular client application should be in static folder and index.html should be configured and in templates folder.

## Getting Started

Following are the basic dependencies need to run the project.

You need python language package, which is installed by deafult on linux, [download](https://www.python.org/downloads/) for windows if not installed already.

```bash

# To install pip on linux, run
sudo apt install python3-pip

# On Windows it is installed by deafult while installing python package
```

Once you have basic dependices installed, run the following commands to get the project running on your local machine:

```bash
git clone https://github.com/WaseemSabir/Temporary.git
cd Temporary
pip3 install -r requirements.txt

# To run server on linux, preferred command
gunicorn ZeroProject.wsgi 

# On windows, use following command (usable on linux too):
python3 manage.py runserver
```

This will start the server on http://127.0.0.1:8000.
It is recommended to use python virtual enviorment for installing and using the pip dependencies.
The project has been tested on the linux machines

### Warning

Before making the repository public, the django key should be removed from file and accessed via enviorment variables.
