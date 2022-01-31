class EmInput extends RegExpParseInput { // <em>強調</em>  ＊強調＊
    constructor(options={}) {
        super();
        super.RegExps.push(new RegExp(`＊([^\n]{1,}?)＊`, 'g'));
    }
    get Options() { return super.Options; }
    get RegExps() { return super.RegExps; }
}
class EmTextEmphasisStyleOutput extends RegExpParseOutput {
    constructor(style='sesame') { // filled,open,dot,circle,double-circle,triangle。filled sesame,open sesame。
        super((content)=>{return ElementString.get('em', content);});
        this._style = new Style('style-em');
        this._style.add(this._makeCss(style));
    }
    _makeCss(style) {
        return `
@supports not ( text-emphasis-style: ${style} ) and not ( -webkit-text-emphasis-style: ${style} ) and not ( -moz-text-emphasis-style: ${style} ) and not ( -ms-text-emphasis-style: ${style} ) and not ( -o-text-emphasis-style: ${style} )   {
em { font-weight: bold; }
}
@supports ( text-emphasis-style: ${style} ) or ( -webkit-text-emphasis-style: ${style} ) or ( -moz-text-emphasis-style: ${style} ) or ( -ms-text-emphasis-style: ${style} ) or ( -o-text-emphasis-style: ${style} )   {
em {
    -webkit-text-emphasis-style: ${style};
    -moz-text-emphasis-style: ${style};
    -ms-text-emphasis-style: ${style};
    -o-text-emphasis-style: ${style};
    text-emphasis-style: ${style};
}
}`;
    }
    get Style() { return this._style; }
}

class EmTextDecorationOutput extends RegExpParseOutput {
    constructor(func, line='underline', style='solid', color='inherit', thickness='auto') {
        super(func);
        this._style = new Style('style-em');
        this._style.add(this._makeCss(line, style, color, thickness));
    }
    _makeCss(line, style, color, thickness) {
        return `em {
    text-decoration-line: ${line};
    text-decoration-style: ${style};
    text-decoration-color: ${color};
    text-decoration-thickness: ${thickness};
}`;
    /*
        none,underline,overline,line-through,,,,,,,,,,
        solid,double,dotted,dashed,wavy。inherit,initial,revert,unset,,
        <color>（currentcolor,red,#FF00FF,transparent）
        auto,from-font,<length>,<percentage>
    */
    }
    parse(text, regexp) {
        return text.replace(regexp, (match, content)=>{
            return ElementString.get('em', content);
        });
    }
    get Style() { return this._style; }
}
class EmParseSetFactory {
    static #Normal = new RegExpParseSet(new EmInput(), new EmTextEmphasisStyleOutput());
    static get Normal() { return EmParseSetFactory.#Normal; } 
}

