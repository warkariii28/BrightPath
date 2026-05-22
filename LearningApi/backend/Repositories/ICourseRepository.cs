using BrightPath.DTOs;
using BrightPath.Models;

namespace BrightPath.Repositories;

public interface ICourseRepository
{
    List<CourseResponseDto> GetAll();
    PagedResultDto<CourseResponseDto> GetPaged(int page, int pageSize,string? search);
    int Add(Course course);
    bool Delete(int id);

    Course? GetById(int id);
    CourseProfileDto? GetProfile(int id);
    bool Update(Course course);
}
