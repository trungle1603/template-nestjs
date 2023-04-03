export const PATTERN = {
    /**
     * Matches any string that contains
     * - Only English letters (upper or lowercase)
     * - Spaces
     * - Parentheses: ()
     * - Square brackets
     * - Dashes: The cat — black and white — ran across the room
     */
    STRING_SPACE_PARENTHESES_SQUARE_DASH: /^[A-Za-z\s()\[\]-]+$/,

    /**
     * Matches any string that contains
     * - Only English letters (upper or lowercase)
     * - Spaces
     */
    STRING_SPACE: /^[A-Za-z ]+$/,

    /**
     * Matches any string that contains
     * - Only English letters (upper or lowercase)
     * - Spaces
     * - Number
     * - Hyphens: state-of-the-art or well-known
     */
    STRING_SPACE_NUMBER_HYPHENS: /^[a-zA-Z0-9\s-]+$/,

    /**
     * Use for validate email address
     * - Username part before the "@" symbol
     * - domain name after the "@" symbol
     * - Valid top-level domain (such as ".com", ".org", or ".edu") after the final "." symbol
     */
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    /**
     * Password must meet the following criteria:
     * - Minimum of 8 characters
     * - Maximum of 64 characters
     * - At least one uppercase letter
     * - At least one lowercase letter
     * - At least one number
     * - At least one special character (!@#$%^&*)
     */
    PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,64}$/,
};
