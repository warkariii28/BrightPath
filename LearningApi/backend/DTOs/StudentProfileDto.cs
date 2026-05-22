namespace BrightPath.DTOs;

public class StudentProfileDto
{
    public int StudentID { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public int TotalCourses { get; set; }
    public decimal TotalFees { get; set; }
    public DateTime? FirstEnrollmentDate { get; set; }
    public DateTime? LastEnrollmentDate { get; set; }
    public List<StudentProfileEnrollmentDto> Enrollments { get; set; } = [];
    public List<StudentActivityDto> RecentActivity { get; set; } = [];
}

public class StudentProfileEnrollmentDto
{
    public int EnrollmentID { get; set; }
    public int CourseID { get; set; }
    public string CourseName { get; set; } = "";
    public decimal Fee { get; set; }
    public int DurationWeeks { get; set; }
    public DateTime EnrollmentDate { get; set; }
}

public class StudentActivityDto
{
    public string ActivityType { get; set; } = "";
    public string Description { get; set; } = "";
    public DateTime ActivityDate { get; set; }
}
