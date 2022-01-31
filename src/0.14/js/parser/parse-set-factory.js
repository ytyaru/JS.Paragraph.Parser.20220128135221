class ParseSetFactory {
    static #Novel = [
        HeadingParseSetFactory.Normal, 
        ParagraphParseSetFactory.Book, 
        RubyParseSetFactory.RootHtml, 
        EmParseSetFactory.Normal
    ];
    //static #Blog = [...];

    static get Novel() { return ParseSetFactory.#Novel; } 
    //static get Blog() { return ParseSetFactory.#Blog; } 
}
