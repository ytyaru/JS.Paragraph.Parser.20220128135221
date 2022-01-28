class Parser {
    constructor(...parseSets) {
        this._parseSets = parseSets.flat(999); // ネストした配列を平坦化する
    }
    parse(text) {
        let parsed = text;
        for (const parseSet of this._parseSets) {
            console.log(parseSet.parse)
            parsed = parseSet.parse(parsed);
        }
        return parsed;
    }
}
class ParseSet {
    constructor(input, output) { // RegExpセット, 出力メソッド
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
    parse(text, regexp) { return text.replace(regexp, (match, p1)=>{return this._func(match, p1);}) }
}
class ParseInput {
    constructor() {
        this._regexps = [];
    }
    get RegExps() { return this._regexps; }
}
