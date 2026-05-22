namespace BrightPath.DTOs;

public class DashboardAnalyticsDto
{
    public int TotalStudents { get; set; }
    public int TotalCourses { get; set; }
    public int TotalEnrollments { get; set; }
    public decimal TotalRevenue { get; set; }
    public int AdminActionsThisWeek { get; set; }
    public List<RecentEnrollmentDto> RecentEnrollments { get; set; } = [];
    public List<PopularCourseDto> PopularCourses { get; set; } = [];
    public List<StudentGrowthDto> StudentGrowth { get; set; } = [];
    public List<RecentStudentDto> RecentStudents { get; set; } = [];
    public List<RecentAdminActionDto> RecentAdminActions { get; set; } = [];
}

public class RecentEnrollmentDto
{
    public int EnrollmentID { get; set; }
    public string StudentName { get; set; } = "";
    public string CourseName { get; set; } = "";
    public DateTime EnrollmentDate { get; set; }
}

public class PopularCourseDto
{
    public int CourseID { get; set; }
    public string CourseName { get; set; } = "";
    public int EnrollmentCount { get; set; }
    public decimal Revenue { get; set; }
}

public class StudentGrowthDto
{
    public string Period { get; set; } = "";
    public int StudentCount { get; set; }
}

public class RecentStudentDto
{
    public int StudentID { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

public class RecentAdminActionDto
{
    public int AuditLogID { get; set; }
    public string AdminName { get; set; } = "";
    public string Action { get; set; } = "";
    public string EntityName { get; set; } = "";
    public int? EntityID { get; set; }
    public DateTime CreatedAt { get; set; }
}
