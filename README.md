# Add Badge

Node commands to add an overlay badge, inset to the non-transparent area.

| ![](https://github.com/sourcetoad/add-badge/raw/master/samples/output/ic_launcher-xxxhdpi.png) | ![](https://github.com/sourcetoad/add-badge/raw/master/samples/output/ic_launcher_round-xxxhdpi.png) |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |

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
npx add-badge --input <input-image> --output <output-image> --text <badge-text> [options]
```

Add a badge to multiple images, modifying them in-place:

```shell
npx add-badge --input <input-glob> --text <badge-text> [options]
```

See [fast-glob](https://github.com/mrmlnc/fast-glob) for glob details.

## Config File

Any option can be provided through a JSON config file with `--config`. Options
passed on the command line override values from the config file.

```shell
npx add-badge --config badge.json --text "$BUILD_LABEL"
```

```json
{
  "$schema": "./node_modules/@sourcetoad/add-badge/configuration_schema.json",
  "input": "./android/app/src/main/res/mipmap-*/ic_launcher*.png",
  "backgroundColor": "#cc0000",
  "textColor": "#ffffff",
  "gravity": "northwest"
}
```

Keys use the camelCase name of the matching option (`fontSize` for
`--font-size`). The `$schema` reference is optional and enables validation and
autocompletion in editors that support JSON Schema.

## Options

See [samples](https://github.com/sourcetoad/add-badge/blob/master/SAMPLES.md) for previews.

### Input `--input`

The input image file, or a glob matching multiple images to modify in-place.

Type: `file | glob`  
Required

### Output `--output`

The file to write the badged image to instead of modifying the input
in-place. Requires the input to match a single file.

Type: `file`  
Default: `undefined` (in-place)

### Text `--text`

The badge text.

Type: `string`  
Required

### Mode `--mode`

The badge target mode.

Type: `raster`  
Default: `raster`

### Config `--config`

A JSON config file providing any of these options.

Type: `file`  
Default: `undefined`

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

If set, the badge will be placed manually instead of automatically. If only one number is provided, the badge will be placed on the gravity axis at the position. If two are provided, the first will be the `x` position and the second will be the `y` position.

Numbers are in percent of the image's dimensions (integer).

Type: `number | number,number`  
Default: `undefined`

### Dry Run `--dry-run`/`-d`

If set, the command will only preview the files that would be changed.
