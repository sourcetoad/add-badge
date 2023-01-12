# Add Badge

A set of node commands to add an overlay badge, inset to the non-transparent area. Meant for PNG app icons with equal
insets.

| ![](./samples/output/ic_launcher-xxxhdpi.png) | ![](./samples/output/ic_launcher_round-xxxhdpi.png) |
|-----------------------------------------------|-----------------------------------------------------|

## Installation

Using npm:

```shell
$ npm install --save-dev @sourcetoad/add-badge
```

Using yarn:

```shell
$ yarn add --dev @sourcetoad/add-badge
```

## Usage

Add a badge to a single image:

```shell
$ npx add-badge <input-image> <output-image> <badge-text> [options]
```

Add a badge to multiple images, modifying them in-place:

```shell
$ npx add-badges <input-glob> <badge-text> [options]
```

See [fast-glob](https://github.com/mrmlnc/fast-glob) for glob details.

### Options

| Option               | Descripton                                                            | Default                |
|----------------------|-----------------------------------------------------------------------|------------------------|
| `--font-file`        | The font file to use for the text                                     | Roboto Black (Bundled) |
| `--font-size`        | The font file to use for the text                                     | 22                     |
| `--text-color`       | The text color of badge (`rgba(0,0,0,0)` for transparent)             | #666666                |
| `--background-color` | The background color badge                                            | #ffffff                |
| `--shadow-color`     | The shadow color badge                                                | rgba(0,0,0,0.5)        |
| `--gravity`          | The gravity of the badge (northwest, northeast, southwest, southeast) | southeast              |
| `--dry-run`/`-d`     | Does not perform actions                                              |                        |
