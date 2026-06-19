# User Guide

This project is a beginner-friendly RAW -> ISP -> RGB visual lab. You can choose tested built-in scenes or upload simple RAW/PGM data, then watch every ISP stage change the real case image.

## What This Project Does

RAW ISP RGB Lab processes Bayer RAW data through a visible camera pipeline and produces an RGB preview. The page shows:

- Image preview for every stage
- Histogram and simple metrics for every stage
- Interactive formulas and diagrams
- Code walkthrough for each stage, including source function, key steps, and a small snippet
- Mascot explanations, hints, and guided actions
- The phone/camera module that each stage maps to

It helps you learn:

- Why Bayer RAW is not a normal photo yet
- Why black level and white level must be corrected early
- How hot/dead pixels are detected and repaired
- Why lens-shading correction compensates dark corners
- How demosaic reconstructs RGB from a single-channel CFA
- How AWB, CCM, denoise, sharpen, and tone mapping affect the final image

## Recommended Workflow

1. Open `index.html` or the GitHub Pages site.
2. Use `Language` to switch between English and Chinese.
3. Click a tested demo card, or choose a case from the `Built-in case` selector.
4. Follow the pipeline rail from RAW to RGB.
5. Click any stage card to place it in the large preview.
6. Read the mascot explanation: what the stage does, why it exists, and where it sits in a real phone/camera pipeline.
7. Move one slider and watch the real case image, histogram, and metrics update together.
8. Click `Apply tip` for a safe beginner experiment.
9. Click `I got it` to mark the stage as understood and move forward.
10. Use `Export PNG` for the final RGB preview and `Preset JSON` for the current ISP settings.

## Built-In Test Cases

These cases run through the complete RAW -> ISP -> RGB path. They are not just symbolic illustrations.

| Case | Best For | Suggested Action |
| --- | --- | --- |
| Color chart | Demosaic, white balance, CCM, saturation | Try `Auto WB`, switch CCM presets |
| Low light | Black level, exposure, denoise, gamma | Try `Auto EV`, increase denoise |
| Vignette | Lens-shading correction | Move `Lens shading` from 0 to 1.2 |
| Bad pixels | Bad-pixel correction | Move `Bad pixel threshold` and watch isolated dots |
| Grayscale ramp | Neutrality, tone, clipping | Set WB to 1/1/1, change gamma |
| High contrast | Highlight clipping and contrast | Lower exposure, change contrast |
| Portrait skin | Skin tone, AWB, CCM, saturation | Compare WB and CCM presets before changing saturation |
| Night street | Low-light exposure, denoise, color cast | Raise denoise gradually and watch lamp color |
| Backlit window | Dynamic range, clipping, shadow readability | Lower exposure, then compare gamma and contrast |

If the bad-pixel case seems not loaded, check three signals: the selector should show `Bad pixels`, the active demo card should be `Bad pixels`, and the `Bad pixels` readout should change. In this version, selecting from the dropdown loads the case immediately.

## Production Camera Pipeline Mapping

This app is educational, not a vendor production ISP, but every stage maps to a real phone/camera pipeline concept:

| Learning Stage | Production Module | Why It Exists |
| --- | --- | --- |
| RAW | Sensor + MIPI RAW input | The sensor delivers Bayer RAW, not display-ready RGB |
| BLC | Sensor front-end / black clamp / linearization | Removes dark-current and analog-chain offsets |
| BPC | Defect Pixel Correction | Uses factory defect maps and runtime hot-pixel detection |
| LSC | Lens Shading Correction mesh | Compensates dark corners and color shading from lens/module geometry |
| Demosaic | CFA interpolation / RAW-to-RGB | Reconstructs full RGB values from single-color samples |
| WB | AWB gains from the 3A system | Keeps neutral objects neutral under different illuminants |
| CCM | Color calibration / color science | Maps sensor color into target rendering color |
| Denoise | RAW/RGB/YUV noise reduction | Reduces noise while trying to preserve texture |
| Sharpen | Detail enhancement | Restores detail softened by optics, demosaic, and denoise |
| Tone | AE, tone mapping, gamma, output conversion | Converts linear sensor data into display-ready RGB |

## How To Observe Real Changes

The formula slider and ISP controls drive the actual pipeline. Try these exercises:

- Black level: watch shadows and the left side of the histogram.
- Bad-pixel threshold: watch the `Bad pixels` readout and isolated dots.
- Lens shading: watch corners approach the center brightness.
- WB gains: judge neutral gray before judging vivid colors.
- CCM: watch hue relationships, not only saturation.
- Denoise/sharpen: compare smoothness, texture, and halos.
- Exposure/gamma: separate linear brightness from display mapping.

## Uploading Your Own RAW

You can upload your own data, with one important distinction: the current app supports unpacked Bayer-like RAW buffers, not camera vendor RAW containers.

Supported:

- `.pgm` grayscale files used as Bayer mosaics
- `.raw` / `.bin` plain binary buffers
- 8-bit unpacked data
- 10/12/14/16-bit values stored as 16-bit words
- Little-endian or big-endian uint16 data

Not supported yet:

- `.CR2`, `.CR3`, `.NEF`, `.ARW`, `.RAF`, `.ORF`
- DNG/TIFF metadata parsing
- Packed MIPI RAW10 / RAW12 unpacking
- Automatic width, height, bit-depth, or Bayer-pattern detection

Before loading a plain `.raw` or `.bin`, enter width, height, bit depth, endian, Bayer pattern, black level, and white level manually. Wrong metadata will make the image scrambled, tinted, or unreadable.

## Common Problems

- Image looks scrambled: width, height, endian, or bit depth is probably wrong.
- Colors look swapped: Bayer pattern is probably wrong.
- Image is too dark: black level, white level, or exposure may be wrong.
- Highlights clip: lower exposure or check white level.
- Image looks too smooth: reduce denoise.
- Edges have halos: reduce sharpen.

## Current Limits

This is an educational ISP reference, not a production phone ISP. It does not yet include full DNG metadata parsing, calibrated sensor profiles, edge-aware demosaic, multi-frame denoise, AI ISP, local tone mapping, or complete color management. It is intended to make the core RAW-to-RGB path easy to see and reason about.
