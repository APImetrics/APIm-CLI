import {Interfaces} from '@oclif/core';
import {Auth} from './auth';
import fetch, {RequestInit} from 'node-fetch';
import {Config} from './config';
import {debug} from 'debug';
export class Api {
  private auth: Auth;
  private baseUrl = process.env.APIMETRICS_API_URL || 'https://client.apimetrics.io/api/2/';
  private debug = debug('api');

  /**
   *
   * @param oclifConfig Command config
   * @param projectOnly Can this command be run by a user with project
   * only access? E.g. an API key
   */
  constructor(
    private readonly oclifConfig: Interfaces.Config,
    private readonly projectOnly: boolean,
    private config: Config
  ) {
    this.debug('Using base URL %o', this.baseUrl);
    this.auth = new Auth(this.oclifConfig);
  }

  get project(): string {
    return this.config.project.current || '';
  }

  set project(value: string) {
    this.config.project.current = value;
  }

  /**
   * Make a GET request to the API
   * @param path Endpoint path to call
   * @param options Standard fetch() options
   * @param plain Should a plain text (true) or JSON (false) response be returned?
   * @returns API response
   */
  public async get<T>(path: string, options?: RequestInit, plain = false): Promise<T> {
    options = options || {};
    return this.request(path, 'get', options, plain);
  }

  /**
   * Make a POST request to the API
   * @param path Endpoint path to call
   * @param options Standard fetch() options
   * @param plain Should a plain text (true) or JSON (false) response be returned?
   * @returns API response
   */
  public async post<T>(path: string, options: RequestInit, plain = false): Promise<T> {
    return this.request(path, 'post', options, plain);
  }

  /**
   * Make a PUT request to the API
   * @param path Endpoint path to call
   * @param options Standard fetch() options
   * @param plain Should a plain text (true) or JSON (false) response be returned?
   * @returns API response
   */
  public async put<T>(path: string, options: RequestInit, plain = false): Promise<T> {
    return this.request(path, 'put', options, plain);
  }

  /**
   * Make a PATCH request to the API
   * @param path Endpoint path to call
   * @param options Standard fetch() options
   * @param plain Should a plain text (true) or JSON (false) response be returned?
   * @returns API response
   */
  public async patch<T>(path: string, options: RequestInit, plain = false): Promise<T> {
    return this.request(path, 'patch', options, plain);
  }

  /**
   * Make a DELETE request to the API
   * @param path Endpoint path to call
   * @param options Standard fetch() options
   * @param plain Should a plain text (true) or JSON (false) response be returned?
   * @returns API response
   */
  public async delete<T>(path: string, options?: RequestInit, plain = false): Promise<T> {
    options = options || {};
    return this.request(path, 'delete', options, plain);
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
   * Actually perform the request to the API
   * @param path Endpoint path
   * @param method HTTP method
   * @param options Standard fetch() options
   * @param plain Should a plain text (true) or JSON (false) response be returned?
   * @returns API response
   */
  private async request<T>(
    path: string,
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    options: RequestInit,
    plain: boolean
  ): Promise<T> {
    if (!this.auth.loggedIn) {
      throw new Error('Not logged in. Run apimetrics login first.');
    }

    if (!this.projectOnly && this.auth.projectOnly) {
      // User is trying to access data outside a project with only an
      // API key.
      throw new Error(
        'Cannot use an API key to authenticate against a non project endpoint. Run `apimetrics login` instead.'
      );
    }

    if (this.projectOnly && this.config.project.current === undefined) {
      throw new Error(
        'Current working project not set. Run `apimetrics config project set` first.'
      );
    }

    const opts = {
      ...options,
      method: method,
    };
    opts.headers = {
      ...opts.headers,
      ...(await this.auth.headers()),
      'Apimetrics-Project-Id': this.config.project.current || '', // Should never fall through to "" due to previous check
    };
    if (!plain) {
      opts.headers = {
        ...opts.headers,
        Accept: 'application/json',
      };
    }

    const url = new URL(path, this.baseUrl);
    this.debug('Calling URL %o', url.toString());
    this.debug('Using options %O', opts);
    const response = await fetch(url, opts);
    if (!response.ok) {
      this.debug(await response.text());
      throw new Error(`API error - HTTP ${response.status} ${response.statusText}`);
    }

    if (plain) {
      return response.text() as Promise<T>;
    }

    return response.json() as Promise<T>;
  }
}
