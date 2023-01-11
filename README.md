# Add Badge

A set of node commands to add an overlay badge, inset to the non-transparent area.  Meant for PNG app icons with square
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
$ npx add-badge <input-image> <badge-image> <output-image> [options]
```

Add a badge to multiple images, modifying them in-place:

```shell
$ npx add-badges <input-glob> <badge-image> [options]
```

See [fast-glob](https://github.com/mrmlnc/fast-glob) for glob details.

### Options

| Option                          | Descripton                                         | Default |
|---------------------------------|----------------------------------------------------|---------|
| `--opacity-threshold`/<br/>`-o` | The opacity level required for the inset comparison | 29      |
| `--dry-run`/<br/>`-d`           | Does not perform actions                           |         |
