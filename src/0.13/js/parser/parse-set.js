class ParseSet { // パース手続きのセット
    constructor(output) { // 出力メソッド
        this._output = output; // ParseOutput型
    }
    parse(text) { return this._output.parse(text); }
    clear() { this._output.clear(); }
}
class RegExpParseSet extends ParseSet {
    constructor(input, output) { // RegExpセット, 出力メソッド
        super(output);
        this._input = input;   // ParseInput型
        this._output = output; // ParseOutput型
    }
    parse(text) {
        let parsed = text;
        for (const regexp of this._input.RegExps) {
            parsed = this._output.parse(parsed, regexp)
        }
        return parsed;
    }
    clear() { super.clear(); }
}
class ParseOutput {
    constructor(func) { this._func = func; }
    parse(text) { return this._func(text); }
    clear() {}
}
class RegExpParseOutput extends ParseOutput {
    constructor(func) { super(func); }
    parse(text, regexp) { return text.replace(regexp, (match, p1)=>{return super.parse(p1);}) }
    clear() { super.clear(); }
}
class ParseInput {}
class RegExpParseInput extends ParseInput {
    constructor() { super(); this._regexps = []; }
    get RegExps() { return this._regexps; }
}
