import { readFileSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';

import yargs from 'yargs';

import defaultOptions from '../defaultOptions';
import AddBadgeArguments from '../types/AddBadgeArguments';
import BadgeGravity from '../types/BadgeGravity';

const PATH_OPTIONS = ['font-file', 'fontFile', 'input', 'output'];

export function parseConfigFile(configPath: string): Record<string, unknown> {
  const parsed: unknown = JSON.parse(readFileSync(configPath, 'utf-8'));

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`Config file "${configPath}" must contain a JSON object`);
  }

  // The $schema key is only there for editor validation, not an option.
  const { $schema, ...options } = parsed as Record<string, unknown>;
  void $schema;

  // Paths from the config file resolve relative to the config file, while
  // paths from the command line stay relative to the working directory.
  const configDirectory = dirname(resolve(configPath));
  for (const key of PATH_OPTIONS) {
    const value = options[key];
    if (typeof value === 'string') {
      const resolved = resolve(configDirectory, value);

      // fast-glob patterns require forward slashes, which Windows also
      // accepts for regular paths.
      options[key] = sep === '\\' ? resolved.replaceAll('\\', '/') : resolved;
    }
  }

  return options;
}

export default function buildAddBadgeCommand(
  args: string[],
  handler: (argv: AddBadgeArguments) => void | Promise<void>,
) {
  return yargs(args)
    .command<AddBadgeArguments>(
      '$0',
      'Add a badge to one or more images',
      (yargs) =>
        yargs
          .option('config', {
            config: true,
            configParser: parseConfigFile,
            description: 'JSON file providing any of these options',
            type: 'string',
          })
          .option('input', {
            demandOption: true,
            description:
              'Input image file or glob (glob matches are modified in place), or an Android res directory in android-adaptive mode',
            type: 'string',
          })
          .option('output', {
            description: 'Output image file (requires the input to match a single file)',
            type: 'string',
          })
          .option('text', {
            demandOption: true,
            description: 'Badge text',
            type: 'string',
          })
          .option('mode', {
            choices: ['raster', 'android-adaptive'],
            default: 'raster',
            description: 'Badge target mode',
            type: 'string',
          })
          .option('font-file', {
            description: 'Text font file',
            type: 'string',
          })
          .option('font-size', {
            default: defaultOptions.fontSize,
            description: 'Text size',
            type: 'number',
          })
          .option('text-color', {
            default: defaultOptions.textColor,
            description: 'Text color',
            type: 'string',
          })
          .option('background-color', {
            default: defaultOptions.backgroundColor,
            description: 'Badge background color',
            type: 'string',
          })
          .option('shadow-color', {
            default: defaultOptions.shadowColor,
            description: 'Badge shadow color',
            type: 'string',
          })
          .option('gravity', {
            choices: Object.values(BadgeGravity),
            default: defaultOptions.gravity,
            description: 'Badge gravity',
            type: 'string',
          })
          .option('position', {
            default: defaultOptions.position,
            description: 'Badge position (percent along gravity axis, or x,y as percent)',
            type: 'string',
          })
          .option('dry-run', {
            alias: 'd',
            default: false,
            description: 'Does not perform actions',
            type: 'boolean',
          })
          .version(process.env.APP_VERSION ?? 'Unknown'),
      handler,
    )
    .strict();
}
