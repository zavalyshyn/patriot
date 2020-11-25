class Port {
    constructor() {
        this.value = undefined;
    }

    setValue(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }
}
module.exports = Port;