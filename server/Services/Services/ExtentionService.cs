using Common.Dtos;
using Microsoft.Extensions.DependencyInjection;
using Repository.Entity;
using Repository.Interfaces;
using Repository.Repositories;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public static class ExtensionService
    {
         public static IServiceCollection AddApplicationServices(this IServiceCollection services)
         {
                services.AddRepository();
                services.AddScoped<IService<UserDto>, UserService>();
                services.AddScoped<IService<RecommendationDto>, RecommendationService>();
                services.AddScoped<IService<CategoryDto>, CategoryService>();
                services.AddScoped<IService<CityDto>, CityService>();
                services.AddScoped<IService<CountryDto>, CountryService>();
                services.AddScoped<IService<PlaceDto>, PlaceService>();
                services.AddScoped<IService<ImageDto>, ImageService>();
                services.AddScoped<RecommendationLikeService>();
            services.AddScoped<IAuthService, AuthService>();

            services.AddScoped<IUserService, UserService>();
                services.AddScoped<IRecommendationService, RecommendationService>();
                services.AddScoped<IPlaceService, PlaceService>();
                services.AddScoped<ICategoryService, CategoryService>();
                services.AddScoped<ICityService, CityService>();
                services.AddScoped<ICountryService, CountryService>();
                services.AddScoped<IImageService, ImageService>();
                services.AddScoped<IRecommendationLikeService, RecommendationLikeService>();
                services.AddAutoMapper(typeof(MyMapper));
                return services;
         }
    }

}

