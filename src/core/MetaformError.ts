class MetaformError extends Error {
    details: object;
    constructor(msg: string, details: object) {
        super(msg);
        this.details = details;
    }
}

export default MetaformError;
