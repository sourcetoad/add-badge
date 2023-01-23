import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import processGenerateSamplesCommand from '../utils/processGenerateSamplesCommand';

void yargs(hideBin(process.argv))
  .command(
    '*',
    'Generate the samples for the documentation',
    (yargs) => yargs.version(process.env.APP_VERSION ?? 'Unknown'),
    async () => {
      try {
        const exitCode = await processGenerateSamplesCommand();
        process.exit(exitCode);
      } catch (error) {
        console.error(
          `Caught error: ${
            error instanceof Error ? error.message : (error as string)
          }`,
        );
        process.exit(1);
      }
    },
  )
  .strict()
  .parse();
