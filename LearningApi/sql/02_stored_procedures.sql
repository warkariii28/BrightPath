USE LearningDB;
GO

CREATE OR ALTER PROCEDURE dbo.GetAllStudents
AS
BEGIN
    SET NOCOUNT ON;

    SELECT StudentID, Name, Email
    FROM dbo.Students
    ORDER BY StudentID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetStudentsPaged
    @Page INT,
    @PageSize INT,
    @Search NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT StudentID, Name, Email
    FROM dbo.Students
    WHERE @Search IS NULL
        OR Name LIKE '%' + @Search + '%'
        OR Email LIKE '%' + @Search + '%'
    ORDER BY StudentID
    OFFSET (@Page - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;

    SELECT COUNT(*) AS TotalCount
    FROM dbo.Students
    WHERE @Search IS NULL
        OR Name LIKE '%' + @Search + '%'
        OR Email LIKE '%' + @Search + '%';
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetStudentByID
    @StudentID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT StudentID, Name, Email
    FROM dbo.Students
    WHERE StudentID = @StudentID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetStudentProfile
    @StudentID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT StudentID, Name, Email, CreatedAt
    FROM dbo.Students
    WHERE StudentID = @StudentID;

    SELECT
        e.EnrollmentID,
        c.CourseID,
        c.CourseName,
        c.Fee,
        c.DurationWeeks,
        e.EnrollmentDate
    FROM dbo.Enrollments e
        INNER JOIN dbo.Courses c ON c.CourseID = e.CourseID
    WHERE e.StudentID = @StudentID
    ORDER BY e.EnrollmentDate DESC, e.EnrollmentID DESC;
END;
GO

CREATE OR ALTER PROCEDURE dbo.AddStudent
    @Name NVARCHAR(100),
    @Email NVARCHAR(256)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Students
        (Name, Email)
    VALUES
        (@Name, @Email);

    SELECT CONVERT(INT, SCOPE_IDENTITY()) AS StudentID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.UpdateStudent
    @StudentID INT,
    @Name NVARCHAR(100),
    @Email NVARCHAR(256)
AS
BEGIN
    SET NOCOUNT OFF;

    UPDATE dbo.Students
    SET Name = @Name,
        Email = @Email
    WHERE StudentID = @StudentID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.RemoveStudent
    @StudentID INT
AS
BEGIN
    SET NOCOUNT OFF;

    DELETE FROM dbo.Students
    WHERE StudentID = @StudentID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetAllCourses
AS
BEGIN
    SET NOCOUNT ON;

    SELECT CourseID, CourseName, Fee, DurationWeeks
    FROM dbo.Courses
    ORDER BY CourseID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetCoursesPaged
    @Page INT,
    @PageSize INT,
    @Search NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT CourseID, CourseName, Fee, DurationWeeks
    FROM dbo.Courses
    WHERE @Search IS NULL
        OR CourseName LIKE '%' + @Search + '%'
    ORDER BY CourseID
    OFFSET (@Page - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;

    SELECT COUNT(*) AS TotalCount
    FROM dbo.Courses
    WHERE @Search IS NULL
        OR CourseName LIKE '%' + @Search + '%';
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetCourseByID
    @CourseID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT CourseID, CourseName, Fee, DurationWeeks
    FROM dbo.Courses
    WHERE CourseID = @CourseID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetCourseProfile
    @CourseID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT CourseID, CourseName, Fee, DurationWeeks, CreatedAt
    FROM dbo.Courses
    WHERE CourseID = @CourseID;

    SELECT
        e.EnrollmentID,
        s.StudentID,
        s.Name AS StudentName,
        s.Email,
        e.EnrollmentDate
    FROM dbo.Enrollments e
        INNER JOIN dbo.Students s ON s.StudentID = e.StudentID
    WHERE e.CourseID = @CourseID
    ORDER BY e.EnrollmentDate DESC, e.EnrollmentID DESC;
END;
GO

CREATE OR ALTER PROCEDURE dbo.AddCourse
    @CourseName NVARCHAR(200),
    @Fee DECIMAL(18,2),
    @DurationWeeks INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Courses
        (CourseName, Fee, DurationWeeks)
    VALUES
        (@CourseName, @Fee, @DurationWeeks);

    SELECT CONVERT(INT, SCOPE_IDENTITY()) AS CourseID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.UpdateCourse
    @CourseID INT,
    @CourseName NVARCHAR(200),
    @Fee DECIMAL(18,2),
    @DurationWeeks INT
AS
BEGIN
    SET NOCOUNT OFF;

    UPDATE dbo.Courses
    SET CourseName = @CourseName,
        Fee = @Fee,
        DurationWeeks = @DurationWeeks
    WHERE CourseID = @CourseID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.RemoveCourse
    @CourseID INT
AS
BEGIN
    SET NOCOUNT OFF;

    DELETE FROM dbo.Courses
    WHERE CourseID = @CourseID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetEnrollmentDetails
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        e.EnrollmentID,
        s.Name AS StudentName,
        c.CourseName,
        e.EnrollmentDate
    FROM dbo.Enrollments e
        INNER JOIN dbo.Students s ON s.StudentID = e.StudentID
        INNER JOIN dbo.Courses c ON c.CourseID = e.CourseID
    ORDER BY e.EnrollmentID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetEnrollmentByID
    @EnrollmentID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        e.EnrollmentID,
        s.StudentID,
        s.Name AS StudentName,
        s.Email AS StudentEmail,
        c.CourseID,
        c.CourseName,
        c.Fee,
        c.DurationWeeks,
        e.EnrollmentDate,
        N'Active' AS Status,
        c.Fee AS AmountPaid,
        CONVERT(DECIMAL(18,2), 0) AS BalanceDue
    FROM dbo.Enrollments e
        INNER JOIN dbo.Students s ON s.StudentID = e.StudentID
        INNER JOIN dbo.Courses c ON c.CourseID = e.CourseID
    WHERE e.EnrollmentID = @EnrollmentID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetDashboardAnalytics
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        (SELECT COUNT(*) FROM dbo.Students) AS TotalStudents,
        (SELECT COUNT(*) FROM dbo.Courses) AS TotalCourses,
        (SELECT COUNT(*) FROM dbo.Enrollments) AS TotalEnrollments,
        COALESCE((
            SELECT SUM(c.Fee)
            FROM dbo.Enrollments e
                INNER JOIN dbo.Courses c ON c.CourseID = e.CourseID
        ), 0) AS TotalRevenue,
        (
            SELECT COUNT(*)
            FROM dbo.AdminAuditLogs
            WHERE CreatedAt >= DATEADD(DAY, -7, SYSUTCDATETIME())
        ) AS AdminActionsThisWeek;

    SELECT TOP (5)
        e.EnrollmentID,
        s.Name AS StudentName,
        c.CourseName,
        e.EnrollmentDate
    FROM dbo.Enrollments e
        INNER JOIN dbo.Students s ON s.StudentID = e.StudentID
        INNER JOIN dbo.Courses c ON c.CourseID = e.CourseID
    ORDER BY e.EnrollmentDate DESC, e.EnrollmentID DESC;

    SELECT TOP (5)
        c.CourseID,
        c.CourseName,
        COUNT(e.EnrollmentID) AS EnrollmentCount,
        COUNT(e.EnrollmentID) * c.Fee AS Revenue
    FROM dbo.Courses c
        LEFT JOIN dbo.Enrollments e ON e.CourseID = c.CourseID
    GROUP BY c.CourseID, c.CourseName, c.Fee
    ORDER BY EnrollmentCount DESC, c.CourseName;

    SELECT
        FORMAT(CreatedAt, 'yyyy-MM') AS Period,
        COUNT(*) AS StudentCount
    FROM dbo.Students
    WHERE CreatedAt >= DATEADD(MONTH, -6, SYSUTCDATETIME())
    GROUP BY FORMAT(CreatedAt, 'yyyy-MM')
    ORDER BY Period;

    SELECT TOP (5)
        StudentID,
        Name,
        Email,
        CreatedAt
    FROM dbo.Students
    ORDER BY CreatedAt DESC, StudentID DESC;

    SELECT TOP (5)
        l.AuditLogID,
        u.Username AS AdminName,
        l.Action,
        l.EntityName,
        l.EntityID,
        l.CreatedAt
    FROM dbo.AdminAuditLogs l
        INNER JOIN dbo.Users u ON u.UserID = l.AdminUserID
    ORDER BY l.CreatedAt DESC, l.AuditLogID DESC;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetEnrollmentsPaged
    @Page INT,
    @PageSize INT,
    @Search NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        e.EnrollmentID,
        s.Name AS StudentName,
        c.CourseName,
        e.EnrollmentDate
    FROM dbo.Enrollments e
        INNER JOIN dbo.Students s ON s.StudentID = e.StudentID
        INNER JOIN dbo.Courses c ON c.CourseID = e.CourseID
    WHERE @Search IS NULL
        OR s.Name LIKE '%' + @Search + '%'
        OR c.CourseName LIKE '%' + @Search + '%'
    ORDER BY e.EnrollmentID
    OFFSET (@Page - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;

    SELECT COUNT(*) AS TotalCount
    FROM dbo.Enrollments e
        INNER JOIN dbo.Students s ON s.StudentID = e.StudentID
        INNER JOIN dbo.Courses c ON c.CourseID = e.CourseID
    WHERE @Search IS NULL
        OR s.Name LIKE '%' + @Search + '%'
        OR c.CourseName LIKE '%' + @Search + '%';
END;
GO

CREATE OR ALTER PROCEDURE dbo.EnrollStudent
    @StudentID INT,
    @CourseID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1
    FROM dbo.Students
    WHERE StudentID = @StudentID)
        THROW 50001, 'Student not found', 1;

    IF NOT EXISTS (SELECT 1
    FROM dbo.Courses
    WHERE CourseID = @CourseID)
        THROW 50002, 'Course not found', 1;

    IF EXISTS (SELECT 1
    FROM dbo.Enrollments
    WHERE StudentID = @StudentID AND CourseID = @CourseID)
        THROW 50003, 'Student is already enrolled in this course', 1;

    INSERT INTO dbo.Enrollments
        (StudentID, CourseID)
    VALUES
        (@StudentID, @CourseID);
END;
GO

CREATE OR ALTER PROCEDURE dbo.RemoveEnrollment
    @EnrollmentID INT
AS
BEGIN
    SET NOCOUNT OFF;

    DELETE FROM dbo.Enrollments
    WHERE EnrollmentID = @EnrollmentID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.RegisterUsers
    @Username NVARCHAR(100),
    @Email NVARCHAR(256),
    @PasswordHash NVARCHAR(500),
    @Role NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Users
        (Username, Email, PasswordHash, Role)
    VALUES
        (@Username, @Email, @PasswordHash, @Role);
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetUserByEmail
    @Email NVARCHAR(256)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT UserID, Username, Email, PasswordHash, Role
    FROM dbo.Users
    WHERE Email = @Email;
END;
GO

CREATE OR ALTER PROCEDURE dbo.UpdateUserEmail
    @UserID INT,
    @Email NVARCHAR(256)
AS
BEGIN
    SET NOCOUNT OFF;

    UPDATE dbo.Users
    SET Email = @Email
    WHERE UserID = @UserID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.UpdateUserRole
    @UserID INT,
    @Role NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT OFF;

    UPDATE dbo.Users
    SET Role = @Role
    WHERE UserID = @UserID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetAllUsers
AS
BEGIN
    SET NOCOUNT ON;

    SELECT UserID, Username, Email, Role
    FROM dbo.Users
    ORDER BY UserID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.AddAdminAuditLog
    @AdminUserID INT,
    @Action NVARCHAR(100),
    @EntityName NVARCHAR(100),
    @EntityID INT = NULL,
    @Details NVARCHAR(500) = NULL,
    @IpAddress NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.AdminAuditLogs
        (
        AdminUserID,
        Action,
        EntityName,
        EntityID,
        Details,
        IpAddress
        )
    VALUES
        (
            @AdminUserID,
            @Action,
            @EntityName,
            @EntityID,
            @Details,
            @IpAddress
    );
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetAdminAuditLogs
    @Page INT,
    @PageSize INT,
    @Search NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        l.AuditLogID,
        l.AdminUserID,
        u.Username AS AdminName,
        u.Email AS AdminEmail,
        l.Action,
        l.EntityName,
        l.EntityID,
        l.Details,
        l.IpAddress,
        l.CreatedAt
    FROM dbo.AdminAuditLogs l
        INNER JOIN dbo.Users u ON u.UserID = l.AdminUserID
    WHERE @Search IS NULL
        OR u.Username LIKE '%' + @Search + '%'
        OR u.Email LIKE '%' + @Search + '%'
        OR l.Action LIKE '%' + @Search + '%'
        OR l.EntityName LIKE '%' + @Search + '%'
        OR l.Details LIKE '%' + @Search + '%'
    ORDER BY l.CreatedAt DESC
    OFFSET (@Page - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;

    SELECT COUNT(*) AS TotalCount
    FROM dbo.AdminAuditLogs l
        INNER JOIN dbo.Users u ON u.UserID = l.AdminUserID
    WHERE @Search IS NULL
        OR u.Username LIKE '%' + @Search + '%'
        OR u.Email LIKE '%' + @Search + '%'
        OR l.Action LIKE '%' + @Search + '%'
        OR l.EntityName LIKE '%' + @Search + '%'
        OR l.Details LIKE '%' + @Search + '%';
END;
GO

CREATE OR ALTER PROCEDURE dbo.CountAdmins
AS
BEGIN
    SET NOCOUNT ON;

    SELECT COUNT(*) AS AdminCount
    FROM dbo.Users
    WHERE Role = 'Admin';
END;
GO

CREATE OR ALTER PROCEDURE dbo.SaveRefreshToken
    @UserId INT,
    @TokenHash NVARCHAR(88),
    @ExpiresAt DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.RefreshTokens
        (UserId, TokenHash, ExpiresAt)
    VALUES
        (@UserId, @TokenHash, @ExpiresAt);
END;
GO

CREATE OR ALTER PROCEDURE dbo.RevokeRefreshToken
    @TokenHash NVARCHAR(88)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.RefreshTokens
    SET IsRevoked = 1
    WHERE TokenHash = @TokenHash;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetRefreshToken
    @TokenHash NVARCHAR(88)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT UserId, TokenHash, ExpiresAt
    FROM dbo.RefreshTokens
    WHERE TokenHash = @TokenHash
        AND IsRevoked = 0;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetUserByID
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT UserID, Username, Email, PasswordHash, Role
    FROM dbo.Users
    WHERE UserID = @UserID;
END;
GO

CREATE OR ALTER PROCEDURE dbo.CleanupExpiredRefreshTokens
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.RefreshTokens
    WHERE ExpiresAt < SYSUTCDATETIME();
END;
GO
CREATE OR ALTER PROCEDURE dbo.RevokeActiveRefreshTokensForUser
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.RefreshTokens
    SET IsRevoked = 1
    WHERE UserId = @UserId
        AND IsRevoked = 0;
END;
GO
