window.addEventListener('load', (event) => {
    console.log(ParagraphParseSetFactory)
    console.log(ParagraphParseSetFactory.Book)
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
//    document.body.innerHTML += `<p>${text}</p><p>${html}</p><hr>`
    document.body.innerHTML += `${html}<hr>`
});
