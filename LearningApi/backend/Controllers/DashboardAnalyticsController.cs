using BrightPath.DTOs;
using BrightPath.Helpers;
using BrightPath.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/dashboard/analytics")]
public class DashboardAnalyticsController : ControllerBase
{
    private readonly IDashboardAnalyticsRepository _repo;

    public DashboardAnalyticsController(IDashboardAnalyticsRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<DashboardAnalyticsDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult Get()
    {
        var analytics = _repo.GetAnalytics();
        return Ok(ResponseHelper.Success(analytics, "Dashboard analytics fetched successfully"));
    }
}
