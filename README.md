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

## Options

See [samples](https://github.com/sourcetoad/add-badge/blob/master/SAMPLES.md) for previews.

### Font File `--font-file`

The font file path to use for the badge text.

Type: `file`  
Default: `Roboto Black (Bundled)`

### Font Size `--font-size`

The font size to use for the badge text. The size will be scaled up or down if the image is not 192px.

Type: `point`  
Default: `28`

### Text Color `--text-color`

The color to use for the badge text. Use `transparent` for transparent text.

Type: `color`  
Default: `#666666`

### Background Color `--background-color`

The color to use for the badge background.

Type: `color`  
Default: `#ffffff`

### Shadow Color `--shadow-color`

The color to use for the badge shadow.

Type: `color`  
Default: `rgba(0,0,0,0.6)`

### Gravity `--gravity`

The gravity to use for the badge. The badge will be placed in the corner specified by the gravity.

Type: `northwest | north | northeast | southwest | south | southeast`  
Default: `southeast`

### Position `--position`

If set, the badge will be placed along the gravity axis at this percent instead of placing at the edge.

Type: `number` (0-100)

### Dry Run `--dry-run`/`-d`

If set, the command will only preview the files that would be changed.
