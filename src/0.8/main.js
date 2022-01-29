window.addEventListener('load', (event) => {
    console.log(ParagraphParseSetFactory)
    console.log(ParagraphParseSetFactory.Book)
    // Book
    let parser = new Parser(ParagraphParseSetFactory.Book);
    let text = `
　パラグラフ１。下の行に２つの改行があるときパラグラフになる。改行箇所に空白文字が含まれていても無視する。HTMLに変換するとき、その空白文字は削除される。

　パラグラフ２。最終行のときは下に改行がなくともパラグラフになる。複数行表現がOFFなら末尾の改行は無視される。


　パラグラフ３。仮に３行以上の改行があっても、複数行表現がOFFなら無視される。

　パラグラフ４。パラグラフ内に１行だけ改行があり、直後に１字以上の空白文字以外の字があればbrタグに変換する。
　たとえばこのように。
　何行でもイケる。
べつに字下げしなくてもいい。
　いわゆる段落。

――そのとき、神風が吹いた

「僕らはみんな生きている♪　生きているから書くんだ♪」

　上記のようにダッシュや鉤括弧ではじまるときは字下げすべきでない。字下げについては全角スペースを入れるか否かで制御する。自動化したいならlintツールを用いる。いずれにせよ本パーサでは対象外。
`;
    let html = parser.parse(text)
    document.body.innerHTML += `${html}<hr>`
    document.body.innerHTML += `${parser.parse('改行が一切ない。')}<hr>`
    document.body.innerHTML += `${parser.parse('改行がひとつ。\nパラグラフなし。')}<hr>`
    document.body.innerHTML += `${parser.parse('改行がふたつ。\nパラグラフなし。\n以上。')}<hr>`
    document.body.innerHTML += `${parser.parse('\n\n\n先頭と末尾に改行3つ。\n\n\n')}<hr>`
    document.body.innerHTML += `${parser.parse('\n\n先頭と末尾と中間に改行2つ。\n\n以上。\n\n')}<hr>`
    document.body.innerHTML += `${parser.parse('\n\n\n先頭と末尾と中間に改行3つ。\n\n\n以上。\n\n\n')}<hr>`
    document.body.innerHTML += `${parser.parse('\n\n\n\n先頭と末尾と中間に改行4つ。\n\n\n\n以上。\n\n\n\n')}<hr>`
    document.body.innerHTML += `${parser.parse('\n\n\n\n\n先頭と末尾と中間に改行5つ。\n\n\n\n\n以上。\n\n\n\n\n')}<hr>`
    document.body.innerHTML += `${parser.parse('\n\n\n\n\n\n先頭と末尾と中間に改行6つ。\n\n\n\n\n\n以上。\n\n\n\n\n\n')}<hr>`

    // Poem
    parser = new Parser(ParagraphParseSetFactory.PoemMargin );
//    parser = new Parser(ParagraphParseSetFactory.PoemBorder);
//    parser = new Parser(ParagraphParseSetFactory.PoemPadding);
    parser = new Parser(ParagraphParseSetFactory.PoemMarginClass);
//    parser = new Parser(ParagraphParseSetFactory.PoemBorderClass);
//    parser = new Parser(ParagraphParseSetFactory.PoemPaddingClass);
    text = `
これは複数行をマージンで表現する。


文末から２つでパラグラフになり、それ以降はマージンになる。



こんな感じにね。

　文頭にスペースを入れたら字下げできる。

文末に改行が１行だけあれば同じパラグラフの中でbrが入る。
こんな感じで。
それを複数行できる。
　べつに字下げしてもいい。
２行以上改行があったり文字列の終端ならそこでパラグラフ終了。

以上。
`;
    html = parser.parse(text)
    document.body.innerHTML += `${html}<hr>`
    document.body.innerHTML += `${parser.parse('改行が一切ない。')}<hr>`
    document.body.innerHTML += `${parser.parse('改行がひとつ。\nパラグラフなし。')}<hr>`
    document.body.innerHTML += `${parser.parse('改行がふたつ。\nパラグラフなし。\n以上。')}<hr>`
    document.body.innerHTML += `${parser.parse('\n\n\n先頭と末尾に改行3つ。\n\n\n')}<hr>`
    document.body.innerHTML += `${parser.parse('\n\n先頭と末尾と中間に改行2つ。\n\n以上。\n\n')}<hr>`
    document.body.innerHTML += `${parser.parse('\n\n\n先頭と末尾と中間に改行3つ。\n\n\n以上。\n\n\n')}<hr>`
    document.body.innerHTML += `${parser.parse('\n\n\n\n先頭と末尾と中間に改行4つ。\n\n\n\n以上。\n\n\n\n')}<hr>`
    document.body.innerHTML += `${parser.parse('\n\n\n\n\n先頭と末尾と中間に改行5つ。\n\n\n\n\n以上。\n\n\n\n\n')}<hr>`
    document.body.innerHTML += `${parser.parse('\n\n\n\n\n\n先頭と末尾と中間に改行6つ。\n\n\n\n\n\n以上。\n\n\n\n\n\n')}<hr>`

});
