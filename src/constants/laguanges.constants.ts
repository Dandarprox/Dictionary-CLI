export enum Languages {
    SPANISH = 'spanish',
    ENGLISH = 'english',
    GERMAN = 'german',
}

export enum LanguagesAbbr {
    SPANISH = 'es',
    ENGLISH = 'en',
    GERMAN = 'de',
}

export const ABBR_TO_EXTENDED = {
    [LanguagesAbbr.GERMAN]: Languages.GERMAN,
    [LanguagesAbbr.SPANISH]: Languages.SPANISH,
    [LanguagesAbbr.ENGLISH]: Languages.ENGLISH,
};

