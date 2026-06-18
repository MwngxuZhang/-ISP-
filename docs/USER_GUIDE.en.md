# User Guide

This guide explains what RAW ISP RGB Lab does and how to use it as a beginner-friendly ISP learning tool.

## What This Project Does

RAW ISP RGB Lab turns Bayer RAW data into an RGB image through a visible camera pipeline. It is designed for learning, debugging, and algorithm discussion.

You can use it to answer practical questions:

- What does Bayer RAW look like before color reconstruction?
- Why do black level and white level matter?
- How does bad-pixel correction change RAW data?
- What does lens-shading correction do to dark corners?
- How does demosaic create RGB from a single-channel sensor mosaic?
- How do white balance, color matrix, tone, denoise, and sharpen affect the image?

## Screen Layout

The app has three main areas:

- Left control panel: load data and tune ISP parameters.
- Demo image gallery: choose one tested image to start the full learning flow.
- Pipeline rail: shows the RAW to RGB stage order.
- Main preview area: large selected preview, cartoon guide panel, plus one card per ISP stage.

Use the `Language` selector in the header to switch the web UI between English and Chinese. It updates controls, demo cards, guide copy, mascot speech bubbles, and status text immediately.

Each stage card contains:

- Image preview
- Histogram
- Mean/range metric

For beginners, the most useful habit is to change one control at a time and watch both the image and histogram.

The 3D Pixel guide explains the selected stage in plain language. Use `Previous` and `Next` to walk through the pipeline. Use `Apply tip` when you want the app to set up a safe beginner experiment for the current stage.

The guide also tells you:

- Which control to touch
- A visual analogy for remembering the principle
- The key formula behind the stage
- What each variable in the formula means
- A small interactive diagram you can adjust before touching the real ISP controls
- What result to expect
- The most common beginner trap
- One checkpoint sentence you should be able to explain

Click `I got it` to mark the current stage as understood and move forward. `Restart tour` starts the learning flow again.

The mascot is not just a static image. It is a lightweight CSS 3D character with moving arms, legs, head, and eyes. It gently floats, reacts to pointer movement, and changes its speech bubble and motion when you click a stage, choose a demo image, adjust a control, apply a tip, or complete a checkpoint.

The web pet also moves near the relevant place on the page. For example, during black-level learning it moves near the `Black level` control; during bad-pixel correction it moves near `Bad pixel threshold`; during stage-card learning it moves near that card. This helps beginners find where to look next.

The formula panel is meant to make the math less abstract. Move the formula slider first, watch the small diagram change, then adjust the real ISP control and compare the image preview plus histogram. This creates a loop: formula idea -> visual diagram -> real image behavior.

## Quick Workflow

1. Open `index.html`.
2. Choose `Language` if you want the page in English or Chinese.
3. Click one tested demo image in the gallery.
4. Or choose a built-in case and click `Load Case`.
5. Look at the pipeline rail from left to right.
6. Click any stage card to show it in the large preview.
7. Read the cartoon guide explanation for that stage.
8. Click `Apply tip` for a guided experiment.
9. Adjust one slider, then compare the stage before and after it.
10. Click `Auto WB` to see gray-world white balance.
11. Click `Auto EV` to estimate a reasonable exposure.
12. Click `Export PNG` when you want to save the final RGB preview.
13. Click `Preset JSON` when you want to save the current ISP parameters.

## Built-In Learning Cases

Use the built-in cases before uploading your own data. They are small and predictable, so they make it easier to understand what each ISP stage is doing.

The demo image gallery at the top of the lab is the easiest entry point. Each card has a thumbnail and loads a matching Bayer RAW scene that has been covered by the automated full pipeline tests.

| Case | Best For | Suggested Controls |
| --- | --- | --- |
| Color chart | Demosaic, white balance, CCM, saturation | Try `Auto WB`, switch CCM presets |
| Low light | Black level, exposure, denoise, gamma | Try `Auto EV`, increase denoise |
| Vignette | Lens-shading correction | Move `Lens shading` from `0` to `1.2` |
| Bad pixels | Bad-pixel correction | Move `Bad pixel threshold` and watch isolated dots |
| Grayscale ramp | Neutrality, tone, clipping | Set WB to `1 / 1 / 1`, change gamma |
| High contrast | Highlight clipping and contrast | Lower exposure, change contrast |

