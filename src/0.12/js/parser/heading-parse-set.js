/*
class HeadingOutput extends ParseOutput {
    constructor(func) {
        super(func);
    }
    parse(text) {
        let parsed = text;
        for (const regexp of this._input.RegExps) {
            parsed = this._output.parse(parsed, regexp)
        }
        return parsed;
    }

}
*/
class HeadingInput extends RegExpParseInput { // <em>強調</em>  ＊強調＊
    constructor(options={}) {
        super();
        //super.RegExps.push(new RegExp(`^([#＃]{1,6}?)[\s]{0,}([^\n]{1,}?)$`, 'g'));
        //super.RegExps.push(new RegExp(`^([#＃]{1,6}?)([^\n]{1,}?)$`, 'g'));
        //super.RegExps.push(new RegExp(`^(#{1,6}?)([\S]{1,}?)`, 'gm'));
        //super.RegExps.push(new RegExp(`^(#{1,6}?)([^\n]+?)[\n]`, 'gm'));
        //super.RegExps.push(new RegExp(`^([#＃]{1,6}?)([^\n]+?)[\n]`, 'g'));
        //super.RegExps.push(new RegExp(`^([#＃]{1,6}?)([^\n]+?)[\n]`, ''));
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
            //const level = Math.max(...(['#','＃'].map(m=>(meta.match(`${m}`, 'g') || []).length)))
            //const level = Math.max(...(['#','＃'].map(m=>(meta.match(new RegExp(`${m}`, 'g')) || []).length)))
            //const level = Math.max((meta.match(/#/g) || []).length, (meta.match(/＃/g) || []).length)
            console.log(level)
            console.log((meta.match(/#/g) || []).length)
            console.log((meta.match(/＃/g) || []).length)
            console.log(['#','＃'].map(m=>(meta.match(new RegExp(`${m}`, 'g')) || []).length))
            console.log(Math.max(['#','＃'].map(m=>(meta.match(new RegExp(`${m}`, 'g')) || []).length)))
//            console.log(['#','＃'].map(m=>(meta.match(`${m}`, 'g') || []).length))
//            console.log(Math.max(['#','＃'].map(m=>(meta.match(`${m}`, 'g') || []).length)))

//            return ElementString.get(`h${level}`, content);
            return (level < 7) ? ElementString.get(`h${level}`, content) : match;
            
        });
    }
    parse(text, regexp) {
        return text.replace(regexp, (match, meta, content, offset, string, groups)=>{
            //console.log(match, meta, content, offset, string, groups)
            console.log(meta, content)
            return this._func(match, meta, content);
        });
    }

}
class HeadingParseSetFactory {
    static #Normal = new RegExpParseSet(new HeadingInput(), new HeadingOutput());
    static get Normal() { return HeadingParseSetFactory.#Normal; } 
}
