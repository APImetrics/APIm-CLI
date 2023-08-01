import {ux} from '@oclif/core';
import {Command, T} from '../../base-command';

export type RegionList = {
  success: boolean;
  regions: T.Info['regions'];
};

export default class Regions extends Command<RegionList> {
  static description = 'List all available regions';

  static examples = ['<%= config.bin %> <%= command.id %>'];

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
        name: {
          get: (row) => row.name,
        },
        id: {
          header: 'ID',
          get: (row) => row.id,
        },
        locations: {
          get: (row) => row.locations.join(', ') || 'None',
          extended: true,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {success: true, regions: regions};
  }
}
