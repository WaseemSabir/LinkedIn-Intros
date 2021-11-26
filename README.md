# LinkedIn-intros

LinkedIn Intros is an Single-page application, with client application built with AngularJS Framework and Api Endpoint built upon Djnago Rest Framework. It can be used to find potential close connections of targeted linkedIn user that might be mutually close for both of you.

## Basic Dependecies

The client application is built with angularJS that needs node engine and npm package manager to run. Download both according to your machine from [here](https://nodejs.org/en/download/).

```bash
Node JS       # v14.17.6+
Npm           # v6.14.15
```

To start api server, we need python language package and pip3 which can be downloaded from [here](https://www.python.org/downloads/).

```bash
Python3       # v3.6+
pip3          # latest
```

## Project Dependencies

Once you have basic dependencies installed, project dependencies needs to be installed. Firstly, open the terminal and clone the repo with the below command and then move to the project folder with command after.

```bash
git clone https://github.com/0zeros/Linkdin-intros.git
cd Linkdin-intros
 ```
 
 To install the client application dependcies, run the following commands.
 
 ```bash
 npm install -g @angular/cli              # this will install angular cli
 cd Client-app && npm install
```
 
 Now move back to project main folder with `cd ..` and install the server dependencies with the below command.
 
```bash
cd ZeroProject && pip3 install -r requirements.txt
```

## Development Enviorment

After you have all the dependecies installed, make sure that you are in the main folder of application and run the below commands to run the development server which will reflect all your changes to code in real time.

```bash
cd Client-app && ng serve
cd ..
cd ZeroProject && python3 manage.py runserver
```

The application is served at http://localhost:4200 whereas api end point is served at http://127.0.0.1:8000/.

## Production Enviorment

To get the optimized production application, make sure that you are in the main folder of project and following the steps below.

```bash
cd Client-app
ng build --configuration=production --output-hashing none
```

The above command, upon finishing generates files in `Client-app/dist` folder. All the files needs to be moved to `ZeroProject/staticfiles/ang` folder which can either be done manually or using the below commands(make sure you are in the main folder of project).

```bash
cp Client-app/dist/* ZeroProject/static/ang/
```

After coping the files, then enter the server app with `cd ZeroProject`, run the production server using `gunicorn ZeroProject.wsgi` or `python3 manage.py runserver` for windows.
This will start serving at http://127.0.0.1:8000/ and can also be configured with web servers to serve the app to internet.
