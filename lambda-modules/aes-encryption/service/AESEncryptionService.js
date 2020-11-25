const Component = require('../../../core/Component');
const logger = require('../../../utils/logger');
const crypto = require('crypto');
const algorithm = 'aes-192-cbc';

class AESEncryptionService extends Component {
    constructor() {
        super();

        // code for Node.js v 8.x (SCONE)
        this.iv = crypto.randomBytes(16); // Initialization vector.
        this.password = 'super secret password';
        this.key = crypto.pbkdf2Sync(this.password, 'salt', 100000, 24,'sha512');
        this.cipher = crypto.createCipheriv('aes192', this.key, this.iv);

        // code for Node.js v 10+ LTS
        // this.password = 'super secret password';
        // // Key length is dependent on the algorithm. In this case for aes192, it is
        // // 24 bytes (192 bits).
        // // Use async `crypto.scrypt()` instead.
        // this.key = crypto.scryptSync(this.password, 'salt', 24);
        //
        // this.iv = crypto.randomBytes(16); // Initialization vector.
        //
        // this.cipher = crypto.createCipheriv(algorithm, this.key, this.iv);
    }

    getType() {
        return "AESEncryption"
    }

    enabling() {}

    disabling() {
        // disable dataPooler process
        this.stopPooling = true;
    }

    handleIncomingEvent(event,portType) {
        logger.infoLog.info(`LOGGER: AESEncryption Service received event on port ${portType}`);
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType==="EncryptDataInPort" && event.value) {


                // let encryptedData = that.cipher.update(event.value, 'base64', 'base64');
                // encryptedData += that.cipher.final('base64');
                let encryptedData = that.cipher.update(event.value);

                if (encryptedData) {
                    resolve(encryptedData);
                    // logger.debugLog.debug('Encrypted data: ' + encryptedData);
                }
                else reject("AESEncryption Service failed to encrypt the data");
            }
        })
    }

    canHandleIncomingEvent() {
        return true;
    };

    canHandleIncomingEventOnPortType(portType) {
        return portType === "EncryptDataInPort";
    };

}
module.exports = AESEncryptionService;