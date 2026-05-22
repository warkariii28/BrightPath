using Microsoft.Data.SqlClient;
using System.Data;
using BrightPath.Models;
using BrightPath.DTOs;
using BrightPath.Exceptions;

namespace BrightPath.Repositories;

public class EnrollmentRepository : IEnrollmentRepository
{
    private readonly string _conn;

    public EnrollmentRepository(IConfiguration config)
    {
        _conn = config.GetConnectionString("DefaultConnection")!;
    }

    public List<EnrollmentResponseDto> GetAll()
    {
        var list = new List<EnrollmentResponseDto>();

        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("GetEnrollmentDetails", conn);

        cmd.CommandType = CommandType.StoredProcedure;

        conn.Open();

        using SqlDataReader reader = cmd.ExecuteReader();

        while (reader.Read())
        {
            list.Add(new EnrollmentResponseDto
            {
                EnrollmentID = Convert.ToInt32(reader["EnrollmentID"]),
                StudentName = reader["StudentName"].ToString() ?? "",
                CourseName = reader["CourseName"].ToString() ?? "",
                EnrollmentDate = Convert.ToDateTime(reader["EnrollmentDate"])
            });
        }

        return list;
    }

    public PagedResultDto<EnrollmentResponseDto> GetPaged(int page, int pageSize, string? search)
    {
        var enrollments = new List<EnrollmentResponseDto>();
        var totalCount = 0;

        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("GetEnrollmentsPaged", conn);

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
            enrollments.Add(new EnrollmentResponseDto
            {
                EnrollmentID = Convert.ToInt32(reader["EnrollmentID"]),
                StudentName = reader["StudentName"]?.ToString() ?? "",
                CourseName = reader["CourseName"]?.ToString() ?? "",
                EnrollmentDate = Convert.ToDateTime(reader["EnrollmentDate"])
            });
        }

        if (reader.NextResult() && reader.Read())
        {
            totalCount = Convert.ToInt32(reader["TotalCount"]);
        }

        return new PagedResultDto<EnrollmentResponseDto>
        {
            Items = enrollments,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public EnrollmentDetailDto? GetById(int id)
    {
        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("GetEnrollmentByID", conn);

        cmd.CommandTimeout = 30;
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@EnrollmentID", SqlDbType.Int).Value = id;

        conn.Open();

        using SqlDataReader reader = cmd.ExecuteReader();

        if (!reader.Read())
            return null;

        return new EnrollmentDetailDto
        {
            EnrollmentID = Convert.ToInt32(reader["EnrollmentID"]),
            StudentID = Convert.ToInt32(reader["StudentID"]),
            StudentName = reader["StudentName"]?.ToString() ?? "",
            StudentEmail = reader["StudentEmail"]?.ToString() ?? "",
            CourseID = Convert.ToInt32(reader["CourseID"]),
            CourseName = reader["CourseName"]?.ToString() ?? "",
            Fee = Convert.ToDecimal(reader["Fee"]),
            DurationWeeks = Convert.ToInt32(reader["DurationWeeks"]),
            EnrollmentDate = Convert.ToDateTime(reader["EnrollmentDate"]),
            Status = ReadString(reader, "Status") ?? "Active",
            AmountPaid = ReadDecimal(reader, "AmountPaid") ?? Convert.ToDecimal(reader["Fee"]),
            BalanceDue = ReadDecimal(reader, "BalanceDue") ?? 0
        };
    }

    private static string? ReadString(SqlDataReader reader, string columnName)
    {
        if (!HasColumn(reader, columnName) || reader[columnName] == DBNull.Value)
            return null;

        return reader[columnName]?.ToString();
    }

    private static decimal? ReadDecimal(SqlDataReader reader, string columnName)
    {
        if (!HasColumn(reader, columnName) || reader[columnName] == DBNull.Value)
            return null;

        return Convert.ToDecimal(reader[columnName]);
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

    public void Add(Enrollment enrollment)
    {
        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("EnrollStudent", conn);

        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@StudentID", SqlDbType.Int).Value = enrollment.StudentID;
        cmd.Parameters.Add("@CourseID", SqlDbType.Int).Value = enrollment.CourseID;

        conn.Open();

        try
        {
            cmd.ExecuteNonQuery();
        }
        catch (SqlException)
        {
            throw new BadRequestException("Invalid enrollment request");
        }
    }

    public bool Delete(int id)
    {
        using SqlConnection conn = new SqlConnection(_conn);
        using SqlCommand cmd = new SqlCommand("RemoveEnrollment", conn);
        cmd.CommandTimeout = 30;
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@EnrollmentID", SqlDbType.Int).Value = id;

        conn.Open();

        int rows = cmd.ExecuteNonQuery();

        return rows > 0;
    }
}
