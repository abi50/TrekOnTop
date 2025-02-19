using AutoMapper;
using Common.Dtos;
using Repository.Entity;
using Repository.Interfaces;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Services.Services
{
    public class CityService : IService<CityDto>
    {
        private readonly IRepository<City> _repository;
        private readonly IMapper _mapper;

        
        public CityService(IRepository<City> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public CityDto AddItem(CityDto item)
        {
            return _mapper.Map<CityDto>(_repository.AddItem(_mapper.Map<City>(item)));
        }

        public void Delete(int id)
        {
            var city = _repository.Get(id);
            if (city == null)
                throw new Exception($"City with ID {id} not found.");

            _repository.DeleteItem(id);
        }

        public List<CityDto> GetAll()
        {
            return _repository.GetAll().Select(city => _mapper.Map<CityDto>(city)).ToList();
        }

        public CityDto GetById(int id)
        {
            var city = _repository.Get(id);
            if (city == null)
                throw new Exception($"City with ID {id} not found.");

            return _mapper.Map<CityDto>(city);
        }

        public CityDto Update(int id, CityDto item)
        {
            var existingCity = _repository.Get(id);
            if (existingCity == null)
                throw new Exception($"City with ID {id} not found.");

            return _mapper.Map<CityDto>(_repository.UpdateItem(id, _mapper.Map(item, existingCity)));
        }
    }
}
