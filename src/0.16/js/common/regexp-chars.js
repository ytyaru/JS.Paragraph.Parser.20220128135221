class RegExpChars { // 正規表現で使用する字種パターン
    static #KANJI = '\\u2e80-\\u2fdf\\u3005\\u3007\\u303b\\u4e00-\\u9faf\\u3400-\\u4dbf\\uf900-\\ufaff';
    static #HIRAGANA = '\\u3041-\\u3096'
    static #KATAKANA = 'ｦ-ﾟ\\u30A1-\\u30FA'
    static #HALF_KATAKANA = 'ｦ-ﾟ'
    static #WIDE_KATAKANA = '\\u30A1-\\u30FA'

    static #SPACE = ' 　';
    static #WIDE_SPACE = '　'; // \u3000
    static #HALF_SPACE = ' ';

    static #SYMBOL = '!-/:-@¥[-`{-~\\u3000-\\u3040\\u3097-\\u30A0\\u30FB-\\u30FF'
    static #HALF_SYMBOL = '!-/:-@¥[-`{-~';
    static #WIDE_SYMBOL = '\\u3000-\\u3040\\u3097-\\u30A0\\u30FB-\\u30FF'

    static #ALPHABET = 'A-Za-zＡ-Ｚａ-ｚ';
    static #HALF_ALPHABET = 'A-Za-z';
    static #WIDE_ALPHABET = 'Ａ-Ｚａ-ｚ';

    static #NUMBER = '0-9０-９'
    static #HALF_NUMBER = '0-9'
    static #WIDE_NUMBER = '０-９'

    static get KANJI() { return RegExpChars .#KANJI; }
    static get HIRAGANA () { return RegExpChars .#HIRAGANA ; }
    static get KATAKANA () { return RegExpChars .#KATAKANA ; }
    static get HALF_KATAKANA () { return RegExpChars .#HALF_KATAKANA ; }
    static get WIDE_KATAKANA () { return RegExpChars .#WIDE_KATAKANA ; }
    static get SPACE() { return RegExpChars .#SPACE; }
    static get HALF_SPACE() { return RegExpChars .#HALF_SPACE; }
    static get WIDE_SPACE() { return RegExpChars .#WIDE_SPACE; }
    static get SYMBOL () { return RegExpChars .#SYMBOL ; }
    static get WIDE_SYMBOL () { return RegExpChars .#WIDE_SYMBOL ; }
    static get HALF_SYMBOL () { return RegExpChars .#HALF_SYMBOL ; }
    static get NUMBER () { return RegExpChars .#NUMBER ; }
    static get HALF_NUMBER () { return RegExpChars .#HALF_NUMBER ; }
    static get WIDE_NUMBER () { return RegExpChars .#WIDE_NUMBER ; }
    static get ALPHABET () { return RegExpChars .#ALPHABET ; }
    static get HALF_ALPHABET () { return RegExpChars .#HALF_ALPHABET ; }
    static get WIDE_ALPHABET () { return RegExpChars .#WIDE_ALPHABET ; }

    static toWide(str, isAlphabet=true, isNumber=true, isSymbol=true) { // 英数字記号を全角にする（記号は対象外）
        const A = (isAlphabet) ? RegExpChars.#HALF_ALPHABET : '';
        const N = (isNumber) ? RegExpChars.#HALF_NUMBER : '';
        const S = (isSymbol) ? '!-~' : '';
        let regexp = new RegExp(`[${A}${N}${S}]`, 'g');
        console.log(regexp);
        let v = str.replace(regexp, (s)=>{
        //let v = str.replace(/[!-~]/g, (s)=>{
            return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);

        });
        if (isSymbol) {
            v = v.replace(/"/g, '”')
                 .replace(/'/g, '’')
                 .replace(/`/g, '‘')
                 .replace(/\\/g, '￥')
                 .replace(/ /g, '　')
                 .replace(/~/g, '〜');
        }
        console.debug(str, v);
        return v;
    }
    static toHalf(str, isAlphabet=true, isNumber=true, isSymbol=true) {
        const A = (isAlphabet) ? RegExpChars.#WIDE_ALPHABET : '';
        const N = (isNumber) ? RegExpChars.#WIDE_NUMBER : '';
        const S = (isSymbol) ? '！-～' : '';
        let regexp = new RegExp(`[${A}${N}${S}]`, 'g');
        let v = str.replace(regexp, (s)=>{
        //let v = str.replace(/[！-～]/g, (s)=>{
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });

        if (isSymbol) {
            v = v.replace(/”/g, '"')
                 .replace(/’/g, "'")
                 .replace(/‘/g, '`')
                 .replace(/￥/g, '\\')
                 .replace(/　/g, ' ')
                 .replace(/〜/g, '~');
        }
        return v;
    }
}

