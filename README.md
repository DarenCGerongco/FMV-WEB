# 🚀 React + Vite + Tailwind Setup

This template provides a minimal yet powerful setup to get React running with **Vite**, **Tailwind CSS**, and HMR (Hot Module Replacement). It also includes ESLint rules and some developer life-hacks for efficient styling.

---

## 🛠️ Tech Stack

- React (with JSX)
- Vite (Fast dev build tool)
- Tailwind CSS
- PostCSS + Autoprefixer
- BrowserSync for live HTML/CSS reload
- Developer-friendly scripts for easier workflow

---

## 📦 Installation

### 1. Initialize Project

```sh
npm init -y
```

### 2. Install React & Vite

```sh
npm install
npm install vite --save-dev
npm install vite @vitejs/plugin-react --save-dev
npm install vite-plugin-node-polyfills --save-dev
```

### 3. Install UI and Utility Libraries

```sh
npm install axios
npm i react-toastify
npm install react-icons
npm install react-chartjs-2@latest chart.js@latest
npm install react-datepicker
npm install moment
```

---

## 🎨 Tailwind CSS Setup

### 1. Install Tailwind & Dependencies

```sh
npm install -D tailwindcss postcss autoprefixer postcss-cli
npx tailwindcss init -p
```

### 2. Tailwind Configuration

#### `tailwind.config.js`

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

#### `src/css/styles.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### `package.json` Scripts (Basic Tailwind)

```json
"scripts": {
  "build": "postcss src/css/styles.css -o pages/css/styles.css",
  "watch": "postcss src/css/styles.css -o pages/css/styles.css --watch"
}
```

---

## 🖥️ Development Server

### 1. Build CSS Manually

```sh
npm run build
```

If Tailwind styles aren't applying, try this:

```sh
npx postcss src/css/styles.css -o pages/css/styles.css
```

### 2. Auto-Rebuild with Live Reload (💡 Dev Tip)

#### Install Dev Tools

```sh
npm install -D concurrently
npm install -D browser-sync browser-sync-webpack-plugin
```

#### Create `bs-config.js`

```js
module.exports = {
  proxy: "localhost:3000",
  files: ["pages/**/*.html", "pages/css/**/*.css"],
  open: false,
  notify: false
};
```

#### Update `package.json` Scripts

```json
"scripts": {
  "build": "postcss src/css/styles.css -o pages/css/styles.css",
  "watch:css": "postcss src/css/styles.css -o pages/css/styles.css --watch",
  "watch:bs": "browser-sync start --config bs-config.js",
  "watch": "concurrently \"npm run watch:css\" \"npm run watch:bs\"",
  "start": "npm run watch"
}
```

Then just run:

```sh
npm start
```

---

## 🌐 API Configuration

### 1. Setup `.env`

Run the following to find your local IP:

```sh
ipconfig
```

Locate your **IPv4 address**, e.g., `192.168.1.6`. Then create a `.env` file:

```env
VITE_API_URL=http://192.168.1.6:3000
```

---

## ▶️ Run the App

```sh
npx vite
```

Make sure you've installed everything:

```sh
npm install
```

---

## 🧠 Notes

- JSX is supported out-of-the-box via Vite and `@vitejs/plugin-react`.
- You can customize Tailwind or switch to SCSS if needed.
- Use `npm run build` before each deployment or preview for up-to-date CSS.
- `npm start` will watch for changes and sync them live in the browser.

---
