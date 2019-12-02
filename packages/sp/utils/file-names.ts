const InvalidFileFolderNameCharsOnlineRegex = /["*:<>?/\\|\x00-\x1f\x7f-\x9f]/g;
const InvalidFileFolderNameCharsOnPremiseRegex = /["#%*:<>?/\\|\x00-\x1f\x7f-\x9f]/g;

/**
 * Checks if file or folder name contains invalid characters
 *
 * @param input File or folder name to check
 * @param onPremise Set to true for SharePoint On-Premise
 * @returns True if contains invalid chars, false otherwise
 */
export function containsInvalidFileFolderChars(input: string, onPremise = false): boolean {
    if (onPremise) {
        return InvalidFileFolderNameCharsOnPremiseRegex.test(input);
    } else {
        return InvalidFileFolderNameCharsOnlineRegex.test(input);
    }
}

/**
 * Removes invalid characters from file or folder name
 *
 * @param input File or folder name
 * @param replacer Value that will replace invalid characters
 * @param onPremise Set to true for SharePoint On-Premise
 * @returns File or folder name with replaced invalid characters
 */
export function stripInvalidFileFolderChars(input: string, replacer = "", onPremise = false): string {
    if (onPremise) {
        return input.replace(InvalidFileFolderNameCharsOnPremiseRegex, replacer);
    } else {
        return input.replace(InvalidFileFolderNameCharsOnlineRegex, replacer);
    }
}
