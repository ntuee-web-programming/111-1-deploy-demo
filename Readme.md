# 111-1-deploy-demo

## prepare your packages

file structure:
```
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
1. add a script at the project's root that install packages in frontend and backend with the option `--freeze-lockfile`
2. add a script that runs the `build` command in `./frontend`
3. add a script that runs the `deploy` command in `./backend`
```
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

### set up api route in production environment

`process.env.NODE_ENV` equals to `"production"` when running `yarn build` (`react-scripts build`)
```js
import axios from "axios";

const API_ROOT =
  process.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:4000/api";

export const api = axios.create({ baseURL: API_ROOT });
```

### server the output folder with backend

The default path of the output folder for `react-scripts build` is `./frontend/build`.
```js
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

### disable development specific settings

```js
if (process.env.NODE_ENV === "development") {
	app.use(cors());
}
```

### add a Dockerfile at the project's root
```dockerfile
FROM node:16-alpine

EXPOSE 4000

COPY . /app
WORKDIR /app

RUN corepack enable
RUN yarn install:prod
RUN yarn build

CMD ["yarn", "deploy"]
```
### setup a project on [Railway.app](https://railway.app/)
1. create an account
2. start a new project
    ![](https://i.imgur.com/0Mettdj.jpg)

3. select deploy from Github repo
    ![](https://i.imgur.com/NvuXKLq.jpg)

4. select your repo
    ![](https://i.imgur.com/cgm3YhG.png)
    railway should be building your docker image

5. generate a domain for your project
    ![](https://i.imgur.com/dAc3asR.png)

6. connect to your app with the generated domain
    ![](https://i.imgur.com/6rvX0mW.jpg)
