import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import AddBadgeArguments from '../../src/types/AddBadgeArguments';
import buildAddBadgeCommand from '../../src/utils/buildAddBadgeCommand';
import processAddBadgeCommand from '../../src/utils/processAddBadgeCommand';

const BASE_ARGUMENTS: AddBadgeArguments = {
  backgroundColor: '#ffffff',
  fontSize: 28,
  gravity: 'southeast',
  input: '',
  shadowColor: 'rgba(0,0,0,0.6)',
  text: 'ALPHA',
  textColor: '#666666',
};

let fixtureRoot: string;
let errorSpy: ReturnType<typeof vi.spyOn>;
let infoSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  fixtureRoot = mkdtempSync(join(tmpdir(), 'add-badge-'));
});

afterAll(() => {
  rmSync(fixtureRoot, { force: true, recursive: true });
});

beforeEach(() => {
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
});

afterEach(() => {
  errorSpy.mockRestore();
  infoSpy.mockRestore();
});

describe('processAddBadgeCommand', () => {
  it('rejects an output option when the input matches multiple files', async () => {
    const result = await processAddBadgeCommand({
      ...BASE_ARGUMENTS,
      dryRun: true,
      input: 'samples/input/*.png',
      output: 'out.png',
    });

    expect(result).toBe(1);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('single file'));
  });

  it('rejects an output option in android-adaptive mode', async () => {
    const result = await processAddBadgeCommand({
      ...BASE_ARGUMENTS,
      dryRun: true,
      input: 'samples/input/android-res',
      mode: 'android-adaptive',
      output: 'out.png',
    });

    expect(result).toBe(1);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('android-adaptive'));
  });

  it('dry runs each file matched by a glob', async () => {
    const result = await processAddBadgeCommand({
      ...BASE_ARGUMENTS,
      dryRun: true,
      input: 'samples/input/ic_launcher-*.png',
    });

    expect(result).toBe(0);
    expect(infoSpy).toHaveBeenCalledTimes(2);
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('Would process'));
  });

  it('runs android-adaptive mode from a parsed config file', async () => {
    const configFile = join(fixtureRoot, 'adaptive.json');
    writeFileSync(
      configFile,
      JSON.stringify({
        $schema: './node_modules/@sourcetoad/add-badge/configuration_schema.json',
        dryRun: true,
        // Config paths resolve relative to the config file, so point back at
        // the repository fixture explicitly.
        input: resolve('samples/input/android-res'),
        mode: 'android-adaptive',
      }),
    );

    let parsed: AddBadgeArguments | undefined;
    buildAddBadgeCommand(['--config', configFile, '--text', 'BETA'], (argv) => {
      parsed = argv;
    })
      .exitProcess(false)
      .parseSync();

    if (parsed === undefined) {
      throw new Error('Expected the command to parse');
    }

    expect(parsed.mode).toBe('android-adaptive');
    expect(parsed.text).toBe('BETA');

    const result = await processAddBadgeCommand(parsed);

    expect(result).toBe(0);
    expect(infoSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Would process "${resolve('samples/input/android-res')}"`),
    );
  });
});
