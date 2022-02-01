# フロントマター

　フロントマターはメタデータである。メタデータを構造化し、定義できる書式をフロントマターと呼ぶ。とくにマークダウン形式におけるメタデータはフロントマターによって定義される。

## Google

　Googleはメタデータを利用して検索結果の表示に活かしている。schema.orgなど既存の仕様を、JSON-LDなどの書式で実装する。例は以下。

* https://developers.google.com/search/docs/advanced/structured-data/search-gallery

　この中でも企業ではなく一般人が使いやすそうなのは以下。

schema.org `@type`|概要
----------|----
`Article`|記事。アイキャッチ画像、見出し、公開日時を表示する。
`BreadcrumbList`|パンくずリスト。サイト内階層位置を示す。
`FAQPage`|よくある質問。質問と回答を文章やHTMLで表示する。
`Dataset`|CSVなどのデータを検索できる。
`HowTo`|手順。アイキャッチ画像、見出し。素材、道具、手順リストを表示する。
`ImageObject`|画像ライセンス。
`["MathSolver", "LearningResource"]`|数学の解法。
`Quiz`|練習問題。
`SearchAction`|サイト内検索ボックス。
`SoftwareApplication`|ソフトウェア。

　残念ながら趣味よりも経済活動が中心らしい。個人よりも企業向けの印象が強い。営利目的で利用する想定なのだろう。

## schema.org

　一覧は以下。やはりビジネス中心。

* https://schema.org/docs/full.html

　途中まで使えそうなのを抜粋したが多すぎて断念。

* https://schema.org/Person
    * https://schema.org/Occupation
* https://schema.org/CreativeWork
    * https://schema.org/Review
        * https://schema.org/Rating
    * https://schema.org/ClaimReview
* https://schema.org/AssessAction
    * https://schema.org/ReviewAction
* https://schema.org/InstallAction
* https://schema.org/ReadAction
* https://schema.org/UseAction
    * https://schema.org/ActionAccessSpecification
* https://schema.org/WriteAction
    * https://schema.org/Language
    * https://schema.org/ComputerLanguage

* https://schema.org/TechArticle
    * https://schema.org/APIReference
* https://schema.org/Code
* https://schema.org/HowToStep

* https://schema.org/WebPage
    * https://schema.org/AboutPage
    * https://schema.org/CollectionPage
        * https://schema.org/MediaGallery
            * https://schema.org/ImageGallery
            * https://schema.org/VideoGallery
    * https://schema.org/ContactPage
    * https://schema.org/FAQPage
    * https://schema.org/ItemPage
    * https://schema.org/MedicalWebPage
    * https://schema.org/ProfilePage
    * https://schema.org/QAPage
    * https://schema.org/RealEstateListing
    * https://schema.org/SearchResultsPage

# 小説のメタデータ

　ほしいものを検索してすぐ閲覧できるようにしたい。そのためのメタデータがほしい。けれど昔から曖昧すぎて分類すら難しい。

* タイトル（煽り文、あらすじ）
* 著者
* 字数
* 完結済み
* 最終更新日時（開始〜完了。作成、公開、更新）
* 対象読者
    * 年齢
    * 性別
    * ジャンル（曖昧。要素のうちメインのもの）
    * 属性
    * セルフレイティング（曖昧。性、暴力、残酷などの表現警告）
* 著者
    * 狙い（目標、目的）
    * 動機（背景）

# 構造

* 作品
    * meta
    * contents...

top
```
```

parts
```
title:表題
dates:
    2022-02-01T00:00:00
    2022-02-01T00:00:00
    2022-02-01T00:00:00
created:2022-02-01T00:00:00
published:2022-02-01T00:00:00
updated:2022-02-01T00:00:00
finished:false
chars:9999
```

# フロントマター

```
<!--
title:表題
dates:
    2022-02-01T00:00:00
    2022-02-01T00:00:00
    2022-02-01T00:00:00
created:2022-02-01T00:00:00
published:2022-02-01T00:00:00
updated:2022-02-01T00:00:00
-->
```
