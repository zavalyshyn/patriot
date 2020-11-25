class Module {
    constructor() {
        this.name = null;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getType() {}

    getDescription() {}

    getServiceInstance() {}

    getElement() {}
}
module.exports = Module;