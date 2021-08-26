/* eslint-disable no-octal-escape */
import util from 'util';
import { ABBR_TO_EXTENDED, LanguagesAbbr } from './constants';
import { fetchDictCCData, fetchPonsData } from './dictionaries/index';
import { dictionaryFormatter } from './formatters';

function checkEnumGroup(value: string): value is LanguagesAbbr {
    const languagesAbbrMatch = Object.values(LanguagesAbbr).some(
        (languagesKeyAbbr) => languagesKeyAbbr === value,
    );

    return languagesAbbrMatch;
}

async function init(): Promise<void> {
    // process.stdout.write('\033c');
    const [, , abbrLanguageFrom, abbrLanguageTo, ...word] = process.argv;
    const condensedWord = word.join(' ');

    console.log({ abbrLanguageFrom, abbrLanguageTo, condensedWord });

    if (!checkEnumGroup(abbrLanguageFrom)) {
        throw new Error(`The provided argument '${abbrLanguageFrom}' is not valid`);
    }

    if (!checkEnumGroup(abbrLanguageTo)) {
        throw new Error(`The provided argument '${abbrLanguageTo}' is not valid`);
    }

    const [ponsDictionary, dictDictionary] = await Promise.all([
        fetchPonsData(
            condensedWord,
            ABBR_TO_EXTENDED[abbrLanguageFrom],
            ABBR_TO_EXTENDED[abbrLanguageTo],
        ),
        fetchDictCCData(
            condensedWord,
            abbrLanguageFrom,
            abbrLanguageTo,
        ),
    ]);

    console.log(util.inspect(dictDictionary, true, 10));

    dictionaryFormatter(ponsDictionary, 'PONS', 30);
    // dictionaryFormatter(dictDictionary, 'DICT CC', 30);
}

init();
