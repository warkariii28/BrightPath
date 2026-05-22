using BrightPath.DTOs;
using BrightPath.Models;

namespace BrightPath.Services;

public interface ICourseService
{
    List<CourseResponseDto> GetAll();
    PagedResultDto<CourseResponseDto> GetPaged(int page, int pageSize,string? search);

    Course GetById(int id);
    CourseProfileDto GetProfile(int id);

    int Add(Course course);

    void Delete(int id);

    void Update(Course course);
}
