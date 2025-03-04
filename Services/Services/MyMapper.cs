using AutoMapper;
using Repository.Entity;
using Repository.Repositories;
using System;
using System.IO;
using Microsoft.AspNetCore.Http;
using Common.Dtos;


namespace Services.Services
{
    public class MyMapper : Profile
    {
        public MyMapper()
        {

            // Map בין User ל-UserDto
            CreateMap<User, UserDto>()
                 .ForMember(dest => dest.ProfilPic, src => src
                 .MapFrom(s => ConvertToByte(Path.Combine(Environment.CurrentDirectory, "images", s.ProfilPic))));

            CreateMap<UserDto, User>()
                .ForMember(dest => dest.ProfilPic, src => src
                .MapFrom(s => s.File.FileName));

            CreateMap<Image, ImageDto>()
                .ForMember(dest => dest.Url, src => src.MapFrom(s => s.Url)); // מיפוי ישיר ל-string

            CreateMap<ImageDto, Image>()
                .ForMember(dest => dest.Url, src => src.MapFrom(s => s.File != null ? s.File.FileName : s.Url)); // מיפוי מ-FileName אם קיים

            //    CreateMap<Recommendation, RecommendationDto>()
            //.ForMember(dest => dest.Images, src => src.MapFrom(s => s.Images.Select(image => ConvertToByte(Environment.CurrentDirectory + "/Images/" + image)).ToArray()));

            //    CreateMap<RecommendationDto, Recommendation>()
            //        .ForMember(dest => dest.Images, src => src.MapFrom(s => s.Images.Select(image => image.FileName).ToList()));


            CreateMap<Recommendation, RecommendationDto>().ReverseMap();
            CreateMap<City, CityDto>().ReverseMap();
            CreateMap<Category, CategoryDto>().ReverseMap();
            CreateMap<Country, CountryDto>().ReverseMap();
            CreateMap<Place, PlaceDto>().ReverseMap().ReverseMap();
            CreateMap<Image, ImageDto>().ReverseMap().ReverseMap();
            CreateMap<RecommendationLike, RecommendationLikeDto>().ReverseMap();


        }

        public byte[] ConvertToByte(string image)
        {
            if (!File.Exists(image))
            {
                Console.WriteLine($"⚠ הקובץ לא נמצא: {image}. מחזיר תמונת ברירת מחדל.");
                return File.Exists(Environment.CurrentDirectory + "/images/default.jpg")
                    ? File.ReadAllBytes(Environment.CurrentDirectory + "/images/default.jpg")
                    : new byte[0]; // אם גם התמונה ברירת מחדל חסרה, מחזיר מערך ריק
            }

            return File.ReadAllBytes(image);
        }


    }
}
