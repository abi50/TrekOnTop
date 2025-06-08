export interface RecommendationDto {
    recoId: number;
    title: string;
    description: string;
    likes: number;
    dislikes: number;
    placeId: number;
    userId: number;
  }
  
  export interface PlaceDto {
    placeId: number;
    placeName: string;
    categoryId: number;
    cityId: number;
    latitude: number;
    longitude: number;
  }
 
  export interface ImageDto {
    imageId: number;
    url: string;
    recommendationId: number;
  }
  
  export interface UserDto {
    userId: number;
    name: string;
    email: string;
    profilPic: string; // base64
  }
  export interface CategoryDto{
    categoryId: number;
    name: string;
    isDeleted: boolean;
  }
  export interface CountryDto{
    
      countryId: number;
      countryName: string;
      countryCode: string;
    
  }
export interface CityDto{
     id: number,
    name: string,
    countryId: number
}
