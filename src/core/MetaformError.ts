class MetaformError extends Error {
    details: any;
    constructor(msg: string, details: any) {
        super(msg);
        this.details = details;
    }
}

export default MetaformError;
