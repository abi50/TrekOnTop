export interface User {
    name: string;
    profilPic: string;
    email: string;
    images: Image[];
}

export interface Image {
    imageId: number;
    url: string;
}

export interface Recommendation {
    recoId: number;
    title: string;
    description: string;
    images: Image[];
    user?: User;
    likes: number;
    dislikes: number;
    userLiked: boolean;
    userDisliked: boolean;
}
export interface Place {
    placeId: number;
    placeName: string;
    imageUrl: string;
    country: string;
    latitude: number;
    longitude: number;
}

export interface Country {
    countryId: number;
    countryName: string;
}