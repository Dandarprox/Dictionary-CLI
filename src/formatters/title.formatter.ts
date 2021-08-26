/* eslint-disable no-console */
import chalk from 'chalk';
import { DEFAULT_PAD_COUNT } from '../constants';

export function titleFormatter(
    title: string,
    titleColor: chalk.Chalk = chalk.greenBright,
    separator = '-',
    titlePadding = 4,
    characterCount = DEFAULT_PAD_COUNT + 20,
): void {
    const titleSide = separator.repeat(
        Math.ceil(characterCount / 2) - Math.ceil(title.length / 2) - Math.ceil(titlePadding),
    );

    console.log(`\n${titleSide} ${titleColor(title)} ${titleSide}\n`);
}
