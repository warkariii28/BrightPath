using BrightPath.DTOs;
using BrightPath.Models;
using BrightPath.Repositories;
using BrightPath.Exceptions;

namespace BrightPath.Services;

public class StudentService : IStudentService
{
    private readonly IStudentRepository _repo;

    public StudentService(IStudentRepository repo)
    {
        _repo = repo;
    }

    public List<StudentResponseDto> GetAll()
    {
        return _repo.GetAll();
    }

    public PagedResultDto<StudentResponseDto> GetPaged(int page, int pageSize, string? search)
    {
        return _repo.GetPaged(page, pageSize,search);
    }

    public Student GetById(int id)
    {
        var student = _repo.GetById(id);

        if (student == null)
            throw new NotFoundException("Student not found");

        return student;
    }

    public StudentProfileDto GetProfile(int id)
    {
        if (id <= 0)
            throw new BadRequestException("Invalid ID");

        var profile = _repo.GetProfile(id);

        if (profile == null)
            throw new NotFoundException("Student not found");

        return profile;
    }

    public int Add(Student student)
    {
        return _repo.Add(student);
    }

    public void Delete(int id)
    {
        if (id <= 0)
            throw new BadRequestException("Invalid ID");

        bool deleted = _repo.Delete(id);

        if (!deleted)
            throw new NotFoundException("Student not found");
    }

    public void Update(Student student)
    {
        bool updated = _repo.Update(student);

        if (!updated)
            throw new NotFoundException("Student not found");
    }
}
