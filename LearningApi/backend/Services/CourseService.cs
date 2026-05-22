using BrightPath.DTOs;
using BrightPath.Models;
using BrightPath.Repositories;
using BrightPath.Exceptions;

namespace BrightPath.Services;

public class CourseService : ICourseService
{
    private readonly ICourseRepository _repo;

    public CourseService(ICourseRepository repo)
    {
        _repo = repo;
    }

    public List<CourseResponseDto> GetAll()
    {
        return _repo.GetAll();
    }

    public PagedResultDto<CourseResponseDto> GetPaged(int page, int pageSize, string? search)
    {
        return _repo.GetPaged(page, pageSize,search);
    }

    public Course GetById(int id)
    {
        var course = _repo.GetById(id);

        if (course == null)
            throw new NotFoundException("Course not found");

        return course;
    }

    public CourseProfileDto GetProfile(int id)
    {
        if (id <= 0)
            throw new BadRequestException("Invalid ID");

        var profile = _repo.GetProfile(id);

        if (profile == null)
            throw new NotFoundException("Course not found");

        return profile;
    }

    public int Add(Course course)
    {
        return _repo.Add(course);
    }

    public void Delete(int id)
    {
        if (id <= 0)
            throw new BadRequestException("Invalid ID");

        bool deleted = _repo.Delete(id);

        if (!deleted)
            throw new NotFoundException("Course not found");
    }

    public void Update(Course course)
    {
        bool updated = _repo.Update(course);

        if (!updated)
            throw new NotFoundException("Course not found");
    }
}
