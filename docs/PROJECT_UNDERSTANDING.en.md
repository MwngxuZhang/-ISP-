# Project Understanding

## Goal

The project should be a GitHub-ready, open-source toolchain that can run a real and explainable path from RAW sensor data through ISP processing to RGB output.

The target user is an image engineer, camera algorithm learner, or ISP beginner who needs to see how each stage changes the image, not just read equations.

## Core Product Idea

Build a visual laboratory for the RAW to RGB camera pipeline:

- Users can load RAW-like Bayer data.
- Users can select Bayer pattern and sensor metadata.
- The system runs an ISP pipeline stage by stage.
- Every stage is shown as an image preview.
- Important parameters are adjustable from the UI.
- The same ISP functions are reusable from tests or future command-line tools.

## What "Complete Flow" Means In The MVP

The MVP should prove the full path:

```text
RAW Bayer samples
  -> black-level correction
  -> normalization
  -> demosaic
  -> white balance
  -> color correction
  -> gamma/tone mapping
  -> RGB image
```

This is complete enough for learning because it contains the minimum stages needed to turn single-channel sensor samples into a displayable color image.

## What The MVP Does Not Claim

The MVP is not a finished commercial ISP. It does not yet optimize for:

- Sensor-specific noise models
- Lens shading calibration files
- Auto exposure and auto white balance metering
- High-quality edge-aware demosaic
- Full color management with ICC profiles
- Hardware ISP parity

Those are planned extensions after the educational pipeline is stable.

## Open-Source Positioning

The project should feel like a clean learning repository:

- Easy to clone and run
- No mandatory cloud services
- Small modules with readable algorithms
- Tests for core behavior
- Documentation that explains the camera pipeline and the engineering roadmap

The best first audience is people who want to understand ISP concepts before moving to heavier frameworks or production camera stacks.

