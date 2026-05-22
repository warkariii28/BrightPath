using BrightPath.DTOs;

namespace BrightPath.Repositories;

public interface IDashboardAnalyticsRepository
{
    DashboardAnalyticsDto GetAnalytics();
}
