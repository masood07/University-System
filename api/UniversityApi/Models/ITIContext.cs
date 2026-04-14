using Day4.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Day4.Models
{
    public class ITIContext:IdentityDbContext<User>
    {
        //public ITIContext()
        //{
            
        //}
        public ITIContext(DbContextOptions<ITIContext> option):base(option)
        {
            
        }

        public virtual  DbSet<User> Users { get; set; }
        public DbSet<Student>    Students { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<DepartmentCourse> DepartmentCourses { get; set; }
        public DbSet<StudentCourse> StudentCourses { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<DepartmentCourse>().HasKey(n => new { n.DepartmentId, n.CourseId });
            builder.Entity<StudentCourse>().HasKey(n => new { n.StudentId, n.CourseId });

            builder.Entity<IdentityRole>().HasData(

                new IdentityRole() { Id = "1", Name = "student", NormalizedName = "STUDENT", ConcurrencyStamp = "1" },
                new IdentityRole() { Id = "2", Name = "teacher", NormalizedName = "TEACHER", ConcurrencyStamp = "2" },
                new IdentityRole() { Id = "3", Name = "parent", NormalizedName = "PARENT", ConcurrencyStamp = "3" }
                );


        }
    }
}
