class ParseSetFactory {
    static #Novel = [ParagraphParseSetFactory.Book, RubyParseSetFactory.RootHtml, EmParseSetFactory.Normal];
    //static #Blog = [...];

    static get Novel() { return ParseSetFactory.#Novel; } 
    //static get Blog() { return ParseSetFactory.#Blog; } 
}
