# パラグラフ解析

　パラグラフに限らないが、他の要素と併用したらグチャグチャになってしまう。最初は各要素の正規表現をかければいいと思っていたが、かけてほしくないところにかかってしまったりすることが発覚した。そろそろちゃんと実装しないとダメっぽい。

　案としては、既存のMarkdownパーサにruby, em, uprightなどを追加する案だ。以下Marked.jsを推す。

* https://github.com/markedjs/marked/

　本当はMarkdown.wasmがいいのだが、C言語で実装されており修正難易度が高いため後回し。どうせならrust言語で書きたい。

* https://github.com/rsms/markdown-wasm

　Marked.jsの改造については以下が参考になる。

* https://qiita.com/majirou/items/8b11b7ba710dc1fd59f4
* https://zenn.dev/mfreeman59/scraps/f442195eba0be5

## Marked.js コードリーディング

　修正するために、まずはコードを読む。

### ソースコードファイル一覧

* rules.js
* marked.js
* helpers.js
* defaults.js
* Tokenizer.js
* TextRenderer.js
* Slugger.js
* Renderer.js
* Parser.js
* Lexer.js

### 呼び出し順

* https://marked.js.org/

index.html
```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script>
document.getElementById('content').innerHTML =
  marked.parse('# Marked in browser\n\nRendered by **marked**.');
</script>
```

1. marked.js
1. Lexer.js
1. Tokenizer.js
1. Renderer.js
1. Parser.js
1. 
1. 
1. 


### rule.js

　HTML要素を以下２つに大別している。

* inline
* block

　それらをさらに以下で分けている。Markdownの亜種だろう。

* normal
* gfm
* pedantic

　上記の下に各HTML要素に対応した正規表現が実装されている。かなり複雑。

　まずは追加したい要素を網羅し、それをblock, inlineに分類してみる。

* 日本語小説
    * ruby
    * 傍点（em text-emphasis-style）
    * 縦中横（span text-combine-upright）
* 技術系ブログ
    * kbd
    * textile-table
    * 外部ソースコードファイル取得して`<pre><code>`ハイライト＋クリップボードコピー

```javascript
inline.novel.ruby
inline.novel.em
inline.novel.upright
inline.tecBlog.kbd
block.tecBlog.textileTable
block.tecBlog.preCode
```

```javascript
inline.novel = merge({}, inline.normal, { // 日本語小説
    ruby: /\|([^\\n]{1,20})\{([^\\n\|\{\}]{1,50})\}/,
    upright: /\+([^\\n\+]{1,4}?)+/,
    em: {
        start: /^_|\*/,
        middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
        endAst: /\*(?!\*)/g,
        endUnd: /_(?!_)/g
    },
});
/*
inline.tecBlog.kbd
block.tecBlog.textileTable
block.tecBlog.preCode
*/
```

```javascript
```

```javascript
```

```javascript
```

```javascript
```

```javascript
```

```javascript
```

```javascript
```

```javascript
```

```javascript
```

```javascript
```

```javascript
```

```javascript
```

```javascript
```

```javascript
```

