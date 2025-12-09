export interface SectionContent {
    section: string;
    text: string[];
}

export interface LessonContent {
    title: string;
    content: SectionContent[];
}
