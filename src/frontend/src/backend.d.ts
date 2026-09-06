import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
import type { ExternalBlob } from "@caffeineai/object-storage";
export type { ExternalBlob } from "@caffeineai/object-storage";
export type DishId = bigint;
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export type ReservationId = bigint;
export interface Reservation {
    id: ReservationId;
    date: string;
    name: string;
    createdAt: bigint;
    time: string;
    message: string;
    partySize: bigint;
}
export interface Dish {
    id: DishId;
    name: string;
    tags: Array<string>;
    popular: boolean;
    description: string;
    priceDt: bigint;
    imageRef: string;
    category: DishCategory;
}
export type GalleryImageId = bigint;
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export interface GalleryImage {
    id: GalleryImageId;
    blob: ExternalBlob;
    name: string;
    createdAt: bigint;
}
export interface Cell {
    value: Value;
    name: string;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum DishCategory {
    desserts = "desserts",
    boissons = "boissons",
    plats = "plats"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createReservation(name: string, date: string, time: string, partySize: bigint, message: string): Promise<Reservation>;
    execute(qJson: string): Promise<Result>;
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getDish(id: DishId): Promise<Dish | null>;
    getDishes(): Promise<Array<Dish>>;
    getGalleryImages(): Promise<Array<GalleryImage>>;
    getReservations(): Promise<Array<Reservation>>;
    isCallerAdmin(): Promise<boolean>;
    schema(): Promise<string>;
    uploadGalleryImage(name: string, blob: ExternalBlob): Promise<GalleryImage>;
}
