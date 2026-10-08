# Will You Be My Valentine? 💖

This is a Valentine's Day proposal website created for Anjula, redesigned in the style of an Apple product page.

## Features
- A full-screen hero asking "Anjula, will you be my valentine?" with Yes and No pill buttons.
- Interactive "No" button that runs away to a random spot on screen (always fully visible, never on top of Yes) and changes its text with every try. Works with mouse, keyboard and touch.
- "Yes" button that triggers a canvas-confetti celebration and reveals the date plan, then smoothly scrolls to it.
- Apple-style design: system font stack (SF Pro on Apple devices), big tight headlines, generous whitespace, frosted sticky nav, scroll-reveal sections, a neutral palette with one rose accent.
- Responsive on phones, tablets and desktops; respects "reduce motion" settings.
- Static files only: no build step.

## Files
- `index.html`: page structure and all text (proposal, teaser and the plan).
- `style.css`: the design.
- `script.js`: runaway No button, scroll reveal, confetti and the reveal of the plan.

## Run Locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## How to Host on GitHub Pages

1.  **Create a Repository**:
    *   Go to [GitHub](https://github.com) and create a new repository (e.g., `valentine-proposal`).
    *   Make it **Public**.

2.  **Upload Files**:
    *   Upload `index.html`, `style.css`, and `script.js` to the root of the repository.

3.  **Enable GitHub Pages**:
    *   Go to the repository **Settings**.
    *   Scroll down to the **Pages** section (or click "Pages" in the left sidebar).
    *   Under **Build and deployment**, select **Source** as `Deploy from a branch`.
    *   Select the branch `main` (or `master`) and folder `/ (root)`.
    *   Click **Save**.

4.  **Share the Link**:
    *   Wait a few seconds/minutes. GitHub will provide a link (e.g., `https://yourusername.github.io/valentine-proposal/`).
    *   Send this link to Anjula! 💘

## Customization

-   To change the name, edit `index.html` and look for `<h1 id="proposal-title" ...>Anjula, will you be my <span class="accent">valentine?</span></h1>` (also update the `<title>`, meta tags, nav brand and footer).
-   To change the date details, edit the `index.html` file in the `#success-section` (the tiles inside `.bento`).
-   To change the "No" button messages, edit the `messages` array in `script.js`.
-   To change the accent colour, edit `--accent`, `--accent-hover` and `--accent-light` at the top of `style.css`.
