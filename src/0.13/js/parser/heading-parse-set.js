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
class NumberedAnchorHeadingOutput extends RegExpParseOutput {
    constructor() {
        /*
        super();
        super.RegExps.push((match, meta, content)=>{
            console.log('meta:', meta)
            console.log('content:', content)
            const level = Math.max(...(['#','＃'].map(m=>(meta.match(new RegExp(`${m}`, 'g')) || []).length)))
            const attrs = new Map();
            attrs['id'] = `heading-${this._count}`;
            return (level < 7) ? ElementString.get(`h${level}`, content, attrs) : match;
        });
        */
        super((match, meta, content)=>{
            console.log('meta:', meta)
            console.log('content:', content)
            const level = Math.max(...(['#','＃'].map(m=>(meta.match(new RegExp(`${m}`, 'g')) || []).length)))
            if (level < 7) {
                this._count++;
                const attrs = new Map();
                attrs['id'] = `heading-${this._count}`;
                return ElementString.get(`h${level}`, content, attrs);
            } else { return match; }
        });
        this._count = 0;
        /*
        */
    }
    parse(text, regexp) {
        return text.replace(regexp, (match, meta, content, offset, string, groups)=>{
            return this._func(match, meta, content);
        });
    }

}
class HeadingParseSetFactory {
    //static #Normal = new RegExpParseSet(new HeadingInput(), new HeadingOutput());
    //static #Normal = new RegExpParseSet(new HeadingInput(), new NamedAnchorHeadingOutput());
    static #Normal = new RegExpParseSet(new HeadingInput(), new NumberedAnchorHeadingOutput());
    static get Normal() { return HeadingParseSetFactory.#Normal; } 
}
