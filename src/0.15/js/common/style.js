class Style {
    constructor(id) {
        this._id = id;
        this._addStyleElement()
    }
    get Id() { return this._id; }
    add(css) {
        const style = document.getElementById(this._id);
        if (!style.innerText.includes(css)) {
            style.appendChild(document.createTextNode(css));
        }
    }
    _addStyleElement() {
        let style = document.getElementById(this._id);
        if (!style) {
            const head = document.getElementsByTagName('head').item(0);
            style = document.createElement('style');
            style.setAttribute('id', this._id)
            style.media = 'screen';
            style.type = 'text/css';
            head.appendChild(style);
        }
    }
}
