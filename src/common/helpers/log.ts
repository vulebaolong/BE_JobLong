import util from 'util';

enum Color {
    DEFAULT = '\x1b[0m',
    BOLD = '\x1b[1m',
    RED = '\x1b[31m',
    GREEN = '\x1b[32m',
    YELLOW = '\x1b[33m',
    BLUE = '\x1b[34m',
    MAGENTA = '\x1b[35m',
    CYAN = '\x1b[36m',
    WHITE = '\x1b[37m',
}

type AvailableColors = keyof typeof Color;

export const log = (title: string, desc: any, color: AvailableColors = 'DEFAULT'): void => {
    const colorCode: string = Color[color] || Color.DEFAULT;
    const resetCode: string = Color.DEFAULT;
    const boldCode: string = Color.BOLD;

    const description = typeof desc === 'object' ? util.inspect(desc, { colors: true }) : desc;

    console.log(`${colorCode}${boldCode}${title}${resetCode}${description}`);
};
