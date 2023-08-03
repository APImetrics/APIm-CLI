import {ux} from '@oclif/core';
import {Command, T} from '../../base-command';

export type LocationList = {
  success: boolean;
  locations: T.Info['agent_list'];
};

export default class Locations extends Command<LocationList> {
  static description = 'List all available agent locations.';

  static examples = [
    `<%= config.bin %> <%= command.id %>
Name                   IP
────────────────────── ──────────────
public_awsuswest       54.191.239.225
public_azureasiase     13.67.53.204
public_googleuscentral 35.226.77.27`,
  ];

  static flags = {
    ...ux.table.flags(),
  };

  public async run(): Promise<LocationList> {
    const {flags} = await this.parse(Locations);

    const endpoint = `agents/info`;
    const {agent_list: agents} = await this.api.get<T.Info>(endpoint);

    ux.table(
      agents,
      {
        name: {
          get: (row) => row.meta.name,
        },
        ip: {
          header: 'IP',
          get: (row) => row.meta.remote_addr,
        },
        id: {
          header: 'ID',
          get: (row) => row.id,
          extended: true,
        },
        metaId: {
          header: 'Meta ID',
          get: (row) => row.meta.id,
          extended: true,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      }
    );
    return {success: true, locations: agents};
  }
}
