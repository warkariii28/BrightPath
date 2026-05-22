using BrightPath.DTOs;
using BrightPath.Models;

namespace BrightPath.Services;

public interface IEnrollmentService
{
    List<EnrollmentResponseDto> GetAll();
    PagedResultDto<EnrollmentResponseDto> GetPaged(int page, int pageSize,string? search);
    EnrollmentDetailDto GetById(int id);
    void Add(Enrollment enrollment);
    void Delete(int id);
}
