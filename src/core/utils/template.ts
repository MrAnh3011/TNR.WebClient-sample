
class UrlComponent {
    public static urlArray = "<h1>{{pageTitle}}</h1>";
    public static setUrl = (html)=>{
        UrlComponent.urlArray = html
    }
}
export { UrlComponent }