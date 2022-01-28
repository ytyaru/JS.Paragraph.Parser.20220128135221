class ParagraphOutput extends ParseOutput {
    constructor(func) { super(func); }
    parse(text, regexp) {
        return text.replace(regexp, (match, text)=>{
            const lines = text.split(/\r\n|\r|\n/g);
            console.log(lines);
            //return (lines.length < 2) ? `<p>${text}</p>` : `<p>${lines.join('<br>')}</p>`;
            return (lines.length < 2) ? `<p>${text}</p>` : `<p>${lines.map(line=>ElementString.get('span', line)).join('<br>')}</p>`;
        });
    }
}
class ParagraphMultilineMarginStyleOutput extends ParseOutput {
    constructor(func) { super(func); }
    parse(text, regexp) {
        return text.replace(regexp, (match, text, br)=>{
            const lines = text.split(/\r\n|\r|\n/g);
            const content = (line.length < 2) ? text : lines.join('<br>');

            return `<p style="margin-block-end:${lineNum}em;">${content}</p>`;
        });
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
        //super.RegExps.push(new RegExp(/^([^\s]{1,}?)[\n]{2,}/gmu));
        super.RegExps.push(new RegExp(/^([\s\S]{1,}?)[\n]{2,}/gmu));
        super.RegExps.push(new RegExp(/^[^\n]{1,}[\n]{2,}([^\n)]{1,}?)[\n]{0,}$/gmu)); // 最終行
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

