# Educational Assistant Upgrade Understanding

## Goal

The current project already visualizes a RAW to ISP to RGB pipeline. The next step is to make it easier for beginners to use without reading the documentation first.

The upgrade adds an in-app cartoon guide that explains each ISP stage directly inside the tool. The user should be able to open the page, choose a test case, and follow the guide step by step.

## Product Direction

The app should feel like an educational lab with a friendly tutor:

- The tutor explains what the current stage does.
- The tutor tells the user what to observe in the image and histogram.
- The tutor suggests one simple action to try.
- The user can move through the pipeline with Previous / Next buttons.
- Clicking a stage also updates the guide.
- The guide does not hide the engineering controls; it makes them easier to understand.

## Beginner Experience

A beginner should be able to answer:

- What is this stage doing?
- Why does this stage exist in a camera pipeline?
- Which control should I touch first?
- What should I look for after changing it?
- How do I move to the next stage?

## Non-Goals

This upgrade does not add a cloud chatbot or a large language model runtime inside the app. The guide is deterministic, fast, offline, and open-source friendly.

Future versions can add interactive quizzes, multilingual toggle UI, and deeper explanations.

