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

――そのとき、神風が吹いた

「僕らはみんな生きている♪　生きているから書くんだ♪」

　上記のようにダッシュや鉤括弧ではじまるときは字下げすべきでない。字下げについては全角スペースを入れるか否かで制御する。自動化したいならlintツールを用いる。いずれにせよ本パーサでは対象外。
`;
    let html = parser.parse(text)
    document.body.innerHTML += `${html}<hr>`

    // Poem
    parser = new Parser(ParagraphParseSetFactory.Poem);
    text = `
これは複数行をマージンで表現する。


文末から２つでパラグラフになり、それ以降はマージンになる。



こんな感じにね。

　文頭にスペースを入れたら字下げできる。

文末に改行が１行だけあれば同じパラグラフの中でbrが入る。
こんな感じで。
それを複数行できる。
何行でも。
ただし２行以上改行があったり文字列の終端ならそこでパラグラフ終了。

以上。
`;
    html = parser.parse(text)
    document.body.innerHTML += `${html}<hr>`

});
