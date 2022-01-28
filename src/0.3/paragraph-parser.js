class ParagraphOutput extends ParseOutput {
    constructor(func) { super(func); }
    parse(text, regexp) {
        const ps = text.split(/\r\n\r\n|\r\r|\n\n/g);
        console.log(ps)
        let html = [];
        for (let p of ps) {
            const spans = p.split(/\r\n|\r|\n/g).filter(v => v); // 改行ごとに配列要素化し、空要素を削除する
            html.push((spans.length < 2) ? `<p>${spans[0]}</p>` : `<p>${spans.map(span=>ElementString.get('span', span)).join('<br>')}</p>`);
        }
        return html.join('');
    }
}
class ParagraphMultilineMarginStyleOutput extends ParseOutput {
    constructor(func) { super(func); }
    /*
    parse(text, regexp) {
        return text.replace(regexp, (match, text, br)=>{
            const lines = text.split(/\r\n|\r|\n/g);
            const content = (line.length < 2) ? text : lines.join('<br>');

            return `<p style="margin-block-end:${lineNum}em;">${content}</p>`;
        });
    }
    */
    parse(text, regexp) {
        const ps = text.split(/\r\n\r\n|\r\r|\n\n/g);
        console.log(ps)
        let html = [];
        for (let p of ps) {
            const spans = p.split(/\r\n|\r|\n/g).filter(v => v); // 改行ごとに配列要素化し、空要素を削除する
            html.push((spans.length < 2) ? `<p>${spans[0]}</p>` : `<p>${spans.map(span=>ElementString.get('span', span)).join('<br>')}</p>`);
        }
        return html.join('');
    }

}
class ParagraphMultilineMarginClassOutput extends ParseOutput {
    constructor(func) { super(func); }
    parse(text, regexp) {
        // CSSを動的生成する必要がある
        return text.replace(regexp, (match, text, br)=>{
            return `<p class="p-new-line-${lineNum};">${text}</p>`;
        });
    }
}
class ParagraphInput extends ParseInput {
    constructor() {
        super();
        super.RegExps.push(new RegExp(/[\s\S]*/mu));
    }
    //static #REGEX_PARAGRAPH = /^([\u{3000}])(.+)[\n]{2}/gmu;
}
class ParagraphMultilineInput extends ParseInput {
    constructor() {
        super();
        super.RegExps.push(new RegExp(/^(^([^\n]){1,}?)[\n]{2}([\n]{0,}?)/gmu));
    }
    //static #REGEX_PARAGRAPH = /^([\u{3000}])(.+)[\n]{2}/gmu;
}
class ParagraphParseSetFactory {
    static #Book = new ParseSet(new ParagraphInput(), new ParagraphOutput());
    static #Poem = new ParseSet(new ParagraphMultilineInput(), new ParagraphMultilineMarginStyleOutput());

    static get Book() { return ParagraphParseSetFactory.#Book; } 
    static get Poem() { return ParagraphParseSetFactory.#Poem; } 
}

