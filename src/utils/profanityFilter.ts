/**
 * Profanity and Safety Filter Utility
 * 
 * This utility provides functions to check text for inappropriate content,
 * including profanity, hate speech, and religious disrespect.
 * It also handles "leetspeak" (e.g., h4ck3r) and common obfuscation techniques.
 */

// Basic Leetspeak map for normalization
const leetspeakMap: Record<string, string> = {
    '4': 'a', '@': 'a',
    '8': 'b',
    '(': 'c',
    '3': 'e',
    '6': 'g', '9': 'g',
    '1': 'i', '!': 'i', '|': 'i',
    '0': 'o',
    '$': 's', '5': 's',
    '7': 't', '+': 't',
    '2': 'z'
};

// RELIGIOUS SENSITIVITY LIST (Strictly prohibited as usernames or standalone disrespect)
// These words are sacred and should not be used as casual usernames or in inappropriate contexts.
const religiousTerms = [
    // Core Terms
    'allah', 'tanri', 'rab', 'ilah', 'peygamber', 'resul', 'nabi',
    'kuran', 'quran', 'ayet', 'hadis', 'melek', 'cebrail', 'mikail',
    'israfil', 'azrail', 'cennet', 'cehennem', 'kabe', 'mekke', 'medine',
    'cami', 'mescid', 'imam', 'muezzin', 'hafiz', 'seyh', 'gavs',
    'musluman', 'islam', 'din', 'iman', 'namaz', 'oruç', 'zekat', 'hac',
    'god', 'jesus', 'christ', 'bible', 'church', 'mosque', 'prophet',

    // Sensitive Titles & Concepts
    'mehdi', 'deccal', 'yecuc', 'mecuc', 'resulullah', 'habibullah',
    'hazret', 'hazreti', 'halife', 'sahabe',

    // Specific "Hz" Combinations (to allow names like "Ali" but ban "HzAli")
    'hzmuhammed', 'hzebubekir', 'hzomer', 'hzosman', 'hzali',
    'hzhasan', 'hzhuseyin', 'hzfatima', 'hzhatice', 'hzayse',
    'hzmeryem', 'hzisa', 'hzmusa', 'hzibrahim', 'hzadem', 'hznuh',
    'hzyusuf', 'hzyakup', 'hzismail', 'hzdavut', 'hzsuleyman'
];

// PROFANITY & HATE SPEECH LIST (Turkish & English)
// This list includes common profanities, slurs, and offensive terms.
// WARNING: Contains explicit content for filtering purposes.
const blackList = [
    // Turkish Profanity
    'amk', 'aq', 'sik', 'yarrak', 'yarak', 'oç', 'oc', 'pic', 'piç',
    'kahpe', 'orospu', 'fahişe', 'fahise', 'göt', 'got', 'meme',
    'amcik', 'amcık', 'yarram', 'sikik', 'siktir', 'sikiş', 'sikis',
    'yavşak', 'yavsak', 'ibne', 'puşt', 'pust', 'kaltak', 'kaşar', 'kasar',
    'sürtük', 'surtuk', 'mal', 'gerizekali', 'salak', 'aptal', 'idiot',
    'dangalak', 'hıyar', 'hiyar', 'öküz', 'okuz', 'hayvan',
    'ananı', 'anani', 'bacını', 'bacini', 'sokayım', 'sokayim',
    'koyayım', 'koyayim',

    // English Profanity & Global Slurs
    'fuck', 'shit', 'bitch', 'ass', 'asshole', 'dick', 'cock', 'pussy',
    'cunt', 'whore', 'slut', 'bastard', 'nigger', 'nigga', 'faggot',
    'retard', 'idiot', 'stupid', 'sex', 'porn', 'xxx', 'adult'
];

/**
 * Normalizes text by converting leetspeak to normal characters
 * and removing non-alphanumeric characters for checking.
 */
function normalizeText(text: string): string {
    let normalized = text.toLowerCase();

    // Replace leetspeak characters
    for (const [char, replacement] of Object.entries(leetspeakMap)) {
        // Escape special regex characters
        const escapedChar = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        normalized = normalized.replace(new RegExp(escapedChar, 'g'), replacement);
    }

    // Remove all non-alphanumeric characters (including underscores)
    // This converts "a_m_c_i_k" -> "amcik", "h.e.l.l.o" -> "hello"
    normalized = normalized.replace(/[^a-z0-9]/g, '');

    // Remove repeating characters (e.g., "helllo" -> "helo") - simplified approach
    // We keep double letters as they might be valid, but reduce 3+ to 2
    normalized = normalized.replace(/(.)\1{2,}/g, '$1$1');

    return normalized;
}

/**
 * Checks if the text contains any inappropriate content.
 * Returns true if the text is clean, false if it contains prohibited content.
 */
export function validateText(text: string): { isValid: boolean; error?: string } {
    if (!text) return { isValid: false, error: 'Metin boş olamaz.' };

    const lowerText = text.toLowerCase();
    const normalized = normalizeText(text);

    // 1. Check for Religious Terms (Strict Check)
    // We don't want people using these as usernames directly
    for (const term of religiousTerms) {
        // Check exact match or if it's contained within the username in a way that might be disrespectful
        // For usernames, we are stricter.
        if (lowerText.includes(term) || normalized.includes(term)) {
            return {
                isValid: false,
                error: 'Bu kullanıcı adı dini değerler içerdiği için kullanılamaz.'
            };
        }
    }

    // 2. Check for Profanity (Broad Check)
    for (const badWord of blackList) {
        // Check if the bad word exists in the text
        // We check both the raw lowercased text and the normalized (leetspeak decoded) text
        if (lowerText.includes(badWord) || normalized.includes(badWord)) {
            return {
                isValid: false,
                error: 'Bu kullanıcı adı uygunsuz ifadeler içeriyor.'
            };
        }
    }

    // 3. Check for Special Characters (Username specific)
    // Only allow letters, numbers, and underscores
    const validUsernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!validUsernameRegex.test(text)) {
        return {
            isValid: false,
            error: 'Kullanıcı adı sadece harf, rakam ve alt çizgi (_) içerebilir.'
        };
    }

    // 4. Length Check
    if (text.length < 3) {
        return { isValid: false, error: 'Kullanıcı adı en az 3 karakter olmalıdır.' };
    }

    if (text.length > 20) {
        return { isValid: false, error: 'Kullanıcı adı en fazla 20 karakter olabilir.' };
    }

    return { isValid: true };
}

/**
 * Censors inappropriate words in a text string (for chat or comments, not usernames).
 * Replaces bad words with ***.
 */
export function censorText(text: string): string {
    let censored = text;
    const lowerText = text.toLowerCase();
    const normalized = normalizeText(text);

    // This is a simple implementation. For a chat system, we would need a more complex
    // token-based approach to avoid the "Scunthorpe problem".
    // Since we are primarily validating usernames right now, the validateText function is more important.

    for (const badWord of [...blackList, ...religiousTerms]) {
        if (lowerText.includes(badWord)) {
            const regex = new RegExp(badWord, 'gi');
            censored = censored.replace(regex, '*'.repeat(badWord.length));
        }
    }

    return censored;
}
