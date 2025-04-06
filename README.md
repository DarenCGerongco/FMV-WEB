# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Installation Steps of `"Tailwind"`

1. Initialize npm:
    ```sh
    npm init -y
    ```

2. Install Tailwind CSS and its dependencies:
    ```sh
    npm install -D tailwindcss postcss autoprefixer
    ```

3. Initialize Tailwind CSS configuration:
    ```sh
    npx tailwindcss init -p
    ```
4. ### Configuration

### `src/css/styles.css`:
```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
```

`tailwind.config.js`:
```js
    module.exports = {
    content: [
        './pages/**/*.html',
        './src/**/*.css',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    }
```
`package.json`:
```json
{
  "name": "fmv_web",
  "version": "1.0.0",
  "scripts": {
    "build": "postcss src/css/styles.css -o pages/css/styles.css",
    "watch": "postcss src/css/styles.css -o pages/css/styles.css --watch"
  },
  "devDependencies": {
    "tailwindcss": "^3.x.x",
    "postcss": "^8.x.x",
    "autoprefixer": "^10.x.x",
    "postcss-cli": "^9.x.x"
  }
}
```
# Build CSS

5. Run the following command to compile your CSS:

    ```sh
    npm run build
    ```
    Note, if the tailwind's design isn't applying, run this:

        npx postcss src/css/styles.css -o pages/css/styles.css


# Install Necessities: 
- `npm install`

# To run the Code:
- `npx vite`

# .ENV should be created
- First, run the ipconfig, then find the IPV4 of your device, example you have `192.168.1.20`;
- ".env" should be created and the content should be like this: `"VITE_API_URL=http://192.168.1.6:3000"`

# Additional Steps

Since sige man tag `npm run build` kada naay changes sa atong designs, naa koy life hacks, follow lang.

1. install: 
```sh
    npm install -D concurrently

    npm install -D browser-sync browser-sync-webpack-plugin
```

2. Create a file, `bs-config.js` and inside fmv_web/bs-config.js:
```js
    module.exports = {
        proxy: "localhost:3000", // Adjust this to your local server address if needed
        files: ["pages/**/*.html", "pages/css/**/*.css"],
        open: false,
        notify: false
    };
```

3. The package.json:
```json
{
  "name": "fmv_web",
  "version": "1.0.0",
  "scripts": {
    "build": "postcss src/css/styles.css -o pages/css/styles.css",
    "watch:css": "postcss src/css/styles.css -o pages/css/styles.css --watch",
    "watch:bs": "browser-sync start --config bs-config.js",
    "watch": "concurrently \"npm run watch:css\" \"npm run watch:bs\"",
    "start": "npm run watch"
  },
  "devDependencies": {
    "tailwindcss": "^3.x.x",
    "postcss": "^8.x.x",
    "autoprefixer": "^10.x.x",
    "postcss-cli": "^9.x.x",
    "concurrently": "^6.x.x",
    "browser-sync": "^2.x.x",
    "browser-sync-webpack-plugin": "^2.x.x"
  }
}

```

4. Run the following: 
```sh
    npm start
```


# Running necessities:
- `npm install axios`
- `npm install vite --save-dev`
- `npm install vite @vitejs/plugin-react --save-dev`
- `npm install vite-plugin-node-polyfills --save-dev`
- `npm i react-toastify`
- `npm install react-icons`
- `npm install react-chartjs-2@latest chart.js@latest`
- `npm install react-datepicker`
- `npm install moment`
