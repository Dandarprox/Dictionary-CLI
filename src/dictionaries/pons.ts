import scrapeIt from 'scrape-it';

import { Languages } from '../constants';
import { DictionaryData, DictionaryFetch } from '../interfaces';

/**
 * Scraps PONS web for getting word translations
 * @param word Word to translate
 * @param from Word original language
 * @param to Word target translation language
 * @returns Normalized structure for formatting
 */
export const fetchPonsData: DictionaryFetch<Languages> = async (
    word: string,
    from: Languages,
    to: Languages,
) => {
    console.log({ url: `https://en.pons.com/translate/${from}-${to}/${word}` });
    const scrapeResult = await scrapeIt<DictionaryData>(`https://en.pons.com/translate/${from}-${to}/${word}`, {
        wordMeta: {
            selector: '.romhead',
            data: {
                wordClass: {
                    selector: 'span.wordclass > acronym',
                    attr: 'title',
                },
                wordGenus: {
                    selector: 'span.genus > acronym',
                    attr: 'title',
                },
            },
        },
        translations: {
            listItem: '.entry',
            data: {
                definitions: {
                    listItem: 'dl',
                    data: {
                        fromLanguageWord: '.headword > a',
                        fromLanguageWordExplained: '.idiom_proverb > .tilde > a',
                        formLanguageGenre: 'dt strong.tilde > a',
                        fromLanguageExplanation: 'dt > .source > span > a',
                        toLanguageWord: 'dd > .target > a',
                        toLanguageGenre: 'dd > div > span.genus > acronym',
                    },
                },
            },
        },
    });

    return scrapeResult.data;
};
