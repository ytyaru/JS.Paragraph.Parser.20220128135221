class ParagraphOutput extends ParseOutput {
    constructor(func) { super(func); }
    parse(text, regexp) {
        // textの先頭と末尾にある連続した空白文字を削除する
        text = text.replace(/^[\r\n|\r|\n]{1,}/, '');
        text = text.replace(/[\r\n|\r|\n]{1,}$/, '');
        console.log(text)
        // textの中間にある2個以上連続した空白文字列を2個にする
        text = text.replace(/([\r\n|\r|\n]{2,}?)/g, '\n\n');
        console.log(text)
        /*
        text = text.replace(/([\r\n|\r|\n]{2,}?)/, (match, br)=> {
            return     
        });
        */

        const ps = text.split(/\r\n\r\n|\r\r|\n\n/g);
        console.log(ps)
        let html = [];
        for (let p of ps) {
            const spans = p.split(/\r\n|\r|\n/g).filter(v => v); // 改行ごとに配列要素化し、空要素を削除する
            console.log(spans)
            if (spans.length < 1) { continue; }
            html.push((spans.length < 2) ? `<p>${spans[0]}</p>` : `<p>${spans.map(span=>ElementString.get('span', span)).join('<br>')}</p>`);
        }
        return html.join('');
    }
}
class ParagraphMultilineMarginStyleOutput extends ParseOutput {
    constructor(func) { super(func); }
    #trim(lines) { // 先頭と末尾の空白要素を削除した新しい配列を返す。line:Array<String>
        // 先頭から連続した空白要素を削除する
        let begin=0;
        if (0 < lines.length && '' === lines[0].trim()) {
            for (begin=0; begin<lines.length; begin++) {
                if ('' !== lines[begin].trim()) { if (0<begin) {begin--;} break; }
            }
        }
        // 末尾から連続した空白要素を削除する
        let end=lines.length-1;
        /*
        console.log(lines)
        console.log(lines[-1])
        console.log(lines.slice(-1))
        console.log(lines.slice(-1)[0]) // pythonならlines[-1]で取得できるのに…
        console.log(lines.slice(-1)[0].trim())
        */
        if (0 < lines.length && '' === lines.slice(-1)[0].trim()) {
            for (; 0<=end; end--) {
//                console.log(end, lines[end])
                if ('' !== lines[end].trim()) { end++; break; } // if(end<lines.length)
                //if ('' !== lines[end].trim()) { end++; break; } // if(end<lines.length)
            }
        } else { end = lines.length; }
        console.log(begin, end)
//        return lines.slice(begin, end);
        return lines.slice(begin, Math.max(end, 1));
    }
    parse(text, regexp) {
        let lines = text.split(/\r\n|\r|\n/g);
        console.log(lines)

        // 先頭と末尾の空白は削除する
        lines = this.#trim(lines)
        console.log(lines)
        
        // パラグラフ化、br、マージン付与
        let ps = []
        for (let i=0; i<lines.length; i++) {
            console.log(i, lines[i])
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
                    console.log(content)
                    const begin = i;
                    let b = i+1;
                    let brLen = 0;
                    while (b < lines.length && '' !== lines[b].trim()) { brLen++; b++; i++; }
                    //ps.push({content:lines.slice(i, b).join('<br>'), brLen:0});
                    ps.push({content:lines.slice(begin, b).map(span=>ElementString.get('span', span)).join('<br>'), brLen:0});
                    console.log(lines.slice(begin, b))
                }
            }
        }
        const psStrs = [];
        for (let p of ps) {
            const attrStyleValue= (0 < p.brLen) ? '' : '';
            const attr = new Map();
            if (0 < p.brLen) { attr['style'] = `margin-block-end:${p.brLen}em`; }
            psStrs.push(ElementString.get('p', p.content, attr));
        }
        console.log(psStrs.join(''))
        return psStrs.join('');
    }
    /*
    parse(text, regexp) {
        return text.replace(regexp, (match, text, br)=>{
            console.log(`text=${text}, br=${br}`)
            // content
            const lines = text.split(/\r\n|\r|\n/g);
            console.log(lines)
            const content = (lines.length < 2) ? text : lines.join('<br>');
            // brLen
            const nl = br.match(/\r|\n/g)
            const brLen = (nl) ? nl.length - 2 : 0;
            console.log(nl, `brLen=${brLen}`)
            const attr = (0 < brLen) ? ` style="margin-block-end:${brLen}em;"` : '';
            return `<p${attr}>${content}</p>`;
        });
    }
    */
    /*
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
    */
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
        //super.RegExps.push(new RegExp(/^(^([^\n]){1,}?)[\n]{2}([\n]{0,}?)/gmu));
        //super.RegExps.push(new RegExp(/^([\s\S]{1,}?)([\n]{2,}?)/gmu));
        //super.RegExps.push(new RegExp(/^([^\n]{1,}?)([\n]{2,}?)/gmu));
        //super.RegExps.push(new RegExp(/^([\s\S]{1,}?)([\n]{2,}?)/gmu));
        //super.RegExps.push(new RegExp(/^([^\n]{1,}[^\n]{1,}?)([\n]{2,}?)/gmu));
        super.RegExps.push(new RegExp(/[\s\S]*/mu));
    }
    //static #REGEX_PARAGRAPH = /^([\u{3000}])(.+)[\n]{2}/gmu;
}
class ParagraphParseSetFactory {
    static #Book = new ParseSet(new ParagraphInput(), new ParagraphOutput());
    static #Poem = new ParseSet(new ParagraphMultilineInput(), new ParagraphMultilineMarginStyleOutput());

    static get Book() { return ParagraphParseSetFactory.#Book; } 
    static get Poem() { return ParagraphParseSetFactory.#Poem; } 
}

