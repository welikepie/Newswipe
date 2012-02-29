function ArticleView() {

    Titanium.API.debug("Instantiating the ArticleView...");

    var self = Titanium.UI.createWebView();
    self.setArticle = function(article) {
        
        Titanium.API.debug("setArticle called with: " + article.toString());
        
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
        
        this.setHtml(test);
    };
    
    return self;

}

module.exports = ArticleView;
//if (typeof exports === 'object' && exports) { exports = ArticleView; }
