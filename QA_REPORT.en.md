# QA Test Report

Test date: 2026-06-17

## Scope

- Project file completeness
- English and Chinese Markdown documentation
- Local Markdown links
- Core ISP algorithms
- Built-in RAW learning cases
- Binary RAW sample parsing
- Static HTTP asset loading
- Front-end initialization, render status, and pipeline button generation
- Educational assistant image, tutorial content, and button state
- Beginner control hints, expected result, common trap, and learning progress
- Mascot speech bubble, animation states, and pointer interaction
- Floating web pet position, tutorial anchors, and stage-synced speech bubble
- 6 demo thumbnails and their matching RAW scene mappings
- English / Chinese UI language selector and localized tutorial/demo content
- 3D Pixel mascot structure, articulated body-language CSS, richer stage speech, and control-level explanations
- Interactive formula panels, variable explanations, canvas diagrams, and formula-slider mascot guidance

## Summary

| Item | Result |
| --- | --- |
| Required file check | Passed |
| Markdown content check | Passed |
| Markdown local link check | Passed |
| Core ISP tests | Passed |
| Built-in case pipeline tests | Passed |
| Binary RAW sample test | Passed |
| Static HTTP asset loading | Passed |
| Front-end bootstrap simulation | Passed |
| Educational assistant bootstrap and Next/Apply Tip check | Passed |
| Beginner coach progress and I got it check | Passed |
| Mascot speech bubble and pointer tilt interaction check | Passed |
| Floating pet movement and stage bubble sync check | Passed |
| Demo image gallery assets and mapping check | Passed |
| Bilingual UI switch simulation | Passed |
| Localized tutorial/demo data checks | Passed |
| 3D mascot DOM structure check | Passed |
| Richer analogy and speech-bubble content checks | Passed |
| Control-level mascot explanation simulation | Passed |
| Formula content coverage check | Passed |
| Interactive formula UI simulation | Passed |
| Formula slider mascot guidance check | Passed |
| In-app browser real file:// click test | Not run due environment URL policy |

## Verified Features

- 6 built-in learning cases exist: `Color chart`, `Low light`, `Vignette`, `Bad pixels`, `Grayscale ramp`, `High contrast`
- 6 demo thumbnails exist, and each maps to a RAW scene that can run the full pipeline
- 10 ISP stage entries exist: RAW, BLC, BPC, LSC, Demosaic, WB, CCM, Denoise, Sharpen, Tone/Gamma
- The core pipeline can output RGB from RAW Bayer data
- PGM parsing is tested
- Binary `.raw` sample parsing is tested
- Bad pixel correction, lens shading correction, denoise, sharpen, auto white balance, and histogram generation are covered by tests
- The home page includes case selection, Auto WB, Auto EV, Export PNG, and Preset JSON controls
- The home page includes the cartoon guide, Previous / Next, Apply Tip, and per-stage tutorial content
- The language selector switches the UI from English to Chinese, including demo cards, guide copy, mascot speech, and status text
- The mascot uses a lightweight 3D DOM/CSS structure with head, body, arms, legs, and motion states
- Each ISP stage includes a visual analogy plus richer click, Apply Tip, and checkpoint speech
- Adjusting ISP controls triggers contextual mascot explanations and movement toward the related control
- Each ISP stage includes a formula, variable explanations, detailed bilingual principle text, and an interactive mini diagram
- Formula sliders update the diagram and trigger mascot guidance without rerunning the full ISP pipeline
- English and Chinese docs contain real content

## Environment Note

The current Codex Browser Use environment blocks automated access to local `file://` pages, so real browser click testing was not run. Replacement checks included:

- Local temporary HTTP requests for `index.html`, `app.js`, `isp-core.js`, `styles.css`, docs, and the RAW sample
- Simulated DOM and canvas import of the real `src/app.js` to confirm front-end initialization and render status
- Simulated interaction for the richer guide: stage analogy display, language switch, and black-level control explanation
- Simulated formula interaction: formula initialization, canvas drawing, stage formula switching, formula slider feedback, and Chinese localization

## Suggested Manual Retest

1. Open `index.html`, or run `npm run start` and open the local server.
2. Select each of the 6 built-in cases and click `Load Case`.
3. Switch `Language` between English and Chinese, then confirm controls, demo cards, guide text, and status text update.
4. Click each pipeline stage card and confirm the large preview changes.
5. Click `Auto WB` and `Auto EV`, then watch the image and histogram.
6. Adjust `Lens shading`, `Bad pixel threshold`, `Denoise`, and `Sharpen`.
7. Click `Export PNG` and `Preset JSON`, then confirm browser downloads.
