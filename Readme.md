# web programming 111-1 project deployment demo

## Docker intorduction

### Benefits

#### Consistent environments

Docker allows developers to package up their applications and all of their dependencies into a single, self-contained unit that can be easily run on any machine. This ensures that the application will always run the same, regardless of the environment it is running in.

#### Easy collaboration and sharing

Docker makes it easy to share and collaborate on applications by allowing developers to publish Docker images to registry services, such as Docker Hub. This allows other developers to easily download and run the same exact environment that was used to develop and test the application.

#### Easy scaling

Docker allows developers to easily scale their applications by running multiple containers on the same host or on multiple hosts. This makes it easy to add more capacity to an application by simply starting up additional containers.

#### Reduced overhead

Because Docker containers are lightweight and share the host operating system, they require fewer resources and have lower overhead than traditional virtual machines. This makes it possible to run more applications on the same hardware, which can save money and improve resource utilization.

#### Improved security

Docker provides several features that can improve the security of applications, such as the ability to run containers with limited permissions and the ability to apply security updates to the host operating system without restarting the containers.

#### container vs. virtual machine

- VM
  - emulates the whole operating system on top of virtual hardware
- container
  - does not emulate any computer, the virtual environment use the host machines's kernel via the docker engine
  - faster to start and stop
  - uses the resources more effectively

### terms

#### image

An image of the container, works like that of a operating system

#### container

A running virtual environment, based on an image

### Quick commands

#### Run a new container

- New Image - `docker run IMAGE`
- Name Container and Launch Image - `docker run --name CONTAINER IMAGE`
- Map Container Ports and Launch Image -`docker run -p HOSTPORT:CONTAINERPORT IMAGE`
- Map ALL Ports and Launch Image - `docker run -P IMAGE`
- Launch Image as Background Service - `docker run -d IMAGE`
- Map Local Directory and Launch - `docker run -v HOSTDIR:TARGETDIR IMAGE`

#### Manage Containers

- List RUNNING Containers - `docker ps`
- List ALL containers - `docker ps -a`
- Delete container - `docker rm CONTAINER`
- Delete a Running Container - `docker rm -f CONTAINER`
- Stop Container - `docker stop CONTAINER`
- Start Container - `docker start CONTAINER`
- Copy File FROM container - `docker cp CONTAINER:SOURCE TARGET`
- Copy File TO container - `docker cp TARGET CONTAINER:SOURCE`
- Start Shell inside container - `docker exec -it CONTAINER bash`
- Rename container - `docker rename OLD NEW`
- Create new Image from Container - `docker commit CONTAINER`

#### Manage Images

- Download Image - `docker pull IMAGE[:TAG]`
- Upload Image to repository - `docker push IMAGE`
- Delete Image - `docker rmi IMAGE`
- List Images - `docker images`
- Build Image from Docker file - `docker build DIRECTORY`
- Tag Image IMAGE - `docker tag IMAGE NEWIMAGE:TAG`

#### Troubleshooting and Information

- Show logs - `docker logs CONTAINER`
- Show stats - `docker stats`
- Show processes - `docker top CONTAINER`
- Show modified files - `docker diff CONTAINER`
- Show mapped ports - `docker port CONTAINER`

## Demo Repository

