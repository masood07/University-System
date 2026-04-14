using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Day4.Models;

[Table("Course")]
public class Course
{
    [Key]
    public int ID { get; set; }

    [StringLength(100)]
    public string Name { get; set; }

    public int? MaxDegree { get; set; }

    [InverseProperty("Course")]
    public virtual ICollection<DepartmentCourse> DepartmentCourses { get; set; } = new List<DepartmentCourse>();

    [InverseProperty("Course")]
    public virtual ICollection<StudentCourse> StudentCourses { get; set; } = new List<StudentCourse>();
}
