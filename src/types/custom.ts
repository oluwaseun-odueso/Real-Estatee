export type CustomSeller = {
    id: number,
    address_id: number,
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string,
    image_key?: string,
    hashed_password: string, 
};

export type CustomBuyer = {
    id: number;
    address_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    image_key?: string;
    hashed_password: string;
};

export type CustomAddress = {
    id: number,
    street: string,
    city: string,
    state: string,
    country: string,
    postal_code: number
};

export type CustomFeature = {
    id: number,
    feature: string
};

export type CustomProperty = {
    id: number,
    seller_id: number,
    address_id: number,
    description: string,
    type: string,
    price: string
};

export type CustomPropertyFeature = {
    id: number,
    property_id: number,
    feature_id: number,
    number: number
};

