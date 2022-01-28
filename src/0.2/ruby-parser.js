class RubyOutput extends ParseOutput {
    constructor(func) { super(func); }
    parse(text, regexp) {
        return text.replace(regexp, (match, rb, rt)=>{
            return this._func(rb, rt);
        });
    }
}
class RubyFullParameterOutput extends ParseOutput {
    constructor(func) { super(func); }
    parse(text, regexp) {
        return text.replace(regexp, (match, rb, rt, offset, string, groups)=>{
            console.log(match, rb, rt, offset, string, groups)
            return this._func(match, rb, rt, offset, string, groups);
        });
    }
}
class RubyHtmlOutput extends RubyOutput {
    constructor() { super((rb, rt)=>{return `<ruby>${rb}<rp>（</rp><rt>${rt}</rt><rp>）</rp></ruby>`});  }
}
class RubyLongNovelOutput extends RubyOutput {
    constructor() { super((rb, rt)=>{return `|${rb}《${rt}》`}); } // ハーメルンは全角｜だとダメなので半角|にした
}
class RubyShortNovelOutput extends RubyOutput {
    constructor() { super((rb, rt)=>{return `${rb}《${rt}》`}); } // (,（は、なろうのみ対応なので《》にした
}
class RubyAlphaPoliceOutput extends RubyOutput {
    constructor() { super((rb, rt)=>{return `#${rb}__${rt}__#`}); }
}
class RubyDendenOutput extends RubyOutput {
    constructor() { super((rb, rt)=>{
        const rts = rt.split('|');
        console.log(rts, rb.length !== rts.length)
        if (1 === rts.length) { return `{${rb}|${rt}}`; }
        if (rb.length !== rts.length ) { return `{${rb}|${rts.join('')}}`; } // ベースとルビの数が合わないとき
        let s = '';
        for (let i=0; i<rb.length; i++) { // モノルビ風の熟語ルビを、複数のグループルビに置換する（処理を簡略化するため）
            s += `{${rb[i]}|${rts[i]}}`
        }
        console.log(s)
        return s;
    });} // |が複数あり1字ずつにセットできる形式は複雑なため対象外
}
class RubyShortToLongNovelOutput extends RubyFullParameterOutput { // 短縮形を完全形にする（《》→|《》）
    constructor(options={}) {
        super((match, rb, rt, offset, string, groups)=>{
            const opt = { ...RubyOptionalInput.DefaultOptions, ...options };
            for (let i=1; i<opt.rbLen+1; i++) { // i<rbLeng, '|','｜'===begin
                // Long型なら変換しない（rb文字数上限までの間に開始字|があれば）
                for (const begin of opt.begin) {
                    if (begin === string[offset-i]) { return match; } 
                }
                if ('》' === string[offset-i]) { break; } // 一つ前のルビ変換処理がありその間に|がなければ変換する
            }
            return `|${rb}《${rt}》`; // (,（は、なろうのみ対応なので《》にした。|はハーメルンが半角のみなのでそうした。
        });
    }
}

