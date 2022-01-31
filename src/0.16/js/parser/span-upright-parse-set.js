class SpanUpRightInput extends RegExpParseInput { // 縦中横（2〜4までの連続した数字） <span class="upright">2022</span>
    constructor(options={}) {
        super();
        super.RegExps.push(new RegExp(`([0-9０-９]{1,})`, 'g'));
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
*/
class SpanUpRightOutput extends RegExpParseOutput {
    constructor(digits=4, isWide=false) { // 縦中横の最大桁数、半角数字を全角にするか否か
        //super((content)=>{return ElementString.get('em', content);});
        super((content)=>{return ElementString.get('span', (this._isWide) ? RegExpChars.toWide(content) : content, this._makeAttrs());});
        this._digits = digits;
        this._isWide = isWide;
        this._style = new Style('style-span-upright');
        this._style.add(this._makeCss());
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
    static #Wide4 = new RegExpParseSet(new SpanUpRightInput(), new SpanUpRightOutput(4, true));
    static #Wide2 = new RegExpParseSet(new SpanUpRightInput(), new SpanUpRightOutput(2, true));
    static #As2 = new RegExpParseSet(new SpanUpRightInput(), new SpanUpRightOutput(2, false));
    static #As4 = new RegExpParseSet(new SpanUpRightInput(), new SpanUpRightOutput(4, false));
    static get Wide4() { return SpanUpRightParseSetFactory.#Wide4; } 
    static get Wide2() { return SpanUpRightParseSetFactory.#Wide2; } 
    static get As4() { return SpanUpRightParseSetFactory.#As4; } 
    static get As2() { return SpanUpRightParseSetFactory.#As2; } 
}