If you want to see the full project setup, go to [https://github.com/ntuee-web-programming/111-1-deploy-demo](https://github.com/ntuee-web-programming/111-1-deploy-demo).

## prepare your packages

file structure:

```text
.
├── .editorconfig
├── .gitignore
├── backend
│  ├── .babelrc
│  ├── package.json
│  ├── README.md
│  ├── server.js
│  └── yarn.lock
├── Dockerfile
├── frontend
│  ├── .gitignore
│  ├── package.json
│  ├── public
│  │  ├── favicon.ico
│  │  ├── index.html
│  │  ├── logo192.png
│  │  ├── logo512.png
│  │  ├── manifest.json
│  │  └── robots.txt
│  ├── README.md
│  ├── src
│  │  ├── App.js
│  │  ├── App.test.js
│  │  ├── components
│  │  │  ├── ClientCounter.js
│  │  │  └── ServerMessage.js
│  │  ├── connection.js
│  │  ├── index.js
│  │  ├── logo.svg
│  │  ├── reportWebVitals.js
│  │  └── setupTests.js
│  └── yarn.lock
└── package.json
```

### add necessary scripts

#### in the root directory

1. add a script at the project's root that install packages in frontend and backend with the option `--freeze-lockfile`
2. add a script that runs the `build` command in `./frontend`
3. add a script that runs the `deploy` command in `./backend`

```json
{
  ...
  "scripts": {
    ...
    "install:prod": "cd frontend && yarn install --freeze-lockfile && cd ../backend && yarn install --freeze-lockfile",
    "build": "cd frontend && yarn build",
    "deploy": "cd backend && yarn deploy"
  },
  ...
}
```

#### in the backend directory

```json
{
  ...
  "scripts": {
    ...
    "server": "nodemon server.js --ext js --exec babel-node",
    "deploy": "NODE_ENV=production babel-node server.js"
  },
  ...
}
```

`NODE_ENV=production` works on normal operating systems such as the linux environment in the docker container we use. If you want to test this out on a weird operating system which often cause compatibility issues, you should add this entry to your `scripts`.

```json
{
  ...
  "scripts": {
    ...
    "deploy-win": "set NODE_ENV=production&&babel-node server.js"
  },
  ...
}
```

Yes, I am talking about Windows. Be careful about the spaces around `&&`, Windows will take the extra space before `&&` and mess up your `NODE_ENV`. Weird.

### set up api root path and websocket in production environment

`process.env.NODE_ENV` equals to `"production"` when running `yarn build` (`react-scripts build`). Notice that the way the websocket URL is set, it is different from normal http URLs.

```javascript
import axios from "axios";

const API_ROOT =
  process.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:4000/api";

const WS_URL =
  process.env.NODE_ENV === "production"
    ? window.location.origin.replace(/^https*/, "ws")
    : "ws://localhost:4000";

export const api = axios.create({ baseURL: API_ROOT });
export const ws = new WebSocket(WS_URL);

```

### serve the output folder with backend

The default path of the output folder for `react-scripts build` is `./frontend/build`.

```javascript
import path from "path";

import express from "express";
import cors from "cors";

const app = express();

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}
```

### make your backend listen on $PORT in production

If you are starting a server, you need to use the `PORT` environment variable. This is how Railway can expose your deployment. If you see a "Bad Gateway" error, you most likely are not listening on `PORT`. This environment variable is given by Railway, **you don't need to add `PORT` to your .env file**.

```javascript
const port = process.env.PORT || 4000;
```

### disable development specific settings

```javascript
if (process.env.NODE_ENV === "development") {
 app.use(cors());
}
```

### add a Dockerfile at the project's root

```dockerfile
FROM node:16-alpine

EXPOSE ${PORT}

COPY . /app
WORKDIR /app

RUN corepack enable
RUN yarn install:prod
RUN yarn build

CMD ["yarn", "deploy"]
```

## setup a project on [Railway.app](https://railway.app/)

1. create an account

2. start a new project
 ![](hstart a new projectttps://i.imgur.com/vflqUuF.jpg)

3. select deploy from Github repo
    ![select deploy from Github repo](https://i.imgur.com/cgm3YhG.png)

4. select your repo, railway should be building your docker image

5. generate a domain for your project
    ![generate a domain for your project](https://i.imgur.com/dAc3asR.png)

6. connect to your app with the generated domain
    ![connect to your app with the generated domain](https://i.imgur.com/6rvX0mW.jpg)

## setup railway project with railway cli

1. create an account

2. start a new project
 ![](hstart a new projectttps://i.imgur.com/vflqUuF.jpg)

3. select deploy empty project
    ![select deploy empty project](https://i.imgur.com/Sm2bR5K.png)

4. click "set up your project locally"
    ![click "set up your project locally"](https://i.imgur.com/Qx3jF0q.png)

5. install railway cli by copying and pasting the first command
    ![install railway cli by copying and pasting the first command](https://i.imgur.com/4EJfPD7.png)

6. go to your project folder (i.e. `wp1111/hw6`) and run the following command to login to your account:

    ```bash
    railway login
    ```

    ![go to your project folder (i.e. `wp1111/hw6`) and run the following command to login to your account:](https://i.imgur.com/jBPKmDa.png)

7. go to your project folder (i.e. `wp1111/hw6`) and run the following command to login to your account:

    ```bash
    railway link <your-project-hash>
    ```

    ![go to your project folder (i.e. `wp1111/hw6`) and run the following command to login to your account:](https://i.imgur.com/78G6J1e.png)
    ![go to your project folder (i.e. `wp1111/hw6`) and run the following command to login to your account:](https://i.imgur.com/9tQfpt7.png)

8. go to your project folder and run the following command to start deploying

    ```bash
    railway up
    ```

    ![go to your project folder and run the following command to start deploying](https://i.imgur.com/rc1KaJR.png)

9. go to your project page on [Railway.app](https://railway.app/) (or by clicking the link in the terminal), it should be building your docker image

10. when the building process is finished, generate a domain for your app
    ![when the building process is finished, generate a domain for your app](https://i.imgur.com/UnVCqOE.png)

11. wait for about 5 to 10 minutes, then go visit the generated URL, your app should be live!
    ![wait for about 5 to 10 minutes, then go visit the generated URL, your app should be live!](https://i.imgur.com/6ggfAlV.png)

## Environment variables on Railway

It is a bad practice to put your `.env` file anywhere online. You should instead add environment variables via the "variables" tab on Railway.
    ![It is a bad practice to put your `.env` file anywhere online. You should instead add environment variables via the "variables" tab on Railway.](https://i.imgur.com/sXi0W0o.png)

## deploy a web service with [Render](https://render.com/)

1. create an account
    ![create an account](https://i.imgur.com/ItvQM5k.jpg)

2. go to your [dashboard](https://dashboard.render.com/), and select "New Web Service"
    ![go to your dashboard, and select "New Web Service"](https://i.imgur.com/tvCSrDH.png)

3. connect to your Github account
    ![connect to your Github account](https://i.imgur.com/cGtNkP0.png)

4. find the repo you want to deploy, click "connect"
    ![find the repo you want to deploy, click "connect"](https://i.imgur.com/OvQAStd.png)

5. input a unique name for your webservice, and use the setting shown below. If you follow the steps above, this setting should work just fine.
    ![input a unique name for your webservice, and use the setting shown below. If you follow the steps above, this setting should work just fine.](https://i.imgur.com/DAizlju.jpg)

6. scroll to the bottom, click "Create Web Service"
    ![scroll to the bottom, click "Create Web Service"](https://i.imgur.com/goRaahv.png)

7. wait for the platform to build your docker image and deploy your service, this would take about 10 minutes
    ![wait for the platform to build your docker image and deploy your service, this would take about 10 minutes](https://i.imgur.com/OvTDbnh.jpg)

8. when it finishes deploying your service, visit this link. Voila! Your service is live!
    ![when it finishes deploying your service, visit this link. Voila! Your service is live!](https://i.imgur.com/6BZp0PS.png)

## Environment variables on Render

Similar to Render, you can configure your environment variables in the "Environment" tab.
    ![you can configure your environment variables in the "Environment" tab.](https://i.imgur.com/H9AeDkz.jpg)
