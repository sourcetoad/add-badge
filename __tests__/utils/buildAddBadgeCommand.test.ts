import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import AddBadgeArguments from '../../src/types/AddBadgeArguments';
import buildAddBadgeCommand from '../../src/utils/buildAddBadgeCommand';

let fixtureRoot: string;

function writeConfig(name: string, contents: unknown): string {
  const path = join(fixtureRoot, name);
  writeFileSync(path, JSON.stringify(contents));
  return path;
}

function parse(args: string[]): {
  argv: AddBadgeArguments | undefined;
  failure: string | undefined;
} {
  let argv: AddBadgeArguments | undefined;
  let failure: string | undefined;

  buildAddBadgeCommand(args, (parsed) => {
    argv = parsed;
  })
    .exitProcess(false)
    .fail((message, error) => {
      failure = message ?? error.message;
    })
    .parseSync();

  return { argv, failure };
}

beforeAll(() => {
  fixtureRoot = mkdtempSync(join(tmpdir(), 'add-badge-'));
});

afterAll(() => {
  rmSync(fixtureRoot, { force: true, recursive: true });
});

describe('buildAddBadgeCommand', () => {
  it('parses options from the command line', () => {
    const { argv, failure } = parse(['--input', 'icon.png', '--text', 'ALPHA']);

    expect(failure).toBeUndefined();
    expect(argv?.input).toBe('icon.png');
    expect(argv?.text).toBe('ALPHA');
  });

  it('applies defaults when options are not provided', () => {
    const { argv } = parse(['--input', 'icon.png', '--text', 'ALPHA']);

    expect(argv?.fontSize).toBe(28);
    expect(argv?.gravity).toBe('southeast');
    expect(argv?.mode).toBe('raster');
  });

  it('loads options from a config file', () => {
    const config = writeConfig('load.json', {
      gravity: 'north',
      input: 'icon.png',
      text: 'ALPHA',
    });

    const { argv, failure } = parse(['--config', config]);

    expect(failure).toBeUndefined();
    expect(argv?.input).toBe('icon.png');
    expect(argv?.text).toBe('ALPHA');
    expect(argv?.gravity).toBe('north');
  });

  it('prefers command line options over the config file', () => {
    const config = writeConfig('override.json', {
      input: 'icon.png',
      text: 'ALPHA',
      textColor: '#123456',
    });

    const { argv, failure } = parse(['--config', config, '--text', 'BETA']);

    expect(failure).toBeUndefined();
    expect(argv?.text).toBe('BETA');
    expect(argv?.textColor).toBe('#123456');
  });

  it('ignores the $schema key in the config file', () => {
    const config = writeConfig('schema.json', {
      $schema: 'https://example.com/schema.json',
      input: 'icon.png',
      text: 'ALPHA',
    });

    const { failure } = parse(['--config', config]);

    expect(failure).toBeUndefined();
  });

  it('rejects unknown config keys', () => {
    const config = writeConfig('unknown.json', {
      fontsize: 12,
      input: 'icon.png',
      text: 'ALPHA',
    });

    const { failure } = parse(['--config', config]);

    expect(failure).toContain('fontsize');
  });

  it('fails when the config file does not exist', () => {
    const { failure } = parse([
      '--config',
      join(fixtureRoot, 'missing.json'),
      '--input',
      'icon.png',
      '--text',
      'ALPHA',
    ]);

    expect(failure).toBeDefined();
  });

  it('fails when the config file is not a JSON object', () => {
    const config = writeConfig('array.json', ['icon.png']);

    const { failure } = parse(['--config', config, '--input', 'icon.png', '--text', 'ALPHA']);

    expect(failure).toContain('must contain a JSON object');
  });

  it('requires input and text', () => {
    const { failure } = parse([]);

    expect(failure).toContain('input');
    expect(failure).toContain('text');
  });

  it('rejects unknown modes', () => {
    const { failure } = parse(['--input', 'icon.png', '--text', 'ALPHA', '--mode', 'invalid']);

    expect(failure).toBeDefined();
  });

  it('rejects unknown gravities', () => {
    const { failure } = parse(['--input', 'icon.png', '--text', 'ALPHA', '--gravity', 'center']);

    expect(failure).toBeDefined();
  });
});
