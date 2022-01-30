# 強調表示

　小説における傍点（圏点）。

中間形式
```
ここは＊慎重に＊行動すべきだ。
```
HTML
```html
<p>ここは<em>慎重に</em>行動すべきだ。</p>
```
CSS
```css
em {
    text-emphasis-style: filled; /* 横=●縦=﹅ */
}
```

　強調は主に以下のパターンがある。

CSS|概要
---|----
[text-emphasis-style][]|傍点（圏点）
[text-decoration][]|下線
[outline][]|囲み線
[border][]|境界線

[text-emphasis-style]:https://developer.mozilla.org/ja/docs/Web/CSS/text-emphasis-style
[text-decoration]:https://developer.mozilla.org/ja/docs/Web/CSS/text-decoration
[outline]:https://developer.mozilla.org/ja/docs/Web/CSS/outline
[border]:https://developer.mozilla.org/ja/docs/Web/CSS/border

　`<em>`要素のうちclass属性値で表現を使い分けるようにしてもよい。ただ、それだと複雑化してしまう。できるだけシンプルな中間書式にしたい。また、文庫本も装飾はほぼないシンプルなもの。よってその文書を通して`<em>`要素はただひとつの表現形式をとることにしたい。

## [text-emphasis-style][]

```
none | [ [ filled | open ] || [ dot | circle | double-circle | triangle | sesame ] ] | <string>
```


