/**
 * This class is responsible for providing paths to Prolog and Graphviz
 * executables and files. We might not need it in the end.
 * TODO: I guess we don't really need this file
 * @type {mobule.Config}
 */

function Config() {
    this.getManifestGraphvizDir = function() {
        return "GRAPHVIZ_PATH" //TODO: modify the path
    }

    this.getModelDir = function() {
        return "MODEL_PATH" //TODO: modify the path
    }

    this.getModelCheckerDir = function() {
        return "MODELCHECKER_PATH"  //TODO: modify the path
    }
}

module.exports = Config;