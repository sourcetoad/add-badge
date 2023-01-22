# Add Badge

Node commands to add an overlay badge, inset to the non-transparent area.

| ![](https://github.com/sourcetoad/add-badge/raw/master/samples/output/ic_launcher-xxxhdpi.png) | ![](https://github.com/sourcetoad/add-badge/raw/master/samples/output/ic_launcher_round-xxxhdpi.png) |
|------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|

## Installation

Using npm:

```shell
npm install --save-dev @sourcetoad/add-badge
```

Using yarn:

```shell
yarn add --dev @sourcetoad/add-badge
```

## Usage

Add a badge to a single image:

```shell
npx add-badge <input-image> <output-image> <badge-text> [options]
```

Add a badge to multiple images, modifying them in-place:

```shell
npx add-badges <input-glob> <badge-text> [options]
```

See [fast-glob](https://github.com/mrmlnc/fast-glob) for glob details.

### Options

| Option               | Description                                                              | Default                |
|----------------------|--------------------------------------------------------------------------|------------------------|
| `--font-file`        | Text font file                                                           | Roboto Black (Bundled) |
| `--font-size`        | Text size (pt, scaled for images not 192px)                              | 28                     |
| `--text-color`       | Text color (`transparent` for transparent)                               | #666666                |
| `--background-color` | Badge background color                                                   | #ffffff                |
| `--gravity`          | Badge gravity (northwest, north, northeast, southwest, south, southeast) | southeast              |
| `--shadow-color`     | Badge shadow color                                                       | rgba(0,0,0,0.6)        |
| `--dry-run`/`-d`     | Does not perform actions                                                 |                        |
