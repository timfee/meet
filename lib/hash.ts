import { createHash } from "crypto"

/**
 * Generates a hash for the given data.
 *
 * This function takes a data string and generates a hash using the
 * SHA-256 algorithm. The hash is created by combining the input data
 * with the value of the GOOGLE_OAUTH_SECRET environment variable.
 *
 * @function
 * @param {string} data - The input data string for which to generate the hash.
 * @returns {string} The resulting hash as a hexadecimal string.
 */
export default function getHash(data: string): string {
  return createHash("sha256")
    .update(data + (process.env.GOOGLE_OAUTH_SECRET ?? ""))
    .digest("hex")
}
