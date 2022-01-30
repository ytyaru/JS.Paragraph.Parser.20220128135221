class Parser {
    constructor(...parseSets) {
        this._parseSets = ((0 === parseSets.length) ? ParseSetFactory.Novel : parseSets).flat(999);
        console.log(this._parseSets)
    }
    parse(text) {
        let parsed = text;
        for (const parseSet of this._parseSets) {
            parsed = parseSet.parse(parsed);
        }
        return parsed;
    }
}

