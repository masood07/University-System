using Day4.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Day4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly ITIContext db;

        public CourseController(ITIContext db)
        {
            this.db = db;
        }

        [HttpGet]
        public ActionResult getall()
        {
            return Ok(db.Courses.ToList());
        }

        [HttpGet("{id}")]
        public ActionResult getbyid(int id)
        {
            var c = db.Courses.Find(id);
            if (c == null) return NotFound();
            return Ok(c);
        }

        [HttpPost]
        public ActionResult add(Course c)
        {
            if (c == null) return BadRequest();
            db.Courses.Add(c);
            db.SaveChanges();
            return CreatedAtAction("getbyid", new { id = c.ID }, c);
        }

        [HttpPut("{id}")]
        public ActionResult update(int id, Course c)
        {
            if (c == null || id != c.ID) return BadRequest();
            db.Entry(c).State = EntityState.Modified;
            db.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult delete(int id)
        {
            var c = db.Courses.Find(id);
            if (c == null) return NotFound();

            var deptLinks = db.DepartmentCourses.Where(n => n.CourseId == id).ToList();
            if (deptLinks.Any()) db.DepartmentCourses.RemoveRange(deptLinks);

            var studentLinks = db.StudentCourses.Where(n => n.CourseId == id).ToList();
            if (studentLinks.Any()) db.StudentCourses.RemoveRange(studentLinks);

            db.Courses.Remove(c);
            db.SaveChanges();
            return Ok(c);
        }
    }
}
