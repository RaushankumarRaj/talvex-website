# Talvex Global website (redesign)

A static website for Talvex Global Pvt Ltd: plain HTML, CSS and JavaScript with no build step. It runs on any static host (GitHub Pages, Netlify, Vercel, or cPanel hosting).

## Pages

| Page | File | Live path |
|---|---|---|
| Home | `index.html` | `/` |
| About us | `about-us/index.html` | `/about-us/` |
| Recruitment | `recruitment/index.html` | `/recruitment/` |
| Vendorship | `vendorship/index.html` | `/vendorship/` |
| Industries | `industries/index.html` | `/industries/` |
| Why Talvex | `why-talvex/index.html` | `/why-talvex/` |
| Careers | `careers/index.html` | `/careers/` |
| Contact | `contact/index.html` | `/contact/` |
| Partner with us | `partner-with-us/index.html` | `/partner-with-us/` |
| Brand guide | `brand-guide/index.html` | `/brand-guide/` |

These paths match the current talvexglobal.com URLs, so existing links and search results keep working.

## Assets

- `assets/css/styles.css`: all styles. The colours and fonts are set as variables at the top of the file.
- `assets/js/main.js`: mobile menu, home page tabs, the careers job list, and the forms.
- `assets/img/`: logo files.
  - `logo-on-dark.svg` and `logo-on-light.svg` are the full logo.
  - `icon.svg`, `icon-petrol.svg` and `favicon.svg` are the mark on its own.

The full logo files use live text in the Bricolage Grotesque font. Before you send them to a printer or another agency, open them in Figma or Illustrator and convert the text to outlines. The icon files are already pure shapes.

## Common edits

- **Job openings:** edit the `jobs` list near the top of `assets/js/main.js`. If you add a department, location or job type, also add it to the matching dropdown in `careers/index.html`.
- **Phone, email and address:** these appear in the top bar and footer of every page, and on the Contact page.
- **Social links:** the footer has no social icons yet. Add them once you have Talvex's own LinkedIn, Instagram, Facebook and YouTube profile URLs.
- **Photos:** the pages use free Unsplash images. Swap them for photos of your own team and office before launch.
- **Brand guide:** `/brand-guide/` is not linked from the menu. Share it directly with designers or agencies.

## Connecting the forms

The site has four forms: Partner with us, Contact, the candidate profile form on Recruitment, and the careers Apply flow, which uses that same profile form. Until you connect them, a submitted form asks visitors to email or call you instead.

To make a form send:

1. Create a form endpoint with a service such as Formspree, Getform or Basin, or use your own server.
2. Paste the endpoint URL into that form's `data-endpoint=""` attribute.

Every field already has a `name`, so the service receives all the values. The resume upload needs a service that accepts file attachments.

## Hosting on GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and the `/ (root)` folder, then click **Save**.
4. After a minute or two, the site is live at `https://<your-username>.github.io/<repo-name>/`.

All links are relative, so the site works at that address and on a custom domain such as talvexglobal.com.

## Previewing locally

The pages link to folders such as `about-us/`, so preview them through a small local server instead of opening the files directly:

```bash
npx serve .
```
