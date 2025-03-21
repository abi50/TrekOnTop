﻿using AutoMapper;
using Common.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Repository.Entity;
using Repository.Interfaces;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class UserService : IService<UserDto>
    {
        private readonly IRepository<User> _repository;
        private readonly IMapper _mapper;
        private readonly string _imagesFolder;
        private readonly IHttpContextAccessor _httpContextAccessor;



        public UserService(IRepository<User> repository, IMapper mapper, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _mapper = mapper;
            _imagesFolder = Path.Combine(Environment.CurrentDirectory, configuration["ImagesFolder"]);
            _httpContextAccessor = httpContextAccessor;
        }
        private int GetCurrentUserId()
        {
            var httpContextAccessor = new HttpContextAccessor();
            var userIdClaim = httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : throw new Exception("User not authenticated.");
        }

        public UserDto AddItem(UserDto item)
        {
            // שמירת הקובץ
            if (item.File != null && item.File.Length > 0)
            {
                if (!Directory.Exists(_imagesFolder))
                {
                    Directory.CreateDirectory(_imagesFolder); // צור את התיקייה אם אינה קיימת
                }

                var filePath = Path.Combine(_imagesFolder, item.File.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    item.File.CopyTo(stream); // שמירת הקובץ בדיסק
                }

                item.ProfilPic = File.ReadAllBytes(filePath); // שמירת התמונה כ-Byte Array
            }

            // מיפוי ושמירת המשתמש במסד הנתונים
            var user = _mapper.Map<User>(item);
            _repository.AddItem(user);
            return _mapper.Map<UserDto>(user);
        }


       

        public void Delete(int id)
        {
            var currentUserId = GetCurrentUserId();
            var user = _repository.Get(id);
            if (user == null)
                throw new Exception("User not found.");

            if (user.UserId != currentUserId)
                throw new Exception("Unauthorized. You can only delete your own account.");

            _repository.DeleteItem(id);
        }

        public List<UserDto> GetAll()
        {
            var users = _repository.GetAll();
            return _mapper.Map<List<UserDto>>(users);
        }

       

        public UserDto GetById(int id)
        {
            var user = _repository.Get(id);
            return _mapper.Map<UserDto>(user);
        }

        public UserDto Update(int id, UserDto item)
        {
            var user = _mapper.Map<User>(item);
            var updatedUser = _repository.UpdateItem(id, user);
            return _mapper.Map<UserDto>(updatedUser);
        }
    }
}
