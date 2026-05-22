namespace BrightPath.DTOs;

public class EnrollmentResponseDto
{
    public int EnrollmentID { get; set; }
    public string StudentName { get; set; } = "";
    public string CourseName { get; set; } = "";
    public DateTime EnrollmentDate { get; set; }
}

public class EnrollmentDetailDto
{
    public int EnrollmentID { get; set; }
    public int StudentID { get; set; }
    public string StudentName { get; set; } = "";
    public string StudentEmail { get; set; } = "";
    public int CourseID { get; set; }
    public string CourseName { get; set; } = "";
    public decimal Fee { get; set; }
    public int DurationWeeks { get; set; }
    public DateTime EnrollmentDate { get; set; }
    public string Status { get; set; } = "Active";
    public decimal AmountPaid { get; set; }
    public decimal BalanceDue { get; set; }
}
