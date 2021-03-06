# Client HR - Proof of Concept using Webpack's Module Federation
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.10. 

[Reference on Module Federation in Angular (YouTube link)](https://www.youtube.com/watch?app=desktop&v=T0vM7GjDVY4&feature=youtu.be). NOTE: Module Federation requires that the apps are running (locally or in prod) for it to grab the generated .js for module federation to work.

## Proof of Concept Goals
1. A shell component with a login, using authguards we'll login once and when we're authenticated we can access other pages.
2. Using Webpack's Module Federation, we are going to have the shell load other frameworks on a page. 
    - Angular11 app
    - AngularJS app
    - Vue app
    - React app

## Instructions to get apps up and running
1. run `yarn install`
2. run `ng serve` from the workspace in one terminal (running on http://localhost:4200)
3. run `ng serve --project mfe-app` from the other terminal (running on http://localhost:4300)
4. You'll know everything is working correctly when you visit: http://localhost:4200/lazy/home
5. Run the AngularJS application at [this repo](https://github.com/jrsimoneau/angularjs-for-module-federation)

## Previous Steps Completed

1. Create workspace in angular
NOTE: Set GLOBAL ng config to use yarn instead of npm - yarn is recommended for using webpack 5, until Angular12. 
    - `ng config -g cli.packageManager yarn` 

2. Create a new app in the workspace: shell `ng g application shell`

## Branch - feature/setup-webpack
1. Updated package.json to use webpack 5.0.0:
```
  
  ...
},
"private": true,
  "resolutions": {
    "webpack": "^5.0.0"
  },
  "dependencies": { 
    ...

```
2. Running `ng serve` I'm seeing a "DeprecationWarning":
```
(node:21416) [DEP_WEBPACK_DEPRECATION_ARRAY_TO_SET_INDEXER] DeprecationWarning: chunk.files was changed from Array to Set (indexing Array is deprecated)
```
Angular11 with Webpack 5 is still experimental  [stackoverflow reference](https://stackoverflow.com/a/66818010)

3. Installed @angular-builders/custom-webpack in the workspace `npm i -D @angular-builders/custom-webpack`
4. Ensure still running correctly - running `ng serve`
    - Failed: cannot find module webpack - issue MIGHT be from using `npm`
        - Reverted package.json and ran `yarn`
      - Ensure app is running with `ng serve`- it's running
5. Ensuring the local version of the cli is using yarn as the package manager instead of npm: `ng config cli.packageManager yarn`

6. Install @angular-builders/custom-webpack in the workspace `yarn add @angular-builders/custom-webpack --dev`
    - Error during adding: EPERM: operation not permitted
    - After a Google search, ran `npm cache clean --force`
    - Running `yarn add @angular-builders/custom-webpack --dev` no longer getting the error. However, seeing the following warnings:

```
warning "@angular-devkit/build-angular > @angular-devkit/build-webpack@0.1102.12" has incorrect peer dependency "webpack@^4.6.0".

warning "@angular-devkit/build-angular > @ngtools/webpack@11.2.12" has incorrect peer dependency "webpack@^4.0.0".

warning "@angular-devkit/build-angular > webpack-dev-middleware@3.7.2" has incorrect peer dependency "webpack@^4.0.0".

warning " > karma-jasmine-html-reporter@1.6.0" has incorrect peer dependency "jasmine-core@>=3.7.1".
```
7. Running `ng serve` again to ensure the application is working - it's working
8. Researching the 4 warning messages above...
    - Came across [this video](https://www.youtube.com/watch?app=desktop&v=T0vM7GjDVY4&feature=youtu.be), where they're NOT using `@angular-builders/custom-webpack`. Instead, he's using `ngx-buid-plus`

### Updated steps:
1. Uninstall @angular-builders/custom-webpack:
    - `yarn remove @angular-builders/custom-webpack --dev`
2. Ran `yarn`
3. Ran `ng serve` - the shell app has compiled - getting DeprecationWarning above ("okay")
4. Ran `yarn add ngx-build-plus --dev `
    - Still seeing the 4 warnings listed above about incorrect peer dependency
5. Ran `yarn`
6. Ran `ng serve` again - it's working
7. Replace the default builders in angular.json
    - SHELL: angular.json > projects > architect > build 
    - SHELL: angular.json > projects > architect > serve
        ```
        // OLD: 
        "builder": "@angular-devkit/build-angular:browser",
        "builder": "@angular-devkit/build-angular:dev-server",

        // NEW: 
        "builder": "ngx-build-plus:browser",
        "builder": "ngx-build-plus:dev-server",
        ```
8. Adding an additonal project that would serve as a remote site
    - `ng g application mfe-app`
9. Replacing the default builder for the mfe-app in angular.json
    - angular.json > projects > shell > architect > build 
    - angular.json > projects > shell > architect > serve
        ```
        // OLD: 
        "builder": "@angular-devkit/build-angular:browser",
        "builder": "@angular-devkit/build-angular:dev-server",

        // NEW: 
        "builder": "ngx-build-plus:browser",
        "builder": "ngx-build-plus:dev-server",
        ```
10. Add a different port for the mfe-app & add extraWebpackConfig:
    - angular.json > projects > mfe-app > architect > serve > options:
    ```
    ...
    "builder": "ngx-build-plus:dev-server",
    "options": {
      "browserTarget": "mfe-app:build",
      "extraWebpackConfig": "mfe-webpack-config.js",
      "port": 4300 <--
    },
    "configurations": {
      ...
    ```
11. For the shell, add extraWebpackConfig:
    - angular.json > projects > shell > architect > serve > options:
    ```
    ...
    "builder": "ngx-build-plus:dev-server",
    "options": {
      "browserTarget": "mfe-app:build",
      "extraWebpackConfig": "host-webpack-config.js",
    },
    "configurations": {
      ...
    ```
12. Add "extraWebpackConfig": "mfe-webpack-config.js"
    - angular.json > projects > mfe-app > architect > build
    ```
      ...
       "styles": [
          "projects/mfe-app/src/styles.scss"
        ],
        "scripts": [],
        "extraWebpackConfig": "mfe-webpack-config.js" <--
      },
      "configurations": {
        ...
13. Add "extraWebpackConfig": "host-webpack-config.js"
    - angular.json > projects > shell > architect > build
      ```
        ...
       "styles": [
          "projects/shell/src/styles.scss"
        ],
        "scripts": [],
        "extraWebpackConfig": "host-webpack-config.js" <--
      },
      "configurations": {
        ...
      ```
14. In the root folder of the workspace create both `host-webpack-config.js` & `mfe-webpack-config.js`


15. Added the following in each of the webpack-config.js:
    ```
    // host-webpack-config.js
    module.exports = {
      output: {
        uniqueName: "host",
      }
    }

    // mfe-webpack-config.js
    module.exports = {
      
    }
    ```

16. Ran `ng serve` - no issues.
17. Ran `ng serve ng serve --project mfe-app` - no issues.

## Branch - feature/add-webpack-mod-federation

host-webpack-config.js & mfe-webpack-config.js
```
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  output: {
    uniqueName: "mfe",
  },
  plugins: [
    new ModuleFederationPlugin({
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "@angular/router": { singleton: true, strictVersion: true },
      },
    }),
  ],
};
```

Running `ng serve` we get an error in the Browser console: `Uncaught Error: Shared module is not available for eager consumption: 6139`

To fix this we need to create a new file called `bootstrap.ts` in both the shell & mfe-app. Cut the contents from `main.ts` and place it into that file. Now, in main.ts for both files - import the bootstrap file. 

```
// shell > src > bootstrap.ts
// AND
// mfe-app > src > bootstrap.ts

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

```
// shell > src > main.ts
// mfe-app > src > main.ts

import ('./bootstrap');
```
Ran `ng serve` for both apps. They both work.

Now, we're going to implement the container plugin
- name: is the name of the container for the app
- filename: is the contents of what has been extracted
- exposes: name of the module 
```
// mfe-webpack-config.js

    ...
    "@angular/router": { singleton: true, strictVersion: true },
  },
  name: "mfe",
  filename: "mfe.js",
  exposes: {
    "./MFEModule": "./projects/mfe-app/src/app/lazy/lazy.module.ts"
  }
}),
...
```

Created a new lazy.component to follow along with video along with a home.component.ts file. Ran `ng serve --project mfe-app` no errors.


Added a remotes property to host-webpack-config.js. In the value of the mfe property, we're saying that "mfe" is the name of the container, and the file from that container that needs to be loaded (http://localhost:4100/mfe.js)
```
    ...
    "@angular/router": { singleton: true, strictVersion: true },
  },
  remotes: {
    mfe: "mfe@http://localhost:4300/mfe.js",
  }
```

The configuration is complete.

To load the application in the host/shell component - need to add the following to app.routing.module.ts

```
// shell > app.routing.module.ts

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'lazy',
    loadChildren: () =>
      import('mfe/MFEModule').then((m) => {
        return m.LazyModule;
      }),
  },
];
```

NOTE: we're seeing a message about how it cannot find the 'mfe/MFEModule' -  we need to add a type definition for it. Create a new file:  mfe.d.ts - located in shell > src > app directory:

```
declare module 'mfe/MFEModule';
```

Restart the apps - no errors.

For both webpack configs. Need to add - 
```
    ...
  },
  optimization: {
    runtimeChunk: false,
  },
  plugins: [
    ...
```

Restart both apps. It works. Our home application is loading the contents from the lazy.module in the project!



## Branch - feature/angularjs-application-setup
For the next goal of the POC, we need to load legacy applications inside of our shell component.

NOTE: Using yarn because of webpack 5.
1. Installing webpack & webpack-cli globally: `npm install -g webpack webpack-cli`
2. Created another directory inside of our project: angularjs-poc-2 [AngularJS Sample Tutorial App](https://github.com/angular/angular-phonecat)
3. With this [repo](https://github.com/jrsimoneau/angularjs-for-module-federation) - we're trying to use Module Federation in AngularJS
4. The AngularJS app is running, and a file has been generated to use in the host-webpack-config.js - add the remote for the angularjs app

    ```
    // host-webpackconfig.js
    ...
    remotes: {
      mfe2: "mfe2@http://localhost:8080/mfe2-ngjs.js"
    }
    ```
5. Updated app-routing.module.ts (shell project), included the path for the angularjs app:
    ```
    ...
    {
    path: 'angular-js',
    loadChildren: () =>
      import('mfe2/MFE2Module').then((m) => {
        return m.simpleApp;
      })
    }
    ...
    ```
6. Start the shell and mfe apps - all apps are running. ERROR when visiting http://localhost:4200/angular-js 
    ```
    ERROR Error: Uncaught (in promise): ReferenceError: angular is not defined
    ReferenceError: angular is not defined
    ```   

    - This error is possibly from referencing an angularjs cdn and not referencing it locally. Investigating and implementing a fix


### Fix for angularjs reference - steps
1. Adding angular package in this app (testing)
2. I'm not certain if Module Federation can be used for an angularjs project. Setting this aside. Fallback would be using an iframe to host the angularjs app.
