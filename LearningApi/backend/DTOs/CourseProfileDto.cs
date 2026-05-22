namespace BrightPath.DTOs;

public class CourseProfileDto
{
    public int CourseID { get; set; }
    public string CourseName { get; set; } = "";
    public decimal Fee { get; set; }
    public int DurationWeeks { get; set; }
    public DateTime CreatedAt { get; set; }
    public int TotalStudents { get; set; }
    public decimal ProjectedRevenue { get; set; }
    public DateTime? FirstEnrollmentDate { get; set; }
    public DateTime? LastEnrollmentDate { get; set; }
    public List<CourseProfileStudentDto> Students { get; set; } = [];
    public List<CourseActivityDto> RecentActivity { get; set; } = [];
}

public class CourseProfileStudentDto
{
    public int EnrollmentID { get; set; }
    public int StudentID { get; set; }
    public string StudentName { get; set; } = "";
    public string Email { get; set; } = "";
    public DateTime EnrollmentDate { get; set; }
}

public class CourseActivityDto
{
    public string ActivityType { get; set; } = "";
    public string Description { get; set; } = "";
    public DateTime ActivityDate { get; set; }
}
