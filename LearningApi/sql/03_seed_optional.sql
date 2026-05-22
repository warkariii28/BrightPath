USE LearningDB;
GO

-- Delete all data while keeping table structure intact
/* 
DELETE FROM dbo.Enrollments;
DELETE FROM dbo.Students;
DELETE FROM dbo.Courses;

-- Reset identity values (optional)
DBCC CHECKIDENT ('dbo.Students', RESEED, 0);
DBCC CHECKIDENT ('dbo.Courses', RESEED, 0);
DBCC CHECKIDENT ('dbo.Enrollments', RESEED, 0);
GO */

IF NOT EXISTS (SELECT 1 FROM dbo.Students)
BEGIN
    INSERT INTO dbo.Students
        (Name, Email)
    VALUES
        (N'Atharv Warkari', N'atharv@email.com'),
        (N'Radhika Dixit', N'radhika@email.com'),
        (N'Amey Datar', N'amey@email.com'),
        (N'Anushka Shalu', N'anushka@email.com'),
        (N'Srushti More', N'srushti@email.com'),
        (N'Kaushal Tapray', N'kaushal@email.com'),

        (N'Rohan Patil', N'rohan.patil@email.com'),
        (N'Sneha Kulkarni', N'sneha.kulkarni@email.com'),
        (N'Aditya Joshi', N'aditya.joshi@email.com'),
        (N'Priya Deshmukh', N'priya.deshmukh@email.com'),
        (N'Omkar Shinde', N'omkar.shinde@email.com'),
        (N'Neha Pawar', N'neha.pawar@email.com'),
        (N'Saurabh Jadhav', N'saurabh.jadhav@email.com'),
        (N'Pooja Chavan', N'pooja.chavan@email.com'),
        (N'Yash Bhosale', N'yash.bhosale@email.com'),
        (N'Sakshi More', N'sakshi.more@email.com'),

        (N'Abhishek Kale', N'abhishek.kale@email.com'),
        (N'Tejas Ranade', N'tejas.ranade@email.com'),
        (N'Meera Apte', N'meera.apte@email.com'),
        (N'Kunal Gokhale', N'kunal.gokhale@email.com'),
        (N'Vaishnavi Patwardhan', N'vaishnavi.p@email.com'),
        (N'Harshal Thorat', N'harshal.thorat@email.com'),
        (N'Rutuja Bagul', N'rutuja.bagul@email.com'),
        (N'Aniket Salunkhe', N'aniket.salunkhe@email.com'),
        (N'Prajakta Shirole', N'prajakta.shirole@email.com'),
        (N'Nikhil Wagh', N'nikhil.wagh@email.com'),

        (N'Aishwarya Mane', N'aishwarya.mane@email.com'),
        (N'Parth Khedekar', N'parth.khedekar@email.com'),
        (N'Gauri Kulथे', N'gauri.kulthe@email.com'),
        (N'Akshay Sonawane', N'akshay.sonawane@email.com'),
        (N'Shreyas Nikam', N'shreyas.nikam@email.com'),
        (N'Tanvi Bhise', N'tanvi.bhise@email.com'),
        (N'Ritesh Gaikwad', N'ritesh.gaikwad@email.com'),
        (N'Komal Pathak', N'komal.pathak@email.com'),
        (N'Mayur Ingale', N'mayur.ingale@email.com'),
        (N'Divya Pande', N'divya.pande@email.com'),

        (N'Anand Kshirsagar', N'anand.k@email.com'),
        (N'Sonal Jagtap', N'sonal.jagtap@email.com'),
        (N'Rahul Borse', N'rahul.borse@email.com'),
        (N'Ketaki Damle', N'ketaki.damle@email.com'),
        (N'Vishal Rane', N'vishal.rane@email.com'),
        (N'Isha Purohit', N'isha.purohit@email.com'),
        (N'Mihir Oak', N'mihir.oak@email.com'),
        (N'Riya Mahajan', N'riya.mahajan@email.com'),
        (N'Pranav Nerkar', N'pranav.nerkar@email.com'),
        (N'Shravani Kute', N'shravani.kute@email.com'),

        (N'Aryan Choure', N'aryan.choure@email.com'),
        (N'Manasi Deshpande', N'manasi.deshpande@email.com'),
        (N'Jay Patankar', N'jay.patankar@email.com'),
        (N'Pallavi Shitole', N'pallavi.shitole@email.com'),
        (N'Viraj Khairnar', N'viraj.khairnar@email.com'),
        (N'Asmita Lokhande', N'asmita.lokhande@email.com'),
        (N'Chinmay Kulkarni', N'chinmay.kulkarni@email.com'),
        (N'Bhagyashree Kharat', N'bhagyashree.kharat@email.com'),
        (N'Sameer Dhumal', N'sameer.dhumal@email.com'),
        (N'Kritika Bendre', N'kritika.bendre@email.com');
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Courses)
BEGIN
    INSERT INTO dbo.Courses
        (CourseName, Fee, DurationWeeks)
    VALUES
        (N'Python Fundamentals', 3999.00, 8),
        (N'SQL Fundamentals', 4999.00, 8),
        (N'ASP.NET Core Web API', 8999.00, 8),
        (N'Angular Fundamentals', 6999.00, 6),
        (N'SQL Server Essentials', 5999.00, 4),
        (N'C# Programming Basics', 8999.00, 5),
        (N'Full Stack Project Workshop', 15999.00, 10),

        (N'Java Programming Masterclass', 7999.00, 8),
        (N'Data Structures and Algorithms', 9999.00, 10),
        (N'React JS Development', 7499.00, 6),
        (N'Node.js Backend Development', 8499.00, 7),
        (N'MongoDB Essentials', 5499.00, 4),
        (N'Git and GitHub Fundamentals', 2999.00, 2),
        (N'HTML CSS and JavaScript', 4999.00, 5),
        (N'Advanced C++ Programming', 8999.00, 8),
        (N'Object Oriented Programming', 5999.00, 4),
        (N'Linux System Administration', 9999.00, 6),

        (N'Cloud Computing with AWS', 12999.00, 8),
        (N'Azure Fundamentals', 10999.00, 6),
        (N'DevOps Essentials', 11999.00, 7),
        (N'Cyber Security Basics', 7999.00, 5),
        (N'Ethical Hacking Fundamentals', 13999.00, 8),
        (N'Machine Learning with Python', 14999.00, 10),
        (N'Data Science Bootcamp', 17999.00, 12),
        (N'Artificial Intelligence Basics', 11999.00, 8),
        (N'Android App Development', 9999.00, 8),
        (N'Flutter Cross Platform Development', 10999.00, 7);
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Enrollments)
BEGIN
    INSERT INTO dbo.Enrollments
        (StudentID, CourseID, EnrollmentDate)
    VALUES
        (1, 1, SYSUTCDATETIME()),
        (1, 2, SYSUTCDATETIME()),
        (2, 3, SYSUTCDATETIME()),
        (3, 1, SYSUTCDATETIME()),
        (4, 4, SYSUTCDATETIME()),
        (5, 5, SYSUTCDATETIME()),
        (6, 3, SYSUTCDATETIME()),

        (7, 6, SYSUTCDATETIME()),
        (8, 7, SYSUTCDATETIME()),
        (9, 8, SYSUTCDATETIME()),
        (10, 9, SYSUTCDATETIME()),
        (11, 10, SYSUTCDATETIME()),
        (12, 11, SYSUTCDATETIME()),
        (13, 12, SYSUTCDATETIME()),
        (14, 13, SYSUTCDATETIME()),
        (15, 14, SYSUTCDATETIME()),
        (16, 15, SYSUTCDATETIME()),

        (17, 16, SYSUTCDATETIME()),
        (18, 17, SYSUTCDATETIME()),
        (19, 18, SYSUTCDATETIME()),
        (20, 19, SYSUTCDATETIME()),
        (21, 20, SYSUTCDATETIME()),
        (22, 21, SYSUTCDATETIME()),
        (23, 22, SYSUTCDATETIME()),
        (24, 23, SYSUTCDATETIME()),
        (25, 24, SYSUTCDATETIME()),
        (26, 25, SYSUTCDATETIME()),

        (27, 26, SYSUTCDATETIME()),
        (28, 27, SYSUTCDATETIME()),
        (29, 5, SYSUTCDATETIME()),
        (30, 8, SYSUTCDATETIME()),
        (31, 11, SYSUTCDATETIME()),
        (32, 14, SYSUTCDATETIME()),
        (33, 17, SYSUTCDATETIME()),
        (34, 20, SYSUTCDATETIME()),
        (35, 23, SYSUTCDATETIME()),
        (36, 2, SYSUTCDATETIME()),

        (37, 4, SYSUTCDATETIME()),
        (38, 6, SYSUTCDATETIME()),
        (39, 9, SYSUTCDATETIME()),
        (40, 12, SYSUTCDATETIME()),
        (41, 15, SYSUTCDATETIME()),
        (42, 18, SYSUTCDATETIME()),
        (43, 21, SYSUTCDATETIME()),
        (44, 24, SYSUTCDATETIME()),
        (45, 27, SYSUTCDATETIME()),
        (46, 1, SYSUTCDATETIME()),

        (47, 3, SYSUTCDATETIME()),
        (48, 5, SYSUTCDATETIME()),
        (49, 7, SYSUTCDATETIME()),
        (50, 10, SYSUTCDATETIME()),
        (51, 13, SYSUTCDATETIME()),
        (52, 16, SYSUTCDATETIME()),
        (53, 19, SYSUTCDATETIME()),
        (54, 22, SYSUTCDATETIME()),
        (55, 25, SYSUTCDATETIME()),
        (56, 27, SYSUTCDATETIME());
