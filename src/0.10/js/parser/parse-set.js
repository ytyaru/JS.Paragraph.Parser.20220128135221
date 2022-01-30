class ParseSet { // パース手続きのセット
    constructor(output) { // 出力メソッド
        this._output = output; // ParseOutput型
    }
    parse(text) { return this._output.parse(text); }
}
class RegExpParseSet extends ParseSet {
    constructor(input, output) { // RegExpセット, 出力メソッド
        super(output);
        this._input = input;   // ParseInput型
        this._output = output; // ParseOutput型
    }
    parse(text) {
        let parsed = text;
        console.log(this._input.RegExps)
        for (const regexp of this._input.RegExps) {
            parsed = this._output.parse(parsed, regexp)
        }
        return parsed;
    }
}
class ParseOutput {
    constructor(func) { this._func = func; }
    parse(text) { return this._func(text); }
}
class RegExpParseOutput extends ParseOutput {
    constructor(func) { super(func); }
    parse(text, regexp) { return text.replace(regexp, (match, p1)=>{return super.parse(p1);}) }
//    parse(text, regexp) { return text.replace(regexp, (match, p1)=>{return this._func(p1);}) }
//    parse(text, regexp) { return text.replace(regexp, (match, p1)=>{return super._func(p1);}) }
    //parse(text, regexp) { return text.replace(regexp, (match, p1)=>{return super._func(match, p1);}) }
}
class ParseInput {}
class RegExpParseInput extends ParseInput {
    constructor() { super(); this._regexps = []; }
    get RegExps() { return this._regexps; }
}
