import { hideBin } from 'yargs/helpers';

import buildAddBadgeCommand from '../utils/buildAddBadgeCommand';
import processAddBadgeCommand from '../utils/processAddBadgeCommand';

void buildAddBadgeCommand(hideBin(process.argv), async (argv) => {
  try {
    const exitCode = await processAddBadgeCommand(argv);
    process.exit(exitCode);
  } catch (error) {
    console.error(`Caught error: ${error instanceof Error ? error.message : (error as string)}`);
    process.exit(1);
  }
}).parse();