END;
GO

-- Supplemental demo data for dashboards and ID detail pages.
-- This section is idempotent and works even when tables already contain partial data.
DECLARE @DemoStudents TABLE (Name NVARCHAR(100), Email NVARCHAR(256));
INSERT INTO @DemoStudents (Name, Email)
VALUES
    (N'Atharv Warkari', N'atharv@email.com'),
    (N'Radhika Dixit', N'radhika@email.com'),
    (N'Amey Datar', N'amey@email.com'),
    (N'Anushka Shalu', N'anushka@email.com'),
    (N'Srushti More', N'srushti@email.com');

INSERT INTO dbo.Students (Name, Email)
SELECT d.Name, d.Email
FROM @DemoStudents d
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.Students s
    WHERE s.Email = d.Email
);

DECLARE @DemoCourses TABLE (CourseName NVARCHAR(200), Fee DECIMAL(18,2), DurationWeeks INT);
INSERT INTO @DemoCourses (CourseName, Fee, DurationWeeks)
VALUES
    (N'Python Fundamentals', 3999.00, 8),
    (N'SQL Fundamentals', 4999.00, 8),
    (N'ASP.NET Core Web API', 8999.00, 8),
    (N'Angular Fundamentals', 6999.00, 6),
    (N'Full Stack Project Workshop', 15999.00, 10);