These cases are generated as Bayer RAW mosaics, so they still exercise the complete RAW -> ISP -> RGB path.

## Loading Your Own Data

Yes, you can upload your own RAW data, with one important distinction: the current app supports unpacked Bayer-like RAW buffers, not camera vendor RAW containers.

Supported now:

- `.pgm` grayscale files used as Bayer mosaics
- `.raw` / `.bin` plain binary buffers
- 8-bit unpacked data
- 10/12/14/16-bit values stored as 16-bit words
- Little-endian or big-endian uint16 words

Not supported yet:

- `.CR2`, `.CR3`, `.NEF`, `.ARW`, `.RAF`, `.ORF`
- DNG/TIFF metadata parsing
- Packed MIPI RAW10 / RAW12 bitstream unpacking
- Automatic metadata detection

For plain RAW, the app cannot know the image size or CFA layout from the file itself. You must enter the metadata before loading.

### PGM

Use `.pgm` files when you want the simplest RAW-like input. The app supports:

- `P2`: ASCII grayscale PGM
- `P5`: binary grayscale PGM

After loading a PGM, choose the correct Bayer pattern.

### Plain Binary RAW

For `.raw` or `.bin` files, fill in these fields before loading:

- Width
- Height
- Bit depth
- Endian
- Bayer pattern
- Black level
- White level

Plain RAW files usually do not contain metadata, so wrong dimensions or endian settings will make the image look scrambled.

The repository includes a tested binary RAW sample:

- Data: `samples/synthetic-rggb-16x12-12bit-little.raw`
- Metadata: `samples/synthetic-rggb-16x12-12bit-little.json`

Use these settings when loading it:

```text
Width: 16
Height: 12
Bit depth: 12
Endian: Little
Bayer pattern: RGGB
Black level: 64
White level: 4095
```

The expected result is a small color gradient after demosaic and color processing. It is not meant to look like a photograph; it is a fixture for confirming that raw parsing and the full ISP path work.

## What Each Stage Means

| Stage | Meaning | What To Watch |
| --- | --- | --- |
| RAW | Original Bayer samples | Mosaic color pattern and exposure level |
| BLC | Black-level correction | Shadows should start near zero |
| BPC | Bad-pixel correction | Isolated bright or dark defects should disappear |
| LSC | Lens-shading correction | Corners become more even |
| Demosaic | Reconstruct RGB | Color appears, but artifacts may remain |
| WB | White balance | Neutral areas become less tinted |
| CCM | Color correction matrix | Overall color rendering changes |
| Denoise | Smooth small variation | Noise decreases, detail may soften |
| Sharpen | Recover local contrast | Edges become clearer, halos may appear |
| Tone | Exposure, contrast, saturation, gamma | Final display-ready RGB |

## Suggested Learning Exercises

1. Load `Color chart`, set white balance gains to `1 / 1 / 1`, then click `Auto WB`.
2. Load `Vignette`, increase lens shading from `0` to `1.2`, and watch the corners.
3. Load `Low light`, set denoise high and sharpen high to see the tradeoff between smoothness and artifacts.
4. Load `High contrast`, move exposure and gamma separately to understand linear brightness versus display mapping.
5. Load any case, change Bayer pattern intentionally, and observe how wrong CFA metadata breaks color.

## Common Problems

- Image looks scrambled: width, height, endian, or bit depth is probably wrong.
- Colors look swapped: Bayer pattern is probably wrong.
- Image is too dark: black level, white level, or exposure may be wrong.
- Highlights clip: lower exposure or white level.
- Image looks too smooth: reduce denoise.
- Image has halos: reduce sharpen.

## Current Limits

This project is an educational ISP reference, not a production camera pipeline. It does not yet include DNG metadata parsing, calibrated sensor profiles, edge-aware demosaic, advanced denoise, or full color management.
