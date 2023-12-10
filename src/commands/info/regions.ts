import {ux} from '@oclif/core';

import {Command, T} from '../../base-command';

export type RegionList = {
  regions: T.Info['regions'];
  success: boolean;
};

export default class Regions extends Command<RegionList> {
  static description = 'List all available regions.';

  static examples = [
    `<%= config.bin %> <%= command.id %>
Name            ID
─────────────── ───
IBM Cloud       sft
Europe          eu
Microsoft Azure azr
North America   na
`,
  ];

  static flags = {
    ...ux.table.flags(),
  };

  public async run(): Promise<RegionList> {
    const {flags} = await this.parse(Regions);

    const endpoint = `agents/info`;
    const {regions} = await this.api.get<T.Info>(endpoint);

    ux.table(
      regions,
      {
        id: {
          get: (row) => row.id,
          header: 'ID',
        },
        locations: {
          extended: true,
          get: (row) => row.locations.join(', ') || 'None',
        },
        name: {
          get: (row) => row.name,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {regions, success: true};
  }
}
