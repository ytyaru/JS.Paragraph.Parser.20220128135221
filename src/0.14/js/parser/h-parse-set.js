class HeadingInput extends RegExpParseInput { // <em>強調</em>  ＊強調＊
    constructor(options={}) {
        super();
        super.RegExps.push(new RegExp(`^([#＃]{1,6}?)[\s]{0,}([^\n]{1,}?)$`, 'g'));
        console.log('======================')
    }
    get Options() { return super.Options; }
    get RegExps() { return super.RegExps; }
}
class HeadingOutput extends RegExpParseOutput {
    constructor() {
        super((meta, content)=>{
            const level = Math.max(...['#','＃'].map(m=>(meta.match(`${m}`, 'g')||[]).length));
//            for (let m of ['#','＃']) { meta.match(`${m}`, 'g')
//            const level = Math.max((meta.match(/#/g) || []).length, (meta.match(/＃/g) || []).length)
            return ElementString.get(`h${level}`, content);}
        );
    }
}
class HeadingParseSetFactory {
    static #Normal = new RegExpParseSet(new HeadingInput(), new HeadingOutput());
    static get Normal() { return HeadingParseSetFactory.#Normal; } 
}

