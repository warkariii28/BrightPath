using BrightPath.DTOs;
using BrightPath.Models;

namespace BrightPath.Services;

public interface IStudentService
{
    List<StudentResponseDto> GetAll();
    PagedResultDto<StudentResponseDto> GetPaged(int page, int pageSize,string? search);
    Student GetById(int id);
    StudentProfileDto GetProfile(int id);

    int Add(Student student);

    void Delete(int id);

    void Update(Student student);
}