class RubyNovelInput extends ParseInput {
    constructor(short={}, long={}) {
        super();
        this._long = (long) ? new RubyLongNovelInput(long) : null;
        this._short = (short) ? new RubyShortNovelInput(short) : null;
        for (const input of [this._long, this._short]) {
            if (input) { for (const regexp of input.RegExps) { this.RegExps.push(regexp); } }
        }
    }
    get RegExps() { return super.RegExps; }
}
class RubyRootInput extends RubyNovelInput {
    constructor() { super({encBegin:'｛', encEnd:'｝'}, { begin:'｜', encBegin:'｛', encEnd:'｝'})}
    get RegExps() { return super.RegExps; }
}
class RubyAozoraInput extends RubyNovelInput {
    constructor() {super({encBegin:'《', encEnd:'》'}, {encBegin:'《', encEnd:'》'})}
    get RegExps() { return super.RegExps; }
}
class RubyNarouInput extends RubyNovelInput {
    constructor() {super({rbLen:10, rtLen:20, encBegin:'(（', encEnd:')）'}, {rbLen:10, rtLen:20, encBegin:'《', encEnd:'》'})}
    get RegExps() { return super.RegExps; }
}
class RubyKakuyomuInput extends RubyNovelInput {
    constructor() {super({encBegin:'《', encEnd:'》'}, {encBegin:'《', encEnd:'》'})}
    get RegExps() { return super.RegExps; }
}
class RubyHamelnInput extends RubyNovelInput {
    constructor() {super(null, {begin:'|', encBegin:'《', encEnd:'》'})}
    get RegExps() { return super.RegExps; }
}
class RubyOptionalInput extends ParseInput {
    static #DEFAULT_OPTIONS = {
        begin: '|｜',
        rb: '^\n',
        rt: '^\n',
        rbLen: 20,
        rtLen: 50,
        encBegin: '(（《{｛',
        encEnd: ')）》}｝',
    };
    constructor(regexp, options={}) {
        super();
        super.RegExps.push(regexp);
        this._options = { ...RubyOptionalInput.#DEFAULT_OPTIONS, ...options };
    }
    static get DefaultOptions() { return RubyOptionalInput.#DEFAULT_OPTIONS; }
    get Options() { return this._options; }
    get RegExps() { return super.RegExps; }
}
class RubyLongNovelInput extends RubyOptionalInput { // 字種、字数、囲み文字を制限したもの
    constructor(options={}) {
        let opt = { ...RubyOptionalInput.DefaultOptions, ...options };
        super(new RegExp(`[${opt.begin}]([${opt.rb}]{1,${opt.rbLen}}?)[${opt.encBegin}]([${opt.rt}]{1,${opt.rtLen}}?)[${opt.encEnd}]`, 'g'), opt);
    }
    get Options() { return super.Options; }
    get RegExps() { return super.RegExps; }
}
class RubyShortNovelInput extends RubyOptionalInput { // 
    constructor(options={}) {
        const def = {rb: `${Chars.KANJI}${Chars.ALPHABET}${Chars.NUMBER}` };
        let opt = { ...RubyOptionalInput.DefaultOptions, ...def, ...options };
        delete opt['begin'];
        super(new RegExp(`([${opt.rb}]{1,${opt.rbLen}}?)[${opt.encBegin}]([${opt.rt}]{1,${opt.rtLen}}?)[${opt.encEnd}]`, 'g'), opt);
    }
    get Options() { return super.Options; }
    get RegExps() { return super.RegExps; }
}
class RubyDendenInput extends ParseInput { 
    constructor(options={}) {
        super();
        super.RegExps.push(new RegExp(`\{([^\\n]{1,}?)[\|]([^\\n]{1,}?)\}`, 'g'));
    }
    get Options() { return super.Options; }
    get RegExps() { return super.RegExps; }
}
class RubyAlphaPoliceInput extends ParseInput {
    constructor(options={}) {
        super();
        super.RegExps.push(new RegExp(`#([^\\n]{1,}?)__([^\\n]{1,}?)__#`, 'g'));
    }
    get Options() { return super.Options; }
    get RegExps() { return super.RegExps; }
}

class RubyParseSetFactory {
    static #RootHtml = new ParseSet(new RubyRootInput(), new RubyHtmlOutput());               // ｛｝→<ruby>
    static #RootNovel = new ParseSet(new RubyRootInput(), new RubyLongNovelOutput());         // ｛｝→｜《》
    static #NovelHtml = new ParseSet(new RubyNovelInput(), new RubyHtmlOutput());             // ｜《》→<ruby>

    // 青空文庫→｜｛｝
    static #AozoraNovel = [new ParseSet(new RubyLongNovelInput({encBegin:'《', encEnd:'》'}), new RubyLongNovelOutput()),
                           new ParseSet(new RubyShortNovelInput({encBegin:'《', encEnd:'》'}), new RubyShortToLongNovelOutput())];
    static #AozoraHtml = [new ParseSet(new RubyLongNovelInput({encBegin:'《', encEnd:'》'}), new RubyHtmlOutput()),
                           new ParseSet(new RubyShortNovelInput({encBegin:'《', encEnd:'》'}), new RubyHtmlOutput())];
    // カクヨム→｜《》
    static #KakuyomuNovel = RubyParseSetFactory.#AozoraNovel;
    static #KakuyomuHtml = RubyParseSetFactory.#AozoraHtml;
    static #NarouNovel = new ParseSet(new RubyNarouInput(), new RubyLongNovelOutput());       // なろう→｜《》
    static #NarouHtml = new ParseSet(new RubyNarouInput(), new RubyHtmlOutput());             // なろう→HTML
    static #HamelnNovel = new ParseSet(new RubyHamelnInput(), new RubyLongNovelOutput());     // ハーメルン→｜《》
    static #HamelnHtml = new ParseSet(new RubyHamelnInput(), new RubyHtmlOutput());           // ハーメルン→HTML
    static #AlphaPoliceNovel = new ParseSet(new RubyAlphaPoliceInput(), new RubyLongNovelOutput()); // アルファポリス→｜《》
    static #AlphaPoliceHtml = new ParseSet(new RubyAlphaPoliceInput(), new RubyHtmlOutput());       // アルファポリス→HTML
    static #DendenNovel = [new ParseSet(new RubyDendenInput(), new RubyDendenOutput()),
                           new ParseSet(new RubyDendenInput(), new RubyLongNovelOutput())];     // でんでん→｜《》
    static #DendenHtml = [new ParseSet(new RubyDendenInput(), new RubyDendenOutput()),
                          new ParseSet(new RubyDendenInput(), new RubyHtmlOutput())];           // でんでん→HTML

    static #NovelAlphaPolice = new ParseSet(new RubyNovelInput(), new RubyAlphaPoliceOutput()); // ｜《》→アルファポリス
    static #NovelDenden = new ParseSet(new RubyNovelInput(), new RubyDendenOutput());           // ｜《》→でんでん

    static get RootHtml() { return RubyParseSetFactory.#RootHtml; } 
    static get RootNovel() { return RubyParseSetFactory.#RootNovel; } 
    static get NovelHtml() { return RubyParseSetFactory.#NovelHtml; } 

    static get AozoraNovel() { return RubyParseSetFactory.#AozoraNovel; } 
    static get AozoraHtml() { return RubyParseSetFactory.#AozoraHtml; } 
    static get KakuyomuNovel () { return RubyParseSetFactory.#KakuyomuNovel ; } 
    static get KakuyomuHtml() { return RubyParseSetFactory.#KakuyomuHtml; } 
    static get NarouNovel () { return RubyParseSetFactory.#NarouNovel ; } 
    static get NarouHtml() { return RubyParseSetFactory.#NarouHtml; } 
    static get HamelnNovel () { return RubyParseSetFactory.#HamelnNovel ; } 
    static get HamelnHtml() { return RubyParseSetFactory.#HamelnHtml; } 
    static get AlphaPoliceNovel () { return RubyParseSetFactory.#AlphaPoliceNovel ; } 
    static get AlphaPoliceHtml() { return RubyParseSetFactory.#AlphaPoliceHtml; } 
    static get DendenNovel () { return RubyParseSetFactory.#DendenNovel ; } 
    static get DendenHtml() { return RubyParseSetFactory.#DendenHtml; }

    static get NovelAlphaPolice () { return RubyParseSetFactory.#NovelAlphaPolice; } 
    static get NovelDenden () { return RubyParseSetFactory.#NovelDenden ; } 

}

