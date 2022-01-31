/* 縦中横を実装する。
   残念ながら2022-01-31時点で以下CSSはほぼ全ブラウザに渡って未実装である。
     text-combine-upright: digits 4;
     text-transform: full-width;
   そこでやむなく以下のように対応することにした。
     text-combine-upright: all;　＋　JSで字数制限
     JSで半角数字を全角数字に変換する
   なぜか縦中横は半角にしたほうが字幅が大きく見やすい。逆に全角だと横幅が縮み左へ偏り見づらくなる。そのため縦中横にする字は半角にしたほうがよい。
   英数字は1〜2〜4、!?は1〜2字で縦中横にするのがベスト。
   πなど特殊記号については自動化できなかった。
*/
class AutoSpanUpRightOutput extends ParseOutput {
    constructor(chars=RegExpChars.NUMBER, digits=4, halfWide=1) { // 縦中横の最大桁数、英数字をそのまま／半角／全角にする
        super((content)=>{return ElementString.get('span', this._makeContent(content), this._makeAttrs());});
        this._style = new Style('style-span-upright');
        this._style.add(this._makeCss());
        this._chars = chars;
        this._digits = digits;
        this._halfWide = halfWide;
    }
    parse(text) {
        const regexp = new RegExp(`([${this._chars}}]{1,${this._digits}})`, 'g');
        return text.replace(regexp, (match, content, offset, string, groups)=>{
            return this._func(content);
        });
    }
    _makeContent(content) {
        if      (0 < this._halfWide) { return RegExpChars.toWide(content); }
        else if (0 > this._halfWide) { return RegExpChars.toHalf(content); }
        else                     { return content; }
    }
    _makeAttrs() {
        const attrs = new Map();
        attrs['class'] = 'upright';
        return attrs;
    }
    _makeCss() {
        return `
.upright {
    text-combine-upright: all;
    ${this._getVenderPrefixProperties('text-combine-upright').map(k=> k + ': all;').join('\n    ')}
}
`;
    }
    _getVenderPrefixProperties(key) { return ['-webkit-', '-moz-', '-ms-', '-o-'].map(p=> `${p}${key}`); }
    _makeSupportsCss(key, value) {
        return '@supports ' + this._getVenderPrefixProperties(key).map(prop=>`( ${prop}: ${value}; )`).join(' or ');
    }
    _makeNotSupportsCss(key, value) {
        return '@supports not ' + this._getVenderPrefixProperties(key).map(prop=>`( ${prop}: ${value}; )`).join(' and not ');
    }
    get Style() { return this._style; }
}
class SpanUpRightParseSetFactory {
    static #Wide4 = [new ParseSet(new AutoSpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 4, 1)),
                     new ParseSet(new AutoSpanUpRightOutput(`!?！？`, 2, 1))];
    static #Wide2 = [new ParseSet(new AutoSpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 2, 1)),
                     new ParseSet(new AutoSpanUpRightOutput(`!?！？`, 2, 1))];
    static #Half4 = [new ParseSet(new AutoSpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 4, -1)),
                     new ParseSet(new AutoSpanUpRightOutput(`!?！？`, 2, -1))];
    static #Half2 = [new ParseSet(new AutoSpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 2, -1)),
                     new ParseSet(new AutoSpanUpRightOutput(`!?！？`, 2, -1))];
    static #As4 = [new ParseSet(new AutoSpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 4, 0)),
                     new ParseSet(new AutoSpanUpRightOutput(`!?！？`, 2, 0))];
    static #As2 = [new ParseSet(new AutoSpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 2, 0)),
                     new ParseSet(new AutoSpanUpRightOutput(`!?！？`, 2, 0))];


    /*
    static #Wide4 = new ParseSet(new SpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 4, 1));
    static #Wide2 = new ParseSet(new SpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 2, 1));
    static #Half4 = new ParseSet(new SpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 4, -1));
    static #Half2 = new ParseSet(new SpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 2, -1));
    static #As4 = new ParseSet(new SpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 4, 0));
    static #As2 = new ParseSet(new SpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 2, 0));
    */
    static #NumberHalf4 = new ParseSet(new AutoSpanUpRightOutput(`${RegExpChars.NUMBER}`, 4, -1));
    static #AlphabetHalf4 = new ParseSet(new AutoSpanUpRightOutput(`${RegExpChars.ALPHABET}`, 4, -1));

    static get Wide4() { return SpanUpRightParseSetFactory.#Wide4; } 
    static get Wide2() { return SpanUpRightParseSetFactory.#Wide2; } 
    static get Half4() { return SpanUpRightParseSetFactory.#Half4; } 
    static get Half2() { return SpanUpRightParseSetFactory.#Half2; } 
    static get As4() { return SpanUpRightParseSetFactory.#As4; } 
    static get As2() { return SpanUpRightParseSetFactory.#As2; } 

    static get NumberHalf4() { return SpanUpRightParseSetFactory.#NumberHalf4; } 
    static get AlphabetHalf4() { return SpanUpRightParseSetFactory.#AlphabetHalf4; } 
}

