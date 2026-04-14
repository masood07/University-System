using System.ComponentModel.DataAnnotations.Schema;

namespace Day4.Models;

[Table("StudentCourse")]
public class StudentCourse
{
    public int StudentId { get; set; }
    public int CourseId { get; set; }
    public int Degree { get; set; }

    [ForeignKey(nameof(StudentId))]
    public Student Student { get; set; }

    [ForeignKey(nameof(CourseId))]
    public Course Course { get; set; }
}
