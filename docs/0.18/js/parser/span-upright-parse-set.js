/* 縦中横を実装する。
   残念ながら2022-01-31時点で以下CSSはほぼ全ブラウザに渡って未実装である。
     text-combine-upright: digits 4;
     text-transform: full-width;
   そこでやむなく以下のように対応することにした。
     text-combine-upright: all;　＋　JSで字数制限
     JSで全角英数字を半角英数字に変換する
   　　縦中横は半角にしたほうが字幅が大きく見やすい。逆に全角だと横幅が縮み左へ偏り見づらくなる。フォントが原因と思われる。縦中横は横書きのため横幅が等幅となっている半角のほうがピッタリ収まるのだろう。そのため縦中横にする字は半角にしたほうがよい。
   英数字は1〜2〜4、!?は1〜2字で縦中横にするのがベスト。よくあるのが2022年などの４桁西暦やHTMLなどの４桁略語。
   πなど特殊記号については自動化できなかった。そこで手動でマークする記法を追加した。+で囲んだ文字を縦中横にする。+π+のように。
*/
class SpanUpRightOutput extends ParseOutput {
    constructor(func) {
        super(func);
        this._style = new Style('style-span-upright');
        this._style.add(this._makeCss());
        this._halfWide = 0;
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
class AutoSpanUpRightOutput extends SpanUpRightOutput {
    constructor(chars=RegExpChars.NUMBER, digits=4, halfWide=-1) { // 縦中横の最大桁数、英数字をそのまま／半角／全角にする
        super((content)=>{return ElementString.get('span', this._makeContent(content), this._makeAttrs());});
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
    get Style() { return this._style; }
}
class MarkSpanUpRightOutput extends SpanUpRightOutput { // +縦中横+
    constructor(digits=4, halfWide=-1) { // 縦中横の最大桁数、英数字をそのまま／半角／全角にする
        super((content)=>{return ElementString.get('span', this._makeContent(content), this._makeAttrs());});
        this._digits = digits;
        this._halfWide = halfWide;
    }
    parse(text) {
        const regexp = new RegExp(`[+]([\\S]{1,${this._digits}}?)[+]`, 'g');
        //const regexp = new RegExp(`[+]([\\S|^${RegExpChars.NUMBER}${RegExpChars.ALPHABET}]{1,${this._digits}}?)[+]`, 'g');
        return text.replace(regexp, (match, content, offset, string, groups)=>{
            console.debug(content)
            return this._func(content);
        });
    }
    get Style() { return this._style; }
}
class SpanUpRightParseSetFactory {
    static #Wide4 = [new ParseSet(new AutoSpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 4, 1)),
                     new ParseSet(new AutoSpanUpRightOutput(`!?！？`, 2, 1)),
                     new ParseSet(new MarkSpanUpRightOutput(4, 1))];
    static #Wide2 = [new ParseSet(new AutoSpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 2, 1)),
                     new ParseSet(new AutoSpanUpRightOutput(`!?！？`, 2, 1)),
                     new ParseSet(new MarkSpanUpRightOutput(2, 1))];
    static #Half4 = [new ParseSet(new AutoSpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 4, -1)),
                     new ParseSet(new AutoSpanUpRightOutput(`!?！？`, 2, -1)),
                     new ParseSet(new MarkSpanUpRightOutput(4, -1))];
    static #Half2 = [new ParseSet(new AutoSpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 2, -1)),
                     new ParseSet(new AutoSpanUpRightOutput(`!?！？`, 2, -1)),
                     new ParseSet(new MarkSpanUpRightOutput(2, -1))];
    static #As4 = [new ParseSet(new AutoSpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 4, 0)),
                     new ParseSet(new AutoSpanUpRightOutput(`!?！？`, 2, 0)),
                     new ParseSet(new MarkSpanUpRightOutput(4, 0))];
    static #As2 = [new ParseSet(new AutoSpanUpRightOutput(`${RegExpChars.NUMBER}${RegExpChars.ALPHABET}!?！？`, 2, 0)),
                     new ParseSet(new AutoSpanUpRightOutput(`!?！？`, 2, 0)),
                     new ParseSet(new MarkSpanUpRightOutput(2, 0))];

    static #NumberHalf4 = [new ParseSet(new AutoSpanUpRightOutput(`${RegExpChars.NUMBER}`, 4, -1)),
                           new ParseSet(new MarkSpanUpRightOutput(4, -1))];
    static #AlphabetHalf4 = [new ParseSet(new AutoSpanUpRightOutput(`${RegExpChars.ALPHABET}`, 4, -1)),
                             new ParseSet(new MarkSpanUpRightOutput(4, -1))];

    static #Symbol2 = new ParseSet(new AutoSpanUpRightOutput(`!?！？`, 2, 0));
    static #Mark4 = new ParseSet(new MarkSpanUpRightOutput(4, 0));

    static get Wide4() { return SpanUpRightParseSetFactory.#Wide4; } 
    static get Wide2() { return SpanUpRightParseSetFactory.#Wide2; } 
    static get Half4() { return SpanUpRightParseSetFactory.#Half4; } 
    static get Half2() { return SpanUpRightParseSetFactory.#Half2; } 
    static get As4() { return SpanUpRightParseSetFactory.#As4; } 
    static get As2() { return SpanUpRightParseSetFactory.#As2; } 

    static get NumberHalf4() { return SpanUpRightParseSetFactory.#NumberHalf4; } 
    static get AlphabetHalf4() { return SpanUpRightParseSetFactory.#AlphabetHalf4; } 
    
    static get Symbol2 () { return SpanUpRightParseSetFactory.#Symbol2 ; } 
    static get Mark4() { return SpanUpRightParseSetFactory.#Mark4; } 
}

