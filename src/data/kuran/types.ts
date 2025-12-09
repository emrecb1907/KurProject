export type ContentType = 'text' | 'image' | 'mixed'; // mixed might be needed for Harekeler if we want to unify that too, but let's stick to text/image for now.

// Lesson 102 (Harekeler) has "forms". We can make 'text' content simpler or more complex.
// Let's create a union type.

export interface BaseContent {
    id: number;
    audio: any; // require path
}

export interface TextContent extends BaseContent {
    type: 'text';
    text: string;
    subText?: string; // e.g. "Elif" or "Üstün"
    transliteration?: string;
    // For Harekeler (Lesson 102), we might need forms.
    // If we want a TRULY unified structure, we could treat each form as a separate specialized text display
    // OR we just add optional fields here.
    forms?: {
        ustun: string;
        esre: string;
        otre: string;
    };
}

export interface ImageContent extends BaseContent {
    type: 'image';
    image: any; // require path
    text?: string; // Optional caption
}

export type KuranLessonContent = TextContent | ImageContent;
