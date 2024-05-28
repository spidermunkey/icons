export function gooey(element,props) {

    return {
        _this: this,
        self: element,
        props: {
            ...props
        },
    }
    function add(cls) {
        return self.classList.add(cls);
    }
    function remove(cls) {
        return self.classList.remove(cls);
    }
    function checkFor(cls) {
        return self.classList.contains(cls);
    }
    function swap(cls) {
        return function(replacement) {
            if (self.classList.contains(cls))
                _this.remove(cls);

            _this.add(replacement);
        }
    }
    function setData(attr) {
        return function(data) {
            return self.dataset.attr = data;
        }
    }
    function getData(attr) {
        return self.dataset.attr;
    }
    function checkData(attr) {
        return self.dataset.contains(attr)
    }
    function swapData(attr) {
        return function(replacement) {
            self.dataset.attr = replacement
        }
    }
}