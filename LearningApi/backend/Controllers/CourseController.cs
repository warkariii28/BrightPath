using BrightPath.DTOs;
using BrightPath.Models;
using BrightPath.Services;
using BrightPath.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BrightPath.Helpers;
using BrightPath.Constants;

[Authorize]
[ApiController]
[Route("api/courses")]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _service;
    private readonly IAdminAuditLogRepository _auditRepo;

    public CoursesController(
        ICourseService service,
        IAdminAuditLogRepository auditRepo)
    {
        _service = service;
        _auditRepo = auditRepo;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResultDto<CourseResponseDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20,[FromQuery] string? search = null)
    {
        if (page <= 0 || pageSize <= 0 || pageSize > 100)
        {
            return BadRequest(ResponseHelper.Fail<object>("Invalid pagination values"));
        }

        var data = _service.GetPaged(page, pageSize,search);

        return Ok(ResponseHelper.Success(data, "Courses fetched successfully"));
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<Course>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult GetById(int id)
    {
        if (id <= 0)
        {
            return BadRequest(ResponseHelper.Fail<object>("Invalid course ID"));
        }

        var course = _service.GetById(id);
        return Ok(ResponseHelper.Success(course, "Course fetched successfully"));
    }

    [HttpGet("{id}/profile")]
    [ProducesResponseType(typeof(ApiResponse<CourseProfileDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult GetProfile(int id)
    {
        if (id <= 0)
        {
            return BadRequest(ResponseHelper.Fail<object>("Invalid course ID"));
        }

        var profile = _service.GetProfile(id);
        return Ok(ResponseHelper.Success(profile, "Course profile fetched successfully"));
    }

    [Authorize(Roles = AppRoles.Admin)]
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public IActionResult Add(CourseCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ResponseHelper.Fail<object>("Invalid course data"));

        var course = new Course
        {
            CourseName = dto.CourseName,
            Fee = dto.Fee,
            DurationWeeks = dto.DurationWeeks
        };

        int id = _service.Add(course);

        WriteAdminAudit("CreateCourse", id, $"Created course {dto.CourseName}");

        return StatusCode(201, ResponseHelper.Success(id, "Course created successfully"));
    }

    [Authorize(Roles = AppRoles.Admin)]
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public IActionResult Update(int id, CourseUpdateDto dto)
    {
        if (id <= 0)
        {
            return BadRequest(ResponseHelper.Fail<object>("Invalid course ID"));
        }

        if (!ModelState.IsValid)
            return BadRequest(ResponseHelper.Fail<object>("Invalid course data"));

        var course = new Course
        {
            CourseID = id,
            CourseName = dto.CourseName,
            Fee = dto.Fee,
            DurationWeeks = dto.DurationWeeks
        };

        _service.Update(course);

        WriteAdminAudit("UpdateCourse", id, $"Updated course {dto.CourseName}");

        return Ok(ResponseHelper.Success<object>(null, "Updated successfully"));
    }

    [Authorize(Roles = AppRoles.Admin)]
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public IActionResult Delete(int id)
    {
        if (id <= 0)
        {
            return BadRequest(ResponseHelper.Fail<object>("Invalid course ID"));
        }

        _service.Delete(id);

        WriteAdminAudit("DeleteCourse", id);

        return Ok(ResponseHelper.Success<object>(null, "Course deleted successfully"));
    }

    private void WriteAdminAudit(string action, int? entityId, string? details = null)
    {
        var adminUserIdClaim = User.FindFirst("UserID")?.Value;

        if (!int.TryParse(adminUserIdClaim, out int adminUserId))
            return;

        _auditRepo.Add(new AdminAuditLog
        {
            AdminUserID = adminUserId,
            Action = action,
            EntityName = "Course",
            EntityID = entityId,
            Details = details,
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
        });
    }
}
