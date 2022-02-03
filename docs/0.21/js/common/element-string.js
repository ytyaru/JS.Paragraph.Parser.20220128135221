class ElementString {
    static get(tag, content, attrs=null) { // tag:String, content:String, attrs:Hash
        const attrStr = (attrs) ? ' ' + Object.keys(attrs).map(key=>`${key}="${attrs[key]}"`).join(' ') : '';
        return `<${tag}${attrStr}>${content}</${tag}>`;
    }
}

