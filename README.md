# Add Badge

A set of node commands to add an overlay badge, inset to the non-transparent area. Meant for PNG app icons with square
insets.

## Installation

Using npm:

```shell
$ npm install --save-dev add-badge-testing
```

Using yarn:

```shell
$ yarn add --dev add-badge-testing
```

## Usage

Add a badge to a single image:

```shell
$ npx add-badge <input-image> <badge-text> <output-image> [options]
```

Add a badge to multiple images, modifying them in-place:

```shell
$ npx add-badges <input-glob> <badge-text> [options]
```

See [fast-glob](https://github.com/mrmlnc/fast-glob) for glob details.

### Options

| Option               | Descripton                                                            | Default                |
|----------------------|-----------------------------------------------------------------------|------------------------|
| `--font-file`        | The TTF font file to use for the text                                 | Roboto Black (Bundled) |
| `--font-size`        | The TTF font file to use for the text                                 | 24                     |
| `--text-color`       | The text color of badge (`rgba(0,0,0,0)` for transparent)             | #666666                |
| `--background-color` | The background color badge                                            | #ffffff                |
| `--shadow-color`     | The shadow color badge                                                | #000000                |
| `--gravity`          | The gravity of the badge (northwest, northeast, southwest, southeast) | southeast              |
| `--dry-run`/`-d`     | Does not perform actions                                              |                        |
