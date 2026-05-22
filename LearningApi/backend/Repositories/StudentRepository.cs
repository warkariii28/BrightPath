namespace BrightPath.Repositories;

using BrightPath.Exceptions;
using BrightPath.DTOs;
using BrightPath.Models;
using Microsoft.Data.SqlClient;
using System.Data;

public class StudentRepository : IStudentRepository
{
    private readonly string _conn;

    public StudentRepository(IConfiguration config)
    {
        _conn = config.GetConnectionString("DefaultConnection")!;
    }

    public List<StudentResponseDto> GetAll()
    {
        var students = new List<StudentResponseDto>();

        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("GetAllStudents", conn);
        cmd.CommandTimeout = 30;
        cmd.CommandType = CommandType.StoredProcedure;

        conn.Open();

        using SqlDataReader reader = cmd.ExecuteReader();

        while (reader.Read())
        {
            students.Add(new StudentResponseDto
            {
                StudentID = Convert.ToInt32(reader["StudentID"]),
                Name = reader["Name"]?.ToString() ?? "",
                Email = reader["Email"]?.ToString() ?? ""
            });
        }

        return students;
    }

    public PagedResultDto<StudentResponseDto> GetPaged(int page, int pageSize, string? search)
    {
        var students = new List<StudentResponseDto>();
        var totalCount = 0;

        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("GetStudentsPaged", conn);

        cmd.CommandTimeout = 30;
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@Page", SqlDbType.Int).Value = page;
        cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pageSize;
        cmd.Parameters.Add("@Search", SqlDbType.NVarChar, 200).Value =
        string.IsNullOrWhiteSpace(search) ? DBNull.Value : search.Trim();

        conn.Open();

        using SqlDataReader reader = cmd.ExecuteReader();

        while (reader.Read())
        {
            students.Add(new StudentResponseDto
            {
                StudentID = Convert.ToInt32(reader["StudentID"]),
                Name = reader["Name"]?.ToString() ?? "",
                Email = reader["Email"]?.ToString() ?? ""
            });
        }

        if (reader.NextResult() && reader.Read())
        {
            totalCount = Convert.ToInt32(reader["TotalCount"]);
        }

        return new PagedResultDto<StudentResponseDto>
        {
            Items = students,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public Student? GetById(int id)
    {
        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("GetStudentByID", conn);

        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@StudentID", SqlDbType.Int).Value = id;

        conn.Open();

        using SqlDataReader reader = cmd.ExecuteReader();

        if (!reader.Read())
            return null;

        return new Student
        {
            StudentID = (int)reader["StudentID"],
            Name = reader["Name"]?.ToString() ?? "",
            Email = reader["Email"]?.ToString() ?? ""
        };
    }

    public StudentProfileDto? GetProfile(int id)
    {
        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("GetStudentProfile", conn);

        cmd.CommandTimeout = 30;
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@StudentID", SqlDbType.Int).Value = id;

        conn.Open();

        using SqlDataReader reader = cmd.ExecuteReader();

        if (!reader.Read())
            return null;

        var profile = new StudentProfileDto
        {
            StudentID = Convert.ToInt32(reader["StudentID"]),
            Name = reader["Name"]?.ToString() ?? "",
            Email = reader["Email"]?.ToString() ?? "",
            CreatedAt = ReadDateTime(reader, "CreatedAt") ?? DateTime.UtcNow
        };

        if (reader.NextResult())
        {
            while (reader.Read())
            {
                profile.Enrollments.Add(new StudentProfileEnrollmentDto
                {
                    EnrollmentID = Convert.ToInt32(reader["EnrollmentID"]),
                    CourseID = Convert.ToInt32(reader["CourseID"]),
                    CourseName = reader["CourseName"]?.ToString() ?? "",
                    Fee = Convert.ToDecimal(reader["Fee"]),
                    DurationWeeks = Convert.ToInt32(reader["DurationWeeks"]),
                    EnrollmentDate = Convert.ToDateTime(reader["EnrollmentDate"])
                });
            }
        }

        profile.TotalCourses = profile.Enrollments.Count;
        profile.TotalFees = profile.Enrollments.Sum(e => e.Fee);
        profile.FirstEnrollmentDate = profile.Enrollments.Count == 0
            ? null
            : profile.Enrollments.Min(e => e.EnrollmentDate);
        profile.LastEnrollmentDate = profile.Enrollments.Count == 0
            ? null
            : profile.Enrollments.Max(e => e.EnrollmentDate);
        profile.RecentActivity.Add(new StudentActivityDto
        {
            ActivityType = "ProfileCreated",
            Description = $"Student profile created for {profile.Name}",
            ActivityDate = profile.CreatedAt
        });

        foreach (var enrollment in profile.Enrollments.Take(5))
        {
            profile.RecentActivity.Add(new StudentActivityDto
            {
                ActivityType = "EnrollmentCreated",
                Description = $"Enrolled in {enrollment.CourseName}",
                ActivityDate = enrollment.EnrollmentDate
            });
        }

        profile.RecentActivity = profile.RecentActivity
            .OrderByDescending(a => a.ActivityDate)
            .ToList();

        return profile;
    }

    private static DateTime? ReadDateTime(SqlDataReader reader, string columnName)
    {
        if (!HasColumn(reader, columnName) || reader[columnName] == DBNull.Value)
            return null;

        return Convert.ToDateTime(reader[columnName]);
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

    public int Add(Student student)
    {
        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("AddStudent", conn);

        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@Name", SqlDbType.NVarChar, 100).Value = student.Name;
        cmd.Parameters.Add("@Email", SqlDbType.NVarChar, 256).Value = student.Email;


        conn.Open();

        try
        {
            var result = cmd.ExecuteScalar();
            return Convert.ToInt32(result);
        }
        catch (SqlException ex) when (ex.Number == 2601 || ex.Number == 2627)
        {
            throw new BadRequestException("Student email already exists");
        }
    }

    public bool Delete(int id)
    {
        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("RemoveStudent", conn);

        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@StudentID", SqlDbType.Int).Value = id;

        conn.Open();

        int rows = cmd.ExecuteNonQuery();

        return rows > 0;
    }

    public bool Update(Student student)
    {
        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("UpdateStudent", conn);

        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@StudentID", SqlDbType.Int).Value = student.StudentID;
        cmd.Parameters.Add("@Name", SqlDbType.NVarChar, 100).Value = student.Name;
        cmd.Parameters.Add("@Email", SqlDbType.NVarChar, 256).Value = student.Email;

        conn.Open();

        try
        {
            int rows = cmd.ExecuteNonQuery();
            return rows > 0;
        }
        catch (SqlException ex) when (ex.Number == 2601 || ex.Number == 2627)
        {
            throw new BadRequestException("Student email already exists");
        }

    }
}
