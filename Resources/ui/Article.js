function Article() {

    Titanium.API.debug("Instantiating the Article...");

    this.view = Titanium.UI.createWebView();
    this.setArticle = function(article) {
        
        Titanium.API.debug("setArticle called with: " + article);
        
        var template =
            '<html>' +
                '<head>' +
                    '<title>%s</title>' +
                    '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' +
                '</head>' +
                '<body>%s</body>' +
            '</html>';
        
        var test = String.format(template, article.title, article.content);
        Titanium.API.debug("HTML generated: " + test);
        
        this.view.setHtml(test);
    };

}

module.exports = Article;
//if (typeof exports === 'object' && exports) { exports = ArticleView; }
