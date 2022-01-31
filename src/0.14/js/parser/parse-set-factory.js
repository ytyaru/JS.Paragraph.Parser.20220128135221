class ParseSetFactory {
    static #Novel = [
        HeadingParseSetFactory.Named, 
        ParagraphParseSetFactory.Book, 
        RubyParseSetFactory.RootHtml, 
        EmParseSetFactory.Normal
    ];
    //static #Blog = [...];

    static get Novel() { return ParseSetFactory.#Novel; } 
    //static get Blog() { return ParseSetFactory.#Blog; } 
}
