class HeadingInput extends RegExpParseInput { // <em>強調</em>  ＊強調＊
    constructor(options={}) {
        super();
        super.RegExps.push(new RegExp(`^([#＃]{1,})([^\n]+?)$`, 'gm'));
    }
    get Options() { return super.Options; }
    get RegExps() { return super.RegExps; }
}
class HeadingOutput extends RegExpParseOutput {
    constructor() {
        super((match, meta, content)=>{
            console.log('meta:', meta)
            console.log('content:', content)
            const level = Math.max(...(['#','＃'].map(m=>(meta.match(new RegExp(`${m}`, 'g')) || []).length)))
            return (level < 7) ? ElementString.get(`h${level}`, content) : match;
        });
    }
    parse(text, regexp) {
        return text.replace(regexp, (match, meta, content, offset, string, groups)=>{
            return this._func(match, meta, content);
        });
    }

}
class NamedAnchorHeadingOutput extends RegExpParseOutput {
    constructor() {
        super((match, meta, content)=>{
            console.log('meta:', meta)
            console.log('content:', content)
            const level = Math.max(...(['#','＃'].map(m=>(meta.match(new RegExp(`${m}`, 'g')) || []).length)))
            const attrs = new Map();
            attrs['id'] = encodeURI(content)
            return (level < 7) ? ElementString.get(`h${level}`, content, attrs) : match;
        });
    }
    parse(text, regexp) {
        return text.replace(regexp, (match, meta, content, offset, string, groups)=>{
            return this._func(match, meta, content);
        });
    }

}
class HeadingParseSetFactory {
    //static #Normal = new RegExpParseSet(new HeadingInput(), new HeadingOutput());
    static #Normal = new RegExpParseSet(new HeadingInput(), new NamedAnchorHeadingOutput());
    static get Normal() { return HeadingParseSetFactory.#Normal; } 
}
