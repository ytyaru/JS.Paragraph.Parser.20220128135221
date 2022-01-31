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
            content = content.trim();
            const level = Math.max(...(['#','＃'].map(m=>(meta.match(new RegExp(`${m}`, 'g')) || []).length)))
            /*
            const attrs = new Map();
            attrs['id'] = encodeURI(content)

            let dup = '';
            let dup_count = 0;
            while (document.getElementById(`${attrs['id']}${dup}`)) {
                dup_count++;
                dup = `-${dup_count}`
            }
            if (0 < dup_count) { attrs['id'] = encodeURI(${content}${dup}); }

            return (level < 7) ? ElementString.get(`h${level}`, content, attrs) : match;
            */
            return (level < 7) ? ElementString.get(`h${level}`, content, this._makeAttrs(content)) : match;
        });
        this._ids = [];
    }
    _makeAttrs(content) { // avoidIdDuplication
        const attrs = new Map();
        attrs['id'] = encodeURI(content);
        console.log(this._ids)
//        if (attrs['id'] in this._ids) {
//        if (attrs['id'] in this._ids) {
            let dup = '';
            let dup_count = 0;
            while (this._ids.includes(`${attrs['id']}${dup}`)) {
//            while (`${attrs['id']}${dup}` in this._ids) {
//            while (document.getElementById(`${attrs['id']}${dup}`)) {
                dup_count++;
                dup = `-${dup_count}`;
            }
            if (0 < dup_count) { attrs['id'] = encodeURI(`${content}${dup}`); }
//        }
        this._ids.push(attrs['id']);
        return attrs;
    }
    parse(text, regexp) {
        return text.replace(regexp, (match, meta, content, offset, string, groups)=>{
            return this._func(match, meta, content);
        });
    }
    clear() { super.clear(); this._ids = null; this._ids = []; }
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
    static #Normal = new RegExpParseSet(new HeadingInput(), new NamedAnchorHeadingOutput());
    //static #Normal = new RegExpParseSet(new HeadingInput(), new NumberedAnchorHeadingOutput());
    static get Normal() { return HeadingParseSetFactory.#Normal; } 
}
