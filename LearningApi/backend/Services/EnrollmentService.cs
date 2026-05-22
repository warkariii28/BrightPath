using BrightPath.DTOs;
using BrightPath.Models;
using BrightPath.Repositories;
using BrightPath.Exceptions;

namespace BrightPath.Services;

public class EnrollmentService : IEnrollmentService
{
    private readonly IEnrollmentRepository _repo;

    public EnrollmentService(IEnrollmentRepository repo)
    {
        _repo = repo;
    }

    public List<EnrollmentResponseDto> GetAll()
    {
        return _repo.GetAll();
    }

    public PagedResultDto<EnrollmentResponseDto> GetPaged(int page, int pageSize, string? search)
    {
        return _repo.GetPaged(page, pageSize,search);
    }

    public EnrollmentDetailDto GetById(int id)
    {
        if (id <= 0)
            throw new BadRequestException("Invalid ID");

        var enrollment = _repo.GetById(id);

        if (enrollment is null)
            throw new NotFoundException("Enrollment not found");

        return enrollment;
    }

    public void Add(Enrollment enrollment)
    {
        _repo.Add(enrollment);
    }

    public void Delete(int id)
    {
        if (id <= 0)
            throw new BadRequestException("Invalid ID");

        bool deleted = _repo.Delete(id);

        if (!deleted)
            throw new NotFoundException("Enrollment not found");
    }
}
