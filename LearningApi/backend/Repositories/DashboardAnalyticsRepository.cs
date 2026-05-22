using BrightPath.DTOs;
using Microsoft.Data.SqlClient;
using System.Data;

namespace BrightPath.Repositories;

public class DashboardAnalyticsRepository : IDashboardAnalyticsRepository
{
    private readonly string _conn;

    public DashboardAnalyticsRepository(IConfiguration config)
    {
        _conn = config.GetConnectionString("DefaultConnection")!;
    }

    public DashboardAnalyticsDto GetAnalytics()
    {
        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("GetDashboardAnalytics", conn);

        cmd.CommandTimeout = 30;
        cmd.CommandType = CommandType.StoredProcedure;

        conn.Open();

        using SqlDataReader reader = cmd.ExecuteReader();

        var analytics = new DashboardAnalyticsDto();

        if (reader.Read())
        {
            analytics.TotalStudents = Convert.ToInt32(reader["TotalStudents"]);
            analytics.TotalCourses = Convert.ToInt32(reader["TotalCourses"]);
            analytics.TotalEnrollments = Convert.ToInt32(reader["TotalEnrollments"]);
            analytics.TotalRevenue = Convert.ToDecimal(reader["TotalRevenue"]);
            analytics.AdminActionsThisWeek = ReadInt(reader, "AdminActionsThisWeek") ?? 0;
        }

        if (reader.NextResult())
        {
            while (reader.Read())
            {
                analytics.RecentEnrollments.Add(new RecentEnrollmentDto
                {
                    EnrollmentID = Convert.ToInt32(reader["EnrollmentID"]),
                    StudentName = reader["StudentName"]?.ToString() ?? "",
                    CourseName = reader["CourseName"]?.ToString() ?? "",
                    EnrollmentDate = Convert.ToDateTime(reader["EnrollmentDate"])
                });
            }
        }

        if (reader.NextResult())
        {
            while (reader.Read())
            {
                analytics.PopularCourses.Add(new PopularCourseDto
                {
                    CourseID = Convert.ToInt32(reader["CourseID"]),
                    CourseName = reader["CourseName"]?.ToString() ?? "",
                    EnrollmentCount = Convert.ToInt32(reader["EnrollmentCount"]),
                    Revenue = Convert.ToDecimal(reader["Revenue"])
                });
            }
        }

        if (reader.NextResult())
        {
            while (reader.Read())
            {
                analytics.StudentGrowth.Add(new StudentGrowthDto
                {
                    Period = reader["Period"]?.ToString() ?? "",
                    StudentCount = Convert.ToInt32(reader["StudentCount"])
                });
            }
        }

        if (reader.NextResult())
        {
            while (reader.Read())
            {
                analytics.RecentStudents.Add(new RecentStudentDto
                {
                    StudentID = Convert.ToInt32(reader["StudentID"]),
                    Name = reader["Name"]?.ToString() ?? "",
                    Email = reader["Email"]?.ToString() ?? "",
                    CreatedAt = Convert.ToDateTime(reader["CreatedAt"])
                });
            }
        }

        if (reader.NextResult())
        {
            while (reader.Read())
            {
                analytics.RecentAdminActions.Add(new RecentAdminActionDto
                {
                    AuditLogID = Convert.ToInt32(reader["AuditLogID"]),
                    AdminName = reader["AdminName"]?.ToString() ?? "",
                    Action = reader["Action"]?.ToString() ?? "",
                    EntityName = reader["EntityName"]?.ToString() ?? "",
                    EntityID = reader["EntityID"] == DBNull.Value ? null : Convert.ToInt32(reader["EntityID"]),
                    CreatedAt = Convert.ToDateTime(reader["CreatedAt"])
                });
            }
        }

        return analytics;
    }

    private static int? ReadInt(SqlDataReader reader, string columnName)
    {
        if (!HasColumn(reader, columnName) || reader[columnName] == DBNull.Value)
            return null;

        return Convert.ToInt32(reader[columnName]);
    }

    private static bool HasColumn(SqlDataReader reader, string columnName)
    {
        for (var index = 0; index < reader.FieldCount; index++)
        {
            if (string.Equals(reader.GetName(index), columnName, StringComparison.OrdinalIgnoreCase))
                return true;
        }

        return false;
    }
}
