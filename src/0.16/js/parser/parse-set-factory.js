class ParseSetFactory {
    static #Novel = [
        HeadingParseSetFactory.Named, 
        ParagraphParseSetFactory.Book, 
        RubyParseSetFactory.RootHtml, 
        EmParseSetFactory.Normal,
        SpanUpRightParseSetFactory.Wide4, 
    ];
    static #Poem = [
        HeadingParseSetFactory.Named, 
        ParagraphParseSetFactory.PoemMargin, 
        RubyParseSetFactory.RootHtml, 
        EmParseSetFactory.Normal,
        SpanUpRightParseSetFactory.Wide4, 
    ];
    //static #Blog = [...];

    static get Novel() { return ParseSetFactory.#Novel; } 
    static get Poem() { return ParseSetFactory.#Poem; } 
    //static get Blog() { return ParseSetFactory.#Blog; } 
}
