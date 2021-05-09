# Client HR
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.10.

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
