using BrightPath.DTOs;
using BrightPath.Models;

namespace BrightPath.Repositories;

public interface IEnrollmentRepository
{
    List<EnrollmentResponseDto> GetAll();
    PagedResultDto<EnrollmentResponseDto> GetPaged(int page, int pageSize,string? search);
    EnrollmentDetailDto? GetById(int id);
    void Add(Enrollment enrollment);
    bool Delete(int id);
}
