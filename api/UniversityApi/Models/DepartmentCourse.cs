using System.ComponentModel.DataAnnotations.Schema;

namespace Day4.Models;

[Table("DepartmentCourse")]
public class DepartmentCourse
{
    public int DepartmentId { get; set; }
    public int CourseId { get; set; }

    [ForeignKey(nameof(DepartmentId))]
    public Department Department { get; set; }

    [ForeignKey(nameof(CourseId))]
    public Course Course { get; set; }
}
