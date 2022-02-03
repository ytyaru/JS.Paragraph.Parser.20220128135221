window.addEventListener('load', (event) => {
    function testParagraph() {
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
    }
    testParagraph();

    function testRuby() {
        // ｛｝→<ruby>
        let rh = new Parser(RubyParseSetFactory.RootHtml);
        text = 'ルート書式。ここから小説共通書式に変換し、HTMLに変換できる。私｛わたし｝は漢字｛かんじ｝をHTML｛ハイパー テキスト マークアップ ランゲージ｝に変換｛へんかん｝します。ＨＴＭＬ｛Hyper Text Markup Language｝。字種を問わずルビを振りたいなら縦線（パイプライン）を使う。次のように。｜おとぎ話｛フェアリーストーリー｝。';
        let html = rh.parse(text);
        console.log(text)
        console.log(html)
        document.body.innerHTML += `<p>${text}</p><p>${html}</p>`

        // ｛｝→｜《》
        const rn = new Parser(RubyParseSetFactory.RootNovel);
        let novel = rn.parse(text);
        console.log(novel)
        document.body.innerHTML += `<p>${novel}</p>`

        // ｜《》→<ruby>
        const nh = new Parser(RubyParseSetFactory.NovelHtml);
        html = nh.parse(novel);
        console.log(html)
        document.body.innerHTML += `<p>${html}</p><hr>`

        // 青空文庫→｜《》
        //parser = new Parser([RubyParseSetFactory.AozoraNovel]);
        parser = new Parser(RubyParseSetFactory.AozoraNovel);
        text = '青空文庫《あおぞらぶんこ》の書式。｜AOZORA《あおぞら》。'
        novel = parser.parse(text)
        html = nh.parse(novel)
        document.body.innerHTML += `<p>${text}</p><p>${novel}</p><p>${html}</p><hr>`
        // 青空文庫→HTML
        let aoh = new Parser(RubyParseSetFactory.AozoraHtml);
        html = aoh.parse(text);
        document.body.innerHTML += `<p>${text}</p><p>${html}</p><hr>`

        // カクヨム→｜《》
        parser = new Parser(RubyParseSetFactory.KakuyomuNovel);
        text = 'カクヨム《かくよむ》の書式。青空文庫と同じ。｜KAKU-YOMU《カクヨム》。書読《かくよむ》。｜カクヨム《かくよむ》。'
        novel = parser.parse(text)
        html = nh.parse(novel)
        document.body.innerHTML += `<p>${text}</p><p>${novel}</p><p>${html}</p><hr>`
        // カクヨム→HTML
        let kh = new Parser(RubyParseSetFactory.KakuyomuHtml);
        html = kh.parse(text);
        document.body.innerHTML += `<p>${text}</p><p>${html}</p><hr>`

        // 小説家になろう→｜《》
        parser = new Parser(RubyParseSetFactory.NarouNovel);
        text = '小説家になろうの書式。山田（やまだ）。｜おとぎ話《フェアリーストーリー》。'
        novel = parser.parse(text)
        html = nh.parse(novel)
        document.body.innerHTML += `<p>${text}</p><p>${novel}</p><p>${html}</p><hr>`
        // 小説家になろう→HTML
        console.log(RubyParseSetFactory.NarouHtml)
        let nah = new Parser(RubyParseSetFactory.NarouHtml);
        html = nah.parse(text);
        document.body.innerHTML += `<p>${text}</p><p>${html}</p><hr>`

        // ハーメルン→｜《》
        parser = new Parser(RubyParseSetFactory.HamelnNovel);
        text = 'ハーメルンの書式。|山田《やまだ》。|おとぎ話《フェアリーストーリー》。'
        novel = parser.parse(text)
        html = nh.parse(novel)
        document.body.innerHTML += `<p>${text}</p><p>${novel}</p><p>${html}</p><hr>`
        // ハーメルン→HTML
        let hh = new Parser(RubyParseSetFactory.HamelnHtml);
        html = nh.parse(text);
        document.body.innerHTML += `<p>${text}</p><p>${html}</p><hr>`

        // アルファポリス→｜《》
        parser = new Parser(RubyParseSetFactory.AlphaPoliceNovel);
        text = 'アルファポリスの書式。#宇宙__そら__#が光って。'
        novel = parser.parse(text)
        html = nh.parse(novel)
        document.body.innerHTML += `<p>${text}</p><p>${novel}</p><p>${html}</p><hr>`
        // ｜《》→アルファポリス→HTML
        parser = new Parser(RubyParseSetFactory.NovelAlphaPolice);
        text = parser.parse(novel)
        const ah = new Parser(RubyParseSetFactory.AlphaPoliceHtml);
        html = ah.parse(text)
        document.body.innerHTML += `<p>${text}</p><p>${html}</p><hr>`

        // でんでんマークダウン→｜《》
        let dn = new Parser(RubyParseSetFactory.DendenNovel);
        let denden = 'でんでんマークダウン→小説形式→HTMLに変換する。{漢字|かんじ}。{漢字|かん|じ}。'
        novel = dn.parse(denden)
        html = nh.parse(novel)
        document.body.innerHTML += `<p>${denden}</p><p>${novel}</p><p>${html}</p><hr>`
        // ｜《》→でんでんマークダウン→HTML
        parser = new Parser(RubyParseSetFactory.NovelDenden);
        novel = '小説形式→でんでんマークダウン形式→HTMLに変換する。｜山田《やまだ》。｜山《やま》｜田《だ》。｜おとぎ話《フェアリーストーリー》。'
        denden = parser.parse(novel)
        let dh = new Parser(RubyParseSetFactory.DendenHtml);
        html = dh.parse(denden)
        document.body.innerHTML += `<p>${novel}</p><p>${denden}</p><p>${html}</p><hr>`

        // でんでん→HTML
        text = 'でんでん→HTML。{漢字|かん|じ}。{漢字|かんじ}。'
        html = dh.parse(text)
        document.body.innerHTML += `<p>${text}</p><p>${html}</p><hr>`
    }
    testRuby();

    function testEm() {
        let parser = new Parser(EmParseSetFactory.Normal);
        let text = '中間書式にて＊ここを強調＊します。＊＊二重＊＊にしたらどうなる？'
        let html = parser.parse(text)
        document.body.innerHTML += `<p>${text}</p><p>${html}</p><hr>`
    }
    testEm();

    function testHeading() {
        let parser = new Parser(HeadingParseSetFactory.Simple);
        let text = `# これは見出し1です
## これも見出し2です

### これも見出し3です

#### これも見出し4です

##### これも見出し5です

###### これも見出し6です

####### これは見出しになりません。レベル６までです

＃これは見出し1です

＃＃これも見出し2です

＃＃＃これも見出し3です

＃＃＃＃これも見出し4です

＃＃＃＃＃これも見出し5です

＃＃＃＃＃＃これも見出し6です

＃＃＃＃＃＃＃これは見出しになりません。レベル６までです

# 名前重複1

# 名前重複1

# 名前重複1

# 名前重複1

# 名前重複1

＃名前重複１

＃名前重複１

＃名前重複１

＃名前重複１

＃名前重複１

＃名前重複１

`;
        let html = parser.parse(text)
        document.body.innerHTML += `<p>${text}</p>${html}<hr>`

        console.log(HeadingParseSetFactory.Numbered)
        parser = new Parser(HeadingParseSetFactory.Numbered);
        html = parser.parse(text);
        document.body.innerHTML += `${html}<hr>`

        parser = new Parser(HeadingParseSetFactory.Named);
        html = parser.parse(text);
        document.body.innerHTML += `${html}<hr>`
    }
    testHeading();

    function testToWide() {
        console.assert(RegExpChars.toWide('0') === '０');
        console.assert(RegExpChars.toWide('9') === '９');
        console.assert(RegExpChars.toWide('A') === 'Ａ');
        console.assert(RegExpChars.toWide('Z') === 'Ｚ');
        console.assert(RegExpChars.toWide('a') === 'ａ');
        console.assert(RegExpChars.toWide('z') === 'ｚ');
        console.assert(RegExpChars.toWide('０') === '０');
        console.assert(RegExpChars.toWide('９') === '９');
        console.assert(RegExpChars.toWide('Ａ') === 'Ａ');
        console.assert(RegExpChars.toWide('Ｚ') === 'Ｚ');
        console.assert(RegExpChars.toWide('ａ') === 'ａ');
        console.assert(RegExpChars.toWide('ｚ') === 'ｚ');
    }
    testToWide();
    function testToHalf() {
        console.assert(RegExpChars.toHalf('０') === '0');
        console.assert(RegExpChars.toHalf('９') === '9');
        console.assert(RegExpChars.toHalf('Ａ') === 'A');
        console.assert(RegExpChars.toHalf('Ｚ') === 'Z');
        console.assert(RegExpChars.toHalf('ａ') === 'a');
        console.assert(RegExpChars.toHalf('ｚ') === 'z');
        console.assert(RegExpChars.toHalf('0') === '0');
        console.assert(RegExpChars.toHalf('9') === '9');
        console.assert(RegExpChars.toHalf('A') === 'A');
        console.assert(RegExpChars.toHalf('Z') === 'Z');
        console.assert(RegExpChars.toHalf('a') === 'a');
        console.assert(RegExpChars.toHalf('z') === 'z');
    }
    testToHalf();

    function testSpanUpRight() {
        let parser = new Parser(SpanUpRightParseSetFactory.Half4);
        let text = '2022年12月31日。123年1月1日。1234567890円也。\n２０２２年１２月３１日。１２３年１月１日。１２３４５６７８９０円也。π＝３．１４。+π+＝３．１４。＋π＋＝３．１４。A。Ａ。AB。ＡＢ。ABC。ＡＢＣ。HTML。ＨＴＭＬ。ABCDEFG。ＡＢＣＤＥＦＧ。「! ！ ? ？ !?！？1!２！……――、。＄％＆〜：＜＞」\n！。！！。！！！。！！！！。？。？？。？？？。？？？？。！？。！？！？。！？！？！？。!。!!。!!!。?。??。???。!?。!?!?。!?!?!?。'
        let html = parser.parse(text)
        document.body.innerHTML += `<h1>縦中横テスト</h1><p>${text}</p><hr>`;
        document.body.innerHTML += `<h3>Half4</h3><div style="writing-mode:vertical-rl">${html}</div><hr>`

        parser = new Parser(SpanUpRightParseSetFactory.Half2);
        html = parser.parse(text)
        document.body.innerHTML += `<h3>Half2</h3><div style="writing-mode:vertical-rl">${html}</div><hr>`

        parser = new Parser(SpanUpRightParseSetFactory.Wide4);
        html = parser.parse(text)
        document.body.innerHTML += `<h3>Wide4</h3><div style="writing-mode:vertical-rl">${html}</div><hr>`

        parser = new Parser(SpanUpRightParseSetFactory.Wide2);
        html = parser.parse(text)
        document.body.innerHTML += `<h3>Wide2</h3><div style="writing-mode:vertical-rl">${html}</div><hr>`

        parser = new Parser(SpanUpRightParseSetFactory.As4);
        html = parser.parse(text)
        document.body.innerHTML += `<h3>As4</h3><div style="writing-mode:vertical-rl">${html}</div><hr>`

        parser = new Parser(SpanUpRightParseSetFactory.As2);
        html = parser.parse(text)
        document.body.innerHTML += `<h3>As2</h3><div style="writing-mode:vertical-rl">${html}</div><hr>`
    }
    testSpanUpRight();

    function test1() {
        let parser = new Parser();
        let text = `
        

＃総合｛そうごう｝｜＊試験＊｛テスト｝

　中間書式｛ちゅうかんしょしき｝の｜総合テスト｛トータル試験｝です。

## 試験｛＊しけん＊｝

　＊ここを強調＊します。＊｜送り仮名｛ルビ｝＊と一緒に使用したらどうなるか。｜＊試験＊｛テスト｝してみます。｜試験｛＊テスト＊｝してみます。結果は次の通りです。

　１．ルビ書式をまるごと強調書式で囲う＝ルビのみ
　２．ルビ書式のうちベース文字を強調書式で囲う＝ルビのみ
　３．ルビ書式のうちルビ文字を強調書式で囲う＝ルビの上に傍点がついた

　２の挙動は＊予想外＊でした。期待値はルビの上にベース文字数分だけ強調マークがつくと思っていたのですが……。ブラウザによって挙動が変わるかもしれません。詳細は未調査。


`;
        let html = parser.parse(text)
        document.body.innerHTML += `<p>${text}</p>${html}<hr>`
        
        text = '2022年12月31日。+2022+年+12+月+31+日。｜+2022+｛令和４｝年+12+月+31+日。｜+2022+｛＊令和４＊｝年+12+月+31+日。２０２２年１２月３１日。\nπ+π+｜+π+｛パイ｝。｜+π+｛＊パイ＊｝\nA。AB。ABC。ABCD。ABCDE。ABCDEFG。Ａ。ＡＢ。ＡＢＣ。ＡＢＣＤ。ＡＢＣＤＥ。ＡＢＣＤＥＦＧ。\n　１．選択肢１\n　２．選択肢２\n　３．選択肢３\nエクスクラメーション！エクスクラメーション！！エクスクラメーション！！！\nクエスチョン？クエスチョン？？クエスチョン？？？'
        html = parser.parse(text)
        document.body.innerHTML += `<h3>縦中横＋ルビ＋強調</h3><p>${text}</p><div style="writing-mode:vertical-rl">${html}</div>`
        document.body.innerHTML += `<h4>現状の動作</h4><ul><li>縦中横はルビや強調と併用できない\n<li>自動縦中横の対象なのに手動で縦中横にしようとしたらバグる\n</ul></p><hr>`
    }
    test1();
});
