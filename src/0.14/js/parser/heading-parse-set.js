class HeadingInput extends RegExpParseInput { // <hX>見出し</hX>  ＃見出し
    constructor(options={}) {
        super();
        super.RegExps.push(new RegExp(`^([#＃]{1,})([^\n]+?)$`, 'gm'));
    }
    get Options() { return super.Options; }
    get RegExps() { return super.RegExps; }
}
class HeadingOutput extends RegExpParseOutput {
    constructor(func) { super(func); }
    getLevel(meta) { return Math.max(...(['#','＃'].map(m=>(meta.match(new RegExp(`${m}`, 'g')) || []).length))); }
    parse(text, regexp) {
        return text.replace(regexp, (match, meta, content, offset, string, groups)=>{
            const level = this.getLevel(meta);
            return (level < 7) ? this._func(level, content.trim()) : match;
        });
    }
}
class SimpleHeadingOutput extends HeadingOutput { // 単純な見出し
    constructor() {
        super((level, content)=>{ return ElementString.get(`h${level}`, content); });
    }
}
class NumberedAnchorHeadingOutput extends HeadingOutput { // 番号ID付き見出し
    constructor() {
        super((level, content)=>{return ElementString.get(`h${level}`, content, this._makeAttrs());});
        this._count = 0;
    }
    _makeAttrs() {
        const attrs = new Map();
        attrs['id'] = this._makeId();
        return attrs;
    }
    _makeId() { // 連番
        this._count++;
        return `heading-${this._count}`;
    }
    clear() { super.clear(); this._count = 0; }
}
class NamedAnchorHeadingOutput extends HeadingOutput { // 名前ID付き見出し
    constructor() {
        super((level, content)=>{return ElementString.get(`h${level}`, content, this._makeAttrs(content));});
        this._ids = [];
    }
    _makeAttrs(content) {
        const attrs = new Map();
        attrs['id'] = this._makeId(content);
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
    clear() { super.clear(); this._ids = null; this._ids = []; }
}
class HeadingParseSetFactory {
    static #Simple = new RegExpParseSet(new HeadingInput(), new SimpleHeadingOutput());
    static #Numbered = new RegExpParseSet(new HeadingInput(), new NumberedAnchorHeadingOutput());
    static #Named = new RegExpParseSet(new HeadingInput(), new NamedAnchorHeadingOutput());

    static get Simple() { return HeadingParseSetFactory.#Simple; } 
    static get Numbered() { return HeadingParseSetFactory.#Numbered; } 
    static get Named() { return HeadingParseSetFactory.#Named; } 
}
