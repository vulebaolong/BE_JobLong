export interface IPayloadToken {
    sub: string;
    _id: string;
    name: string;
    email: string;
    role: {
        _id: string;
        name: string;
    };
    iat?: number;
    exp?: number;
}
