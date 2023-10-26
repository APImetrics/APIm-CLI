import {Interfaces} from '@oclif/core';
import {Auth} from './auth';
import {OutgoingHttpHeaders} from 'node:http';
import HTTP from 'http-call';
import {Config} from './config';
import {debug} from 'debug';
import {ListResponse, UserInfo} from './types';
// import {ApiError} from './errors';

type RequestOptions = {
  /** Path to call */
  path: string;
  /** HTTP method to send request with */
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  /** Should the response be treated as plain text? */
  plain?: boolean;
  /** Cursor for further pages */
  cursor?: string;
  /** Headers to pass */
  headers?: OutgoingHttpHeaders;
  /** Request body */
  body?: any;
};
export class Api {
  private auth: Auth;
  private baseUrl = process.env.APIMETRICS_API_URL || 'https://client.apimetrics.io/api/2/';
  private debug = debug('api');

  /**
   * @param oclifConfig Command config
   * @param projectScope Can this command be run by a user with project
   * only access? E.g. an API key
   * @param config Running user config
   * @param jsonMode Is the CLI running in JSON (non interactive) mode?
   */
  constructor(
    private readonly oclifConfig: Interfaces.Config,
    private readonly projectScope: boolean,
    private config: Config,
    jsonMode: boolean
  ) {
    this.debug('Using base URL %o', this.baseUrl);
    this.auth = new Auth(this.oclifConfig, jsonMode);
    HTTP.defaults.headers = {'user-agent': this.oclifConfig.userAgent};
  }

  /** Current working project */
  get project(): string {
    return this.config.project.current || '';
  }

  /** Current working project */
  set project(value: string) {
    this.config.project.current = value;
  }

  /**
   * Make a GET request to the API
   * If the endpoint supports pagination, only the first page will be
   * returned. Use @method list instead to get subsequent pages
   * @param path Endpoint path to call
   * @param options Additional configuration
   * @returns API response
   */
  public async get<T>(path: string, options?: Partial<RequestOptions>): Promise<T> {
    return this.request({path: path, method: 'get', ...options});
  }

  /**
   * Return list response from desired endpoint
   * Handles pagination of results as required
   * @param path Endpoint path to call
   * @param options Additional configuration
   * @returns API response
   */
  public async list<T>(path: string, options?: Partial<RequestOptions>): Promise<T[]> {
    let results: T[] = [];

    let cursor = '';
    let more = true;
    options = options || {};

    do {
      // Can disable here as we need to wait to see if there is more data
      // eslint-disable-next-line no-await-in-loop
      const data = await this.request<ListResponse<T>>({
        path: path,
        method: 'get',
        ...options,
        plain: false, // If this isn't false, bad things will happen!
        cursor: cursor,
      });

      results = [...results, ...data.results];

      more = data.meta.more;
      cursor = data.meta.next_cursor;
    } while (more);

    return results;
  }

  /**
   * Make a POST request to the API
   * @param path Endpoint path to call
   * @param options Additional configuration
   * @returns API response
   */
  public async post<T>(path: string, options?: Partial<RequestOptions>): Promise<T> {
    return this.request({path: path, method: 'post', ...options});
  }

  /**
   * Make a PUT request to the API
   * @param path Endpoint path to call
   * @param options Additional configuration
   * @returns API response
   */
  public async put<T>(path: string, options?: Partial<RequestOptions>): Promise<T> {
    return this.request({path: path, method: 'put', ...options});
  }

  /**
   * Make a PATCH request to the API
   * @param path Endpoint path to call
   * @param options Additional configuration
   * @returns API response
   */
  public async patch<T>(path: string, options?: Partial<RequestOptions>): Promise<T> {
    return this.request({path: path, method: 'patch', ...options});
  }

  /**
   * Make a DELETE request to the API
   * @param path Endpoint path to call
   * @param options Partial
   * @returns API response
   */
  public async delete<T>(path: string, options?: Partial<RequestOptions>): Promise<T> {
    options = options || {};
    return this.request({path: path, method: 'delete', ...options});
  }

  /**
   * Attempt to login the user
   * @param options Login options passed to user
   */
  public async login(options: Auth.Options): Promise<void> {
    return this.auth.login(options);
  }

  /**
   * Log out the user
   */
  public async logout(): Promise<void> {
    return this.auth.logout();
  }

  /**
   * Make call to OIDC userinfo endpoint
   * @returns User information
   */
  public async userinfo(): Promise<UserInfo> {
    return this.auth.userinfo();
  }

  /**
   * Actually perform the request to the API
   * @param path Endpoint path
   * @param method HTTP method
   * @param options Standard fetch() options
   * @param plain Should a plain text (true) or JSON (false) response be returned?
   * @returns API response
   */
  private async request<T>(options: RequestOptions): Promise<T> {
    if (!this.auth.loggedIn) {
      throw new Error('Not logged in. Run apimetrics login first.');
    }

    if (!this.projectScope && this.auth.projectOnly) {
      // User is trying to access data outside a project with only an
      // API key.
      throw new Error(
        'Cannot use an API key to authenticate against a non project endpoint. Run `apimetrics login` instead.'
      );
    }

    if (this.projectScope && this.config.project.current === undefined) {
      throw new Error(
        'Current working project not set. Run `apimetrics config project set` first.'
      );
    }

    const headers: OutgoingHttpHeaders = {
      ...options.headers,
      ...(await this.auth.headers()),
      'Apimetrics-Project-Id': this.config.project.current || '', // Should never fall through to "" due to previous check
    };

    if (!options.plain) {
      headers.accept = 'application/json';
    }

    const url = new URL(options.path, this.baseUrl);
    if (options.cursor) {
      url.searchParams.append('cursor', options.cursor);
    }

    this.debug('Calling URL %o', url.toString());
    const response = await HTTP.request<T>(url.toString(), {
      headers: headers,
      method: options.method,
      body: options.body,
    });

    return response.body;
  }
}
