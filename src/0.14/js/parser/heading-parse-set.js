class HeadingInput extends RegExpParseInput { // <hX>見出し</hX>  ＃見出し
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
            console.debug('meta:', meta)
            console.debug('content:', content)
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
class NamedAnchorHeadingOutput extends RegExpParseOutput { // 名前ID付き見出し
    constructor() {
        super((match, meta, content)=>{
            console.debug('meta:', meta)
            console.debug('content:', content)
            content = content.trim();
            const level = Math.max(...(['#','＃'].map(m=>(meta.match(new RegExp(`${m}`, 'g')) || []).length)))
            return (level < 7) ? ElementString.get(`h${level}`, content, this._makeAttrs(content)) : match;
        });
        this._ids = [];
    }
    _makeAttrs(content) {
        const attrs = new Map();
        attrs['id'] = this._makeId(content)
        return attrs;
    }
    _makeId(content) {// 重複回避ID作成
        const id = encodeURI(content);
        let suffix = '';
        let dup_count = 0;
        while (this._ids.includes(`${id}${suffix}`)) {
            dup_count++;
            suffix = `-${dup_count}`;
        }
        this._ids.push(`${id}${suffix}`);
        return `${id}${suffix}`;
    }
    parse(text, regexp) {
        return text.replace(regexp, (match, meta, content, offset, string, groups)=>{
            return this._func(match, meta, content);
        });
    }
    clear() { super.clear(); this._ids = null; this._ids = []; }
}
class NumberedAnchorHeadingOutput extends RegExpParseOutput { // 番号ID付き見出し
    constructor() {
        super((match, meta, content)=>{
            console.debug('meta:', meta)
            console.debug('content:', content)
            const level = Math.max(...(['#','＃'].map(m=>(meta.match(new RegExp(`${m}`, 'g')) || []).length)))
            if (level < 7) {
                this._count++;
                const attrs = new Map();
                attrs['id'] = `heading-${this._count}`;
                return ElementString.get(`h${level}`, content, attrs);
            } else { return match; }
        });
        this._count = 0;
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
