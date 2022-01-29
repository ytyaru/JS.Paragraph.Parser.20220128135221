class Chars {
    static #KANJI = '\\u2e80-\\u2fdf\\u3005\\u3007\\u303b\\u4e00-\\u9faf\\u3400-\\u4dbf\\uf900-\\ufaff';
    static #ALPHABET = 'A-Za-zＡ-Ｚａ-ｚ';
    static #NUMBER = '0-9０-９'
    static #WIDE_SYMBOL = '\\u3000-\\u3040\\u3097-\\u30A0\\u30FB-\\u30FF'
    static #HIRAGANA = '\\u3041-\\u3096'
    static #KATAKANA = '\\u30A1-\\u30FA'
    static #HALF_SYMBOL = '!-/:-@¥[-`{-~';
    static get KANJI() { return Chars.#KANJI; }
    static get ALPHABET () { return Chars.#ALPHABET ; }
    static get NUMBER () { return Chars.#NUMBER ; }
    static get WIDE_SYMBOL () { return Chars.#WIDE_SYMBOL ; }
    static get HALF_SYMBOL () { return Chars.#HALF_SYMBOL ; }
    static get HIRAGANA () { return Chars.#HIRAGANA ; }
    static get KATAKANA () { return Chars.#KATAKANA ; }
}

