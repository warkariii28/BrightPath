using BrightPath.DTOs;
using BrightPath.Models;
using BrightPath.Exceptions;
using Microsoft.Data.SqlClient;
using System.Data;

namespace BrightPath.Repositories;

public class CourseRepository : ICourseRepository
{
    private readonly string _conn;

    public CourseRepository(IConfiguration config)
    {
        _conn = config.GetConnectionString("DefaultConnection")!;
    }

    public List<CourseResponseDto> GetAll()
    {
        var courses = new List<CourseResponseDto>();

        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("GetAllCourses", conn);
        cmd.CommandTimeout = 30;
        cmd.CommandType = CommandType.StoredProcedure;

        conn.Open();

        using SqlDataReader reader = cmd.ExecuteReader();

        while (reader.Read())
        {
            courses.Add(new CourseResponseDto
            {
                CourseID = Convert.ToInt32(reader["CourseID"]),
                CourseName = reader["CourseName"]?.ToString() ?? "",
                Fee = Convert.ToDecimal(reader["Fee"]),
                DurationWeeks = Convert.ToInt32(reader["DurationWeeks"])
            });
        }

        return courses;
    }

    public PagedResultDto<CourseResponseDto> GetPaged(int page, int pageSize, string? search)
    {
        var courses = new List<CourseResponseDto>();
        var totalCount = 0;

        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("GetCoursesPaged", conn);

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
            courses.Add(new CourseResponseDto
            {
                CourseID = Convert.ToInt32(reader["CourseID"]),
                CourseName = reader["CourseName"]?.ToString() ?? "",
                Fee = Convert.ToDecimal(reader["Fee"]),
                DurationWeeks = Convert.ToInt32(reader["DurationWeeks"])
            });
        }

        if (reader.NextResult() && reader.Read())
        {
            totalCount = Convert.ToInt32(reader["TotalCount"]);
        }

        return new PagedResultDto<CourseResponseDto>
        {
            Items = courses,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public int Add(Course course)
    {
        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("AddCourse", conn);

        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@CourseName", SqlDbType.NVarChar, 200).Value = course.CourseName;
        cmd.Parameters.Add("@Fee", SqlDbType.Decimal).Value = course.Fee;
        cmd.Parameters.Add("@DurationWeeks", SqlDbType.Int).Value = course.DurationWeeks;

        conn.Open();

        try
        {
            var result = cmd.ExecuteScalar();
            return Convert.ToInt32(result);
        }
        catch (SqlException ex) when (ex.Number == 2601 || ex.Number == 2627)
        {
            throw new BadRequestException("Course name already exists");
        }
    }

    public bool Delete(int id)
    {
        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("RemoveCourse", conn);

        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@CourseID", SqlDbType.Int).Value = id;

        conn.Open();

        int rows = cmd.ExecuteNonQuery();

        return rows > 0;
    }

    public Course? GetById(int id)
    {
        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("GetCourseByID", conn);

        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@CourseID", SqlDbType.Int).Value = id;

        conn.Open();

        using SqlDataReader reader = cmd.ExecuteReader();

        if (reader.Read())
        {
            return new Course
            {
                CourseID = (int)reader["CourseID"],
                CourseName = reader["CourseName"].ToString() ?? "",
                Fee = (decimal)reader["Fee"],
                DurationWeeks = (int)reader["DurationWeeks"]
            };
        }

        return null;
    }

    public CourseProfileDto? GetProfile(int id)
    {
        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("GetCourseProfile", conn);

        cmd.CommandTimeout = 30;
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@CourseID", SqlDbType.Int).Value = id;

        conn.Open();

        using SqlDataReader reader = cmd.ExecuteReader();

        if (!reader.Read())
            return null;

        var profile = new CourseProfileDto
        {
            CourseID = Convert.ToInt32(reader["CourseID"]),
            CourseName = reader["CourseName"]?.ToString() ?? "",
            Fee = Convert.ToDecimal(reader["Fee"]),
            DurationWeeks = Convert.ToInt32(reader["DurationWeeks"]),
            CreatedAt = ReadDateTime(reader, "CreatedAt") ?? DateTime.UtcNow
        };

        if (reader.NextResult())
        {
            while (reader.Read())
            {
                profile.Students.Add(new CourseProfileStudentDto
                {
                    EnrollmentID = Convert.ToInt32(reader["EnrollmentID"]),
                    StudentID = Convert.ToInt32(reader["StudentID"]),
                    StudentName = reader["StudentName"]?.ToString() ?? "",
                    Email = reader["Email"]?.ToString() ?? "",
                    EnrollmentDate = Convert.ToDateTime(reader["EnrollmentDate"])
                });
            }
        }

        profile.TotalStudents = profile.Students.Count;
        profile.ProjectedRevenue = profile.TotalStudents * profile.Fee;
        profile.FirstEnrollmentDate = profile.Students.Count == 0
            ? null
            : profile.Students.Min(s => s.EnrollmentDate);
        profile.LastEnrollmentDate = profile.Students.Count == 0
            ? null
            : profile.Students.Max(s => s.EnrollmentDate);
        profile.RecentActivity.Add(new CourseActivityDto
        {
            ActivityType = "CourseCreated",
            Description = $"Course created: {profile.CourseName}",
            ActivityDate = profile.CreatedAt
        });

        foreach (var student in profile.Students.Take(5))
        {
            profile.RecentActivity.Add(new CourseActivityDto
            {
                ActivityType = "EnrollmentCreated",
                Description = $"{student.StudentName} enrolled",
                ActivityDate = student.EnrollmentDate
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

    public bool Update(Course course)
    {
        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("UpdateCourse", conn);

        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@CourseID", SqlDbType.Int).Value = course.CourseID;
        cmd.Parameters.Add("@CourseName", SqlDbType.NVarChar, 200).Value = course.CourseName;
        cmd.Parameters.Add("@Fee", SqlDbType.Decimal).Value = course.Fee;
        cmd.Parameters.Add("@DurationWeeks", SqlDbType.Int).Value = course.DurationWeeks;

        conn.Open();

        try
        {
            int rows = cmd.ExecuteNonQuery();
            return rows > 0;
        }
        catch (SqlException ex) when (ex.Number == 2601 || ex.Number == 2627)
        {
            throw new BadRequestException("Course name already exists");
        }
    }
}
