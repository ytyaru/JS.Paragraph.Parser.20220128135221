class ParagraphOutput extends ParseOutput {
    constructor(func) { super(func); }
    parse(text, regexp) {
        // textの先頭と末尾にある連続した空白文字を削除する
        text = text.replace(/^[\r\n|\r|\n]{1,}/, '');
        text = text.replace(/[\r\n|\r|\n]{1,}$/, '');
        console.debug(text)
        // 2つの改行単位で区切る
        const ps = text.split(/\r\n\r\n|\r\r|\n\n/g);
        console.debug(ps)
        let html = [];
        for (let p of ps) {
            const spans = p.split(/\r\n|\r|\n/g).filter(v => v); // 改行ごとに配列要素化し、空要素を削除する
            if (spans.length < 1) { continue; }
            html.push((spans.length < 2) ? `<p>${spans[0]}</p>` : `<p>${spans.map(span=>ElementString.get('span', span)).join('<br>')}</p>`);
        }
        return html.join('');
    }
}
class ParagraphMultilineOutput extends ParseOutput {
    constructor(func) { super(func); }
    TrimBlanks(lines) {// 先頭と末尾の空白要素を削除した新しい配列を返す。lines:Array<String>
        // 先頭から連続した空白要素を削除する
        let begin=0;
        if (0 < lines.length && '' === lines[0].trim()) {
            for (begin=0; begin<lines.length; begin++) {
                if ('' !== lines[begin].trim()) { if (0<begin) {begin--;} break; }
            }
        }
        // 末尾から連続した空白要素を削除する
        let end=lines.length-1;
        if (0 < lines.length && '' === lines.slice(-1)[0].trim()) {
            for (; 0<=end; end--) {
                if ('' !== lines[end].trim()) { end++; break; } // if(end<lines.length)
            }
        } else { end = lines.length; }
        console.debug(begin, end)
        return lines.slice(begin, Math.max(end, 1));
    }
    parseParagraph(content, brLen) { return ElementString.get('p', content) + '<br>'.repeat(brLen); }
    parse(text, regexp) {
        let lines = text.split(/\r\n|\r|\n/g);
        console.debug(lines)

        // 先頭と末尾の空白は削除する
        lines = this.TrimBlanks(lines)
        console.debug(lines)
        
        // パラグラフ化、br、マージン付与
        let ps = []
        for (let i=0; i<lines.length; i++) {
            console.debug(i, lines[i])
            if (0 < lines[i].trim().length) { // 非空白
                let content = lines[i];
                // 本行＝最終行
                if (i===lines.length-1) { ps.push({content:content, brLen:0}); break; }
                // +1行目＝空白
                if (''===lines[i+1].trim()) {
                    // +2行目＝空白（パラグラフ終わり。末尾行数カウント）
                    if ('' === lines[i+2].trim()) {
                        let b = i+1;
                        let brLen = 0;
                        while (b < lines.length && '' === lines[b].trim()) { brLen++; b++; i++; }
                        ps.push({content:content, brLen:brLen});
                    }
                    // +2行目＝非空白（本パラグラフ終端。次パラグラフ開始）
                    else { ps.push({content:content, brLen:0}); }
                }
                // +1行目＝非空白（br）。その後も非空白が連続した文だけ<br>が入る。
                else {
                    // 本パラグラフ内<br>
                    console.debug(content)
                    const begin = i;
                    let b = i+1;
                    let brLen = 0;
                    while (b < lines.length && '' !== lines[b].trim()) { brLen++; b++; i++; }
                    ps.push({content:lines.slice(begin, b).map(span=>ElementString.get('span', span)).join('<br>'), brLen:0});
                    console.debug(lines.slice(begin, b))
                }
            }
        }
        const psStrs = [];
        for (let p of ps) {
            psStrs.push(this.parseParagrapsh(p.content, p.brLen));
        }
        console.debug(psStrs.join(''))
        return psStrs.join('');
    }
}
class ParagraphMultilineBrOutput extends ParagraphMultilineOutput {
    constructor(func) { super(func); }
    parseParagrapsh(content, brLen) {
        return ElementString.get('p', content) + '<br>'.repeat(brLen);
    }
}
class ParagraphMultilineBlockEndStyleOutput extends ParagraphMultilineOutput {
    constructor(func) { super(func); }
    parseParagrapsh(content, brLen, cssPropNamePrefix) { // cssPropNamePrefix: margin, padding, border
        const attrStyleValue= (0 < brLen) ? '' : '';
        const attr = new Map();
        if (0 < brLen) { attr['style'] = `${cssPropNamePrefix}-block-end:${brLen}em`; }
        return ElementString.get('p', content, attr);
    }
}
class ParagraphMultilinePaddingBlockEndStyleOutput extends ParagraphMultilineBlockEndStyleOutput {
    constructor(func) { super(func); }
    parseParagrapsh(content, brLen) { return super.parseParagrapsh(content, brLen, 'padding'); }
}
class ParagraphMultilineMarginBlockEndStyleOutput extends ParagraphMultilineBlockEndStyleOutput {
    constructor(func) { super(func); }
    parseParagrapsh(content, brLen) { return super.parseParagrapsh(content, brLen, 'margin'); }
}
class ParagraphMultilineBorderBlockEndStyleOutput extends ParagraphMultilineBlockEndStyleOutput {
    constructor(func) { super(func); }
    parseParagrapsh(content, brLen) { return super.parseParagrapsh(content, brLen, 'border'); }
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
}
class ParagraphParseSetFactory {
    static #Book = new ParseSet(new ParagraphInput(), new ParagraphOutput());
    static #Poem = new ParseSet(new ParagraphInput(), new ParagraphMultilineMarginBlockEndStyleOutput());

    static get Book() { return ParagraphParseSetFactory.#Book; } 
    static get Poem() { return ParagraphParseSetFactory.#Poem; } 
}

