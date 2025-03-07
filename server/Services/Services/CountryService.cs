using AutoMapper;
using Common.Dtos;
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
    public class CountryService : IService<CountryDto>
    {
        private readonly IRepository<Country> _repository;
        private readonly IMapper _mapper;

        public CountryService(IRepository<Country> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public CountryDto AddItem(CountryDto item)
        {
            var country = _mapper.Map<Country>(item);
            _repository.AddItem(country);
            return _mapper.Map<CountryDto>(country);
        }

        public void Delete(int id)
        {
            _repository.DeleteItem(id);
        }

        public List<CountryDto> GetAll()
        {
            var countries = _repository.GetAll();
            return _mapper.Map<List<CountryDto>>(countries);
        }

        public CountryDto GetById(int id)
        {
            var country = _repository.Get(id);
            return _mapper.Map<CountryDto>(country);
        }

        public CountryDto Update(int id, CountryDto item)
        {
            var country = _mapper.Map<Country>(item);
            var updatedCountry = _repository.UpdateItem(id, country);
            return _mapper.Map<CountryDto>(updatedCountry);
        }
    }

}
