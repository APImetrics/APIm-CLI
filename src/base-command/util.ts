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

  throw new Error(`Could not parse header ${header}.`);
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

/**
 * Add and remove strings from current list
 * In cases where a string appears in both the add and remove list, it
 * will not be added and if already present will be removed.
 * @param current Current list
 * @param add Strings to add
 * @param remove Strings to remove
 * @returns Updated list
 */
export function addRemoveStrings(current: string[], add: string[], remove: string[]): string[] {
  for (const item of add) {
    if (!current.includes(item)) {
      current.push(item);
    }
  }

  current = current.filter((item) => !remove.includes(item));

  return current;
}

/**
 * Fetch the ID of a user within this organisation by their email address.
 * @param org List of organisation accounts
 * @param email Email to fetch ID for
 * @returns User ID
 * @throws There are multiple users with this email
 * @throws No user with this email exists
 */
export function getUserIdFromOrg(org: T.OrgAccount[], email: string): string {
  const accounts = org.filter((account) => account.email === email)
  if (accounts.length > 1) {
    throw new Error(`There are multiple users with the email ${email}. Please use their ID instead.`)
  }

  if (accounts.length === 0) {
    throw new Error(`No users with the email ${email} exist. Please use their ID instead.`)
  }

  return accounts[0].id
}

/**
 * Split a string at the last occurrence of a given character
 * @param s String to split
 * @param search Character to split at
 */
export function splitAtLastOccurrence(s: string, search: string): string[] {
  const i = s.lastIndexOf(search)
  return [s.slice(0,i), s.slice(i+1)]
}
