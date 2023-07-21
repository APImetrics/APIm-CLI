import * as T from './types';

/**
 * Convert header string to usable form
 * @param header Header string in the format <key>: <value>
 * @returns Separated header components
 */
export function parseHeader(header: string): {key: string; value: string} {
  const components = header.split(':', 2);

  if (components.length === 2) {
    return {
      key: components[0],
      value: components[1],
    };
  }

  throw new Error(`Could not parse header ${header}`);
}

/**
 * Add or replace a header to an array of headers
 * @param headers Existing array of headers
 * @param key Key to replace or add
 * @param value Value to set header to
 * @returns Updated header array
 */
export function replaceHeader(
  headers: T.Call['request']['headers'],
  key: string,
  value: string
): T.Call['request']['headers'] {
  const i = headers.findIndex((value) => value.key.toLowerCase() === key.toLowerCase());
  if (i >= 0) {
    headers[i] = {
      key: key,
      value: value,
    };
  } else {
    headers.push({
      key: key,
      value: value,
    });
  }

  return headers;
}

/**
 * Remove all instances of a given header key
 * @param headers Existing array of headers
 * @param key Key to remove
 * @returns Updated array of headers
 */
export function deleteHeader(
  headers: T.Call['request']['headers'],
  key: string
): T.Call['request']['headers'] {
  return headers.filter((header) => header.key.toLowerCase() !== key.toLowerCase());
}

/**
 * Best guess email validation based on REGEX
 * @param email Email to test
 * @returns Is the provided string a valid email?
 */
export function validateEmail(email: string): boolean {
  return /^[\w!#$%&*+./=?^`{|}~’-]+@[\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*$/.test(email);
}
