# Contributing

Thanks for helping improve RAW ISP RGB Lab.

## Good First Contributions

- Add a small RAW or PGM fixture with clear metadata.
- Improve documentation for one ISP stage.
- Add a focused test for an algorithm edge case.
- Add a new color correction preset.

## Development Rules

- Keep `src/isp-core.js` browser-compatible and dependency-free unless the project intentionally changes architecture.
- Add tests for parser or algorithm changes.
- Prefer readable reference algorithms before optimized versions.
- Keep sample data small and license-friendly.

## Commit Style

Use short, direct commit messages:

```text
add pgm parser test
fix bayer pattern mapping
document white balance stage
```

