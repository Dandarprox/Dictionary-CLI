import scrapeIt from 'scrape-it';

import { LanguagesAbbr } from '../constants';
import {
    DictionaryDefinition, DictionaryFetch, DictionaryGenre, DictionaryRawData,
} from '../interfaces';

type DictCCRawTranslations<T extends DictionaryGenre | string> = DictionaryDefinition<T>[];
type DictCCRawData<T extends DictionaryGenre | string> = Omit<DictionaryRawData, 'translations'> & {
    translations:  DictCCRawTranslations<T>
};

/**
 * Scraps Dict CC web for getting word translations
 * @param word Word to translate
 * @param from Word original language
 * @param to Word target translation language
 * @returns Normalized structure for formatting
 */
// @ts-ignore
export const fetchDictCCData: DictionaryFetch<LanguagesAbbr> = async (
    word: string,
    from: LanguagesAbbr,
    to: LanguagesAbbr,
) => {
    console.log({ url: `https://${from}${to}.dict.cc/?s=${word}` });
    const scrapeResult = await scrapeIt<DictCCRawData<string>>(`https://${from}${to}.dict.cc/?s=${word}`, {
        translations: {
            listItem: '.td7nl',
            data: {
                fromLanguageWord: 'td:nth-child(2) > a',
                fromLanguageGenre: 'td:nth-child(2) > var',
                toLanguageWord: 'td:nth-child(3) > a',
                toLanguageGenre: 'td:nth-child(3) var',
            },
        },
    });

    // Explanation:
    // Dict CC doesn't have a straight form in which scrape-it can be used for fetching
    // a single row of data at a time, so this weird process of getting data of a final
    // row is made by picking data from two consecutive different rows

    const groupedDefinitions: DictCCRawTranslations<string> = [];
    const groupedDefinitionIndex = 0;

    scrapeResult.data.translations.forEach(
        (definition, definitionIndex) => {
            const DICT_STRUCTURE_REGEX = /{|}/g;
            const normalizedFromLanguageGenre = definition?.fromLanguageGenre?.replace(DICT_STRUCTURE_REGEX, '') as DictionaryGenre;
            const normalizedToLanguageGenre = definition?.toLanguageGenre?.replace(DICT_STRUCTURE_REGEX, '') as DictionaryGenre;

            if (definitionIndex % 2 === 0) {
                groupedDefinitions.push({
                    ...definition!,
                    fromLanguageExplanation: definition?.fromLanguageExplanation,
                    fromLanguageGenre: normalizedFromLanguageGenre,
                    fromLanguageWord: definition?.fromLanguageWord!,
                });

                return;
            }

            Object.assign(groupedDefinitions[groupedDefinitionIndex], {
                toLanguageExplanation: definition?.fromLanguageExplanation,
                toLanguageGenre: normalizedToLanguageGenre,
                toLanguageWord: definition?.fromLanguageWord,
            });
        },
    );

    return {
        wordMeta: scrapeResult.data.wordMeta,
        translations: [
            {
                definitions: [groupedDefinitions],
            }
        ]
    };
};
