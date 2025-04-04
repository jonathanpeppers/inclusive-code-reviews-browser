class Icon {
    constructor(t, e, i, s) {
        (this._className = t), (this._label = e), (this._parentElement = s), (this._toolTip = i), (this._document = s.ownerDocument), this._render();
    }
    _render() {
        if (
            ((this._element = this._document.createElement("lt-div")),
            this._element.classList.add("lt-icon", "lt-icon--clickable", "lt-icon--" + this._className),
            this._element.setAttribute("data-lt-prevent-focus", ""),
            this._parentElement.appendChild(this._element),
            (this._icon = this._document.createElement("lt-span")),
            this._icon.classList.add("lt-icon__icon", "lt-icon__icon--" + this._className),
            this._element.appendChild(this._icon),
            this._toolTip)
        ) {
            const t = this._document.createElement("lt-div");
            t.classList.add("lt-icon__tooltip", "lt-icon__tooltip--" + this._toolTip.position, "lt-icon__tooltip--" + this._className), (t.textContent = this._toolTip.label), this._element.appendChild(t);
        }
        if (this._label) {
            const t = this._document.createElement("lt-span");
            t.classList.add("lt-icon__label"), (t.textContent = this._label), this._element.appendChild(t);
        }
    }
    setIcon(t) {
        (this._icon.className = ""), this._icon.classList.add("lt-icon__icon", "lt-icon__icon--" + t);
    }
    getElement() {
        return this._element;
    }
}
