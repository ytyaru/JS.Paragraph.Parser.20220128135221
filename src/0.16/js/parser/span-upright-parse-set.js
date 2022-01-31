class SpanUpRightInput extends RegExpParseInput { // 縦中横（2〜4までの連続した数字） <span class="upright">2022</span>
    constructor(digits=4) {
        super();
        this._digits = digits;
        super.RegExps.push(new RegExp(`([${RegExpChars.NUMBER}${RegExpChars.ALPHABET}}]{1,${this._digits}})`, 'g'));
        //super.RegExps.push(new RegExp(`([${RegExpChars.NUMBER}${RegExpChars.ALPHABET}}]{1,${this._digits}})`, 'g'));
        //super.RegExps.push(new RegExp(`([0-9０-９a-zA-Z]{1,${this._digits}})`, 'g'));
        //super.RegExps.push(new RegExp(`([0-9０-９]{1,digits})`, 'g'));
    }
    get Options() { return super.Options; }
    get RegExps() { return super.RegExps; }
}
/*
   残念ながら2022-01-31時点で以下CSSはほぼ全ブラウザに渡って未実装である。
     text-combine-upright: digits 4;
     text-transform: full-width;
   そこでやむなく以下のように対応することにした。
     text-combine-upright: all;　＋　JSで字数制限
     JSで半角数字を全角数字に変換する
   なぜか縦中横は半角
*/
class SpanUpRightOutput extends RegExpParseOutput {
    constructor(digits=4, halfWide=1) { // 縦中横の最大桁数、英数字をそのまま／半角／全角にする
    //constructor(digits=4, halfWide=1) { // 縦中横の最大桁数、英数字をそのまま／半角／全角にする
    //constructor(digits=4, isWide=false) { // 縦中横の最大桁数、英数字をそのまま／半角／全角にする
        //super((content)=>{return ElementString.get('em', content);});
        //super((content)=>{return ElementString.get('span', (this._isWide) ? RegExpChars.toWide(content) : content, this._makeAttrs());});
        //super((content)=>{return ElementString.get('span', (this._isWide) ? RegExpChars.toHalf(content) : content, this._makeAttrs());});
        super((content)=>{ return ElementString.get('span', this._makeContent(content), this._makeAttrs()); });
        this._digits = digits;
        //this._isWide = isWide;
        this._halfWide = halfWide;
        this._style = new Style('style-span-upright');
        this._style.add(this._makeCss());
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
        /*
        return `
@supports not ( text-emphasis-style: ${style} ) and not ( -webkit-text-emphasis-style: ${style} ) and not ( -moz-text-emphasis-style: ${style} ) and not ( -ms-text-emphasis-style: ${style} ) and not ( -o-text-emphasis-style: ${style} )   {
em { font-weight: bold; }
}
@supports ( text-combine-upright: digits ${this._digits}; ) or ( -webkit- ) or ( -moz- ) or ( -ms- ) or ( -o- )   {
em {
    -webkit-text-emphasis-style: ${style};
    -moz-text-emphasis-style: ${style};
    -ms-text-emphasis-style: ${style};
    -o-text-emphasis-style: ${style};
    text-emphasis-style: ${style};
}
}`;
*/
        return `
.upright {
    text-combine-upright: all;
    ${this._getVenderPrefixProperties('text-combine-upright').map(k=> k + ': all;').join('\n    ')}
}
`;
    /*
        return `
${this._makeNotSupportsCss('text-combine-upright', 'digits ' + this._digits)} {
.upright {
    text-combine-upright: all;
    ${this._getVenderPrefixProperties('text-combine-upright').map(k=> k + ': all;').join('\n    ')}
}
}
${this._makeSupportsCss('text-combine-upright', 'digits ' + this._digits)} {
.upright {
    text-combine-upright: digits ${this._digits};
    ${this._getVenderPrefixProperties('text-combine-upright').map(k=> k + ': digits ' + this._digits + ';').join('\n    ')}
}
}
`;
    */
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
    static #Wide4 = new RegExpParseSet(new SpanUpRightInput(4), new SpanUpRightOutput(4, 1));
    static #Wide2 = new RegExpParseSet(new SpanUpRightInput(2), new SpanUpRightOutput(2, 1));
    static #Half4 = new RegExpParseSet(new SpanUpRightInput(4), new SpanUpRightOutput(4, -1));
    static #Half2 = new RegExpParseSet(new SpanUpRightInput(2), new SpanUpRightOutput(2, -1));
    static #As2 = new RegExpParseSet(new SpanUpRightInput(2), new SpanUpRightOutput(2, 0));
    static #As4 = new RegExpParseSet(new SpanUpRightInput(4), new SpanUpRightOutput(4, 0));

    static get Wide4() { return SpanUpRightParseSetFactory.#Wide4; } 
    static get Wide2() { return SpanUpRightParseSetFactory.#Wide2; } 
    static get Half4() { return SpanUpRightParseSetFactory.#Half4; } 
    static get Half2() { return SpanUpRightParseSetFactory.#Half2; } 
    static get As4() { return SpanUpRightParseSetFactory.#As4; } 
    static get As2() { return SpanUpRightParseSetFactory.#As2; } 
}

