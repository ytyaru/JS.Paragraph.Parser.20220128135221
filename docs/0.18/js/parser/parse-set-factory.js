class ParseSetFactory {
    static #Novel = [
        SpanUpRightParseSetFactory.Half4, // HTMLタグにヒットしてしまうので最初にやる。縦中横にはルビも傍点も振れない
        HeadingParseSetFactory.Named, 
        ParagraphParseSetFactory.Book, 
        RubyParseSetFactory.RootHtml, 
        EmParseSetFactory.Normal,
        //SpanUpRightParseSetFactory.Mark4,
    ];
    static #Poem = [
        HeadingParseSetFactory.Named, 
        ParagraphParseSetFactory.PoemMargin, 
        RubyParseSetFactory.RootHtml, 
        EmParseSetFactory.Normal,
        //SpanUpRightParseSetFactory.Half4, 
    ];
    //static #Blog = [...];

    static get Novel() { return ParseSetFactory.#Novel; } 
    static get Poem() { return ParseSetFactory.#Poem; } 
    //static get Blog() { return ParseSetFactory.#Blog; } 
}
