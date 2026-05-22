namespace BrightPath.Repositories;

using BrightPath.DTOs;
using BrightPath.Models;

public interface IStudentRepository
{
    List<StudentResponseDto> GetAll();
    PagedResultDto<StudentResponseDto> GetPaged(int page, int pageSize,string? search);
    Student? GetById(int id);
    StudentProfileDto? GetProfile(int id);
    int Add(Student student);
    bool Delete(int id);
    bool Update(Student student);
}
