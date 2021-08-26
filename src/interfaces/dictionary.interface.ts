import { LanguagesAbbr, Languages } from '../constants';

export enum DictionaryGenre {
    masculine = 'm',
    femenine = 'f',
    neutral = 'n',
}

export interface DictionaryMeta {
    wordClass: string;
    wordGenus: string;
}

export interface FromLanguageData<T extends DictionaryGenre | string> {
    fromLanguageWord: string;
    fromLanguageGenre: T;
    fromLanguageWordExplained?: string;
    fromLanguageExplanation?: string;
}

export interface ToLanguageData<T extends DictionaryGenre | string> {
    toLanguageWord: string;
    toLanguageGenre: T;
    toLanguageWordExplained?: string;
    toLanguageExplanation?: string;
}

export type DictionaryDefinition<T extends DictionaryGenre | string> =
FromLanguageData<T> & ToLanguageData<T>;

export type DictionaryFetch<T extends Languages | LanguagesAbbr> = (
    word: string,
    from: T,
    to: T
) => Promise<DictionaryData>;

export type DictionaryFormatter = (
    data: DictionaryData,
    title: string,
    maxOutputPerLine?: number,
    padSymbolCount?: number,
    padSymbol?: string,
) => Promise<void>;

interface DictionaryBaseData<T extends DictionaryGenre | string> {
    wordMeta?: DictionaryMeta;
    translations: {
        definitions: DictionaryDefinition<T>[];
    }[];
}

export type DictionaryData = DictionaryBaseData<DictionaryGenre>;

export type DictionaryRawData = DictionaryBaseData<string>;
