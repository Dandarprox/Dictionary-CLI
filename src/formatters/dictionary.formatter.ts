/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import chalk from 'chalk';
import capitalize from 'lodash.capitalize';

import { DictionaryData, DictionaryFormatter, DictionaryGenre } from '../interfaces';
import { titleFormatter } from './title.formatter';
import { DEFAULT_PAD_COUNT, DEFAULT_PAD_SYMBOL } from '../constants';

const genreColor = (genre: DictionaryGenre): chalk.Chalk => {
    switch (genre) {
        case DictionaryGenre.masculine:
            return chalk.blue;
        case DictionaryGenre.femenine:
            return chalk.magenta;
        case DictionaryGenre.neutral:
            return chalk.yellow;
        default:
            return chalk.red;
    }
};

export const dictionaryFormatter: DictionaryFormatter = async (
    data: DictionaryData,
    title: string,
    maxOutputPerLine = -1,
    padSymbolCount = DEFAULT_PAD_COUNT,
    padSymbol = DEFAULT_PAD_SYMBOL,
) => {
    const { wordMeta, translations } = data;

    if (wordMeta) {
        const colorizedGenre = genreColor(
            wordMeta.wordGenus as DictionaryGenre,
        )(wordMeta.wordGenus);

        console.log(`> Word Class: ${chalk.cyan(wordMeta.wordClass)} Word Genre: ${capitalize(colorizedGenre)}`);
    }

    titleFormatter(title);

    let definitionCount = 0;

    for (const translation of translations) {
        for (const definition of translation.definitions) {
            const {
                fromLanguageWord,
                fromLanguageGenre,
                fromLanguageWordExplained,
                fromLanguageExplanation,
                toLanguageWord,
                toLanguageGenre,
                toLanguageExplanation,
            } = definition;

            definitionCount += 1;

            if (maxOutputPerLine !== -1 && definitionCount === maxOutputPerLine) {
                return;
            }

            const leftSideGenre = `{${genreColor(fromLanguageGenre)(fromLanguageGenre ?? '')}}`;
            const leftSideExplanation = !fromLanguageWord ? `   > ${fromLanguageWordExplained}` : fromLanguageWordExplained;
            const leftSide = `${fromLanguageWord ?? leftSideExplanation} ${fromLanguageExplanation ?? ''} ${leftSideGenre}`;

            const rightSideGenre = `{${genreColor(toLanguageGenre)(toLanguageGenre ?? '')}}`;
            const rightSide = `${toLanguageWord} ${toLanguageExplanation ?? ''} ${rightSideGenre}`;

            const repeatPatCount = padSymbolCount - leftSide.length;
            const pad = padSymbol.repeat(repeatPatCount < 0 ? 1 : repeatPatCount);

            console.log(`${leftSide}: ${pad} ${rightSide}`);
        }

        console.log('='.repeat(DEFAULT_PAD_COUNT + 20));
    }
};