INSERT INTO dbo.Courses (CourseName, Fee, DurationWeeks)
SELECT d.CourseName, d.Fee, d.DurationWeeks
FROM @DemoCourses d
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.Courses c
    WHERE c.CourseName = d.CourseName
);

DECLARE @DemoEnrollments TABLE (StudentEmail NVARCHAR(256), CourseName NVARCHAR(200), DaysAgo INT);
INSERT INTO @DemoEnrollments (StudentEmail, CourseName, DaysAgo)
VALUES
    (N'atharv@email.com', N'Python Fundamentals', 1),
    (N'atharv@email.com', N'SQL Fundamentals', 3),
    (N'atharv@email.com', N'ASP.NET Core Web API', 8),
    (N'radhika@email.com', N'Angular Fundamentals', 2),
    (N'radhika@email.com', N'Full Stack Project Workshop', 12),
    (N'amey@email.com', N'Python Fundamentals', 5),
    (N'anushka@email.com', N'ASP.NET Core Web API', 4),
    (N'srushti@email.com', N'Angular Fundamentals', 7);

INSERT INTO dbo.Enrollments (StudentID, CourseID, EnrollmentDate)
SELECT
    s.StudentID,
    c.CourseID,
    DATEADD(DAY, -d.DaysAgo, SYSUTCDATETIME())
FROM @DemoEnrollments d
    INNER JOIN dbo.Students s ON s.Email = d.StudentEmail
    INNER JOIN dbo.Courses c ON c.CourseName = d.CourseName
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.Enrollments e
    WHERE e.StudentID = s.StudentID
      AND e.CourseID = c.CourseID
);

DECLARE @AdminUserID INT;

SELECT TOP (1) @AdminUserID = UserID
FROM dbo.Users
WHERE Role = N'Admin'
ORDER BY UserID;

IF @AdminUserID IS NOT NULL
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM dbo.AdminAuditLogs
        WHERE AdminUserID = @AdminUserID
          AND Action = N'DemoSeed'
          AND EntityName = N'Dashboard'
    )
    BEGIN
        INSERT INTO dbo.AdminAuditLogs
            (AdminUserID, Action, EntityName, EntityID, Details, IpAddress, CreatedAt)
        VALUES
            (@AdminUserID, N'DemoSeed', N'Dashboard', NULL, N'Demo records prepared for dashboard analytics', N'local-seed', SYSUTCDATETIME()),
            (@AdminUserID, N'CreateEnrollment', N'Enrollment', NULL, N'Sample enrollment activity added', N'local-seed', DATEADD(DAY, -1, SYSUTCDATETIME())),
            (@AdminUserID, N'UpdateCourse', N'Course', NULL, N'Sample course detail activity added', N'local-seed', DATEADD(DAY, -2, SYSUTCDATETIME()));
    END;
END;
GO
