using AutoMapper;
using Common.Dtos;
using Microsoft.EntityFrameworkCore;
using Repository.Entity;
using Repository.Interfaces;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class PlaceService:IService<PlaceDto>
    {
        private readonly IRepository<Place> _repository;
        private readonly IMapper _mapper;

        public PlaceService(IRepository<Place> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public PlaceDto AddItem(PlaceDto item)
        {
            var place = _mapper.Map<Place>(item);
            _repository.AddItem(place);
            return _mapper.Map<PlaceDto>(place);
        }

        public void Delete(int id)
        {
            _repository.DeleteItem(id);
        }

        public List<PlaceDto> GetAll()
        {
            var place = _repository.GetAll();
            return _mapper.Map<List<PlaceDto>>(place);
        }

        public PlaceDto GetById(int id)
        {
            var place = _repository.Get(id);
            return _mapper.Map<PlaceDto>(place);
        }

        public PlaceDto Update(int id, PlaceDto item)
        {
            var place = _mapper.Map<Place>(item);
            _repository.UpdateItem(id, place);
            return _mapper.Map<PlaceDto>(place);
        }
        
    }
}
