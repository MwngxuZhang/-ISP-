# Learning ISP? Me Is All You Need

**Project:** RAW-to-RGB ISP Lab  
**Version:** `0.0.0`

RAW-to-RGB ISP Lab is an open-source visual learning app for understanding the complete image signal processing path:

`RAW Bayer -> black level -> bad pixel correction -> lens shading -> demosaic -> white balance -> CCM -> denoise -> sharpen -> RGB`

## Try It Online

If GitHub Pages is enabled, open:

[https://mwngxuzhang.github.io/-ISP-/](https://mwngxuzhang.github.io/-ISP-/)

If the page is not live yet, open the repository settings and use:

- Source: `Deploy from a branch`
- Branch: `gh-pages`
- Folder: `/root`

## Download And Use

### Option 1: Download ZIP

1. Open [https://github.com/MwngxuZhang/-ISP-](https://github.com/MwngxuZhang/-ISP-)
2. Click the green **Code** button
3. Click **Download ZIP**
4. Unzip it and open `index.html`

### Option 2: Clone

```bash
git clone https://github.com/MwngxuZhang/-ISP-.git
cd -ISP-
```

Open:

```text
index.html
```

Or run a local static server:

```bash
npm run start
```

Then visit:

```text
http://127.0.0.1:4173
```

## What You Can Learn

- Run six tested demo images through the complete RAW -> ISP -> RGB pipeline
- Load small `.pgm` and `.raw` files for RAW input experiments
- Adjust black level, white level, BPC, LSC, WB, CCM, exposure, gamma, denoise, and sharpen in real time
- See every stage as an image preview, histogram, metric panel, and interactive formula
- Use formula sliders that sync into the real ISP pipeline, so the diagram and real case image change together
- See where each stage sits in a production phone/camera pipeline, including sensor front-end, BPC, LSC, AWB, CCM, denoise, sharpen, and tone mapping
- Learn with an animated mascot that explains each step in beginner-friendly language
- Switch the web UI between English and Chinese
- Export the final PNG and ISP preset JSON

## Documentation

- [中文 README](README.zh-CN.md)
- [User guide](docs/USER_GUIDE.en.md)
- [中文使用指南](docs/USER_GUIDE.zh-CN.md)
- [Technical design](docs/TECHNICAL_DESIGN.en.md)
- [技术设计](docs/TECHNICAL_DESIGN.zh-CN.md)

## Tests

```bash
npm test
```

The current release passes the core ISP tests and QA structure checks.
