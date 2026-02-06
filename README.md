# Polynode Demo

A supply chain prediction platform demo website.

## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for production

```bash
npm run build
```

The build output will be in the `dist/` folder.

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Vite and configure the build
3. Point your custom domain to Vercel

### Netlify

1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Point your custom domain to Netlify

The `_redirects` file in `/public` handles client-side routing for Netlify.
The `vercel.json` handles client-side routing for Vercel.

## Tech Stack

- React 18
- React Router v6
- Vite
- CSS (no frameworks)

## Project Structure

```
src/
  components/    # Reusable UI components
    Navbar.jsx
    Hero.jsx
    Problem.jsx
    Solution.jsx
    HowItWorks.jsx
    Market.jsx
    CTA.jsx
    Footer.jsx
  pages/         # Page components
    Index.jsx
    Dashboard.jsx
    Alerts.jsx
    Analytics.jsx
    Settings.jsx
  App.jsx        # Main app with routing
  main.jsx       # Entry point
  index.css      # Global styles
```
