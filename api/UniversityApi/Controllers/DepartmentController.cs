using AutoMapper;
using Day4.DTOs.DepartmentDTO;
using Day4.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Day4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        public DepartmentController(ITIContext db ,IMapper _map)
        {
            Db = db;
            Map = _map;
        }

        public ITIContext Db { get; }
        public IMapper Map { get; }

        [HttpGet]
        public ActionResult getall()
        {
            var data = Db.Departments
                .Include(n => n.DepartmentCourses)
                .ThenInclude(n => n.Course)
                .Select(n => new
                {
                    id = n.ID,
                    name = n.name,
                    location = n.Loc,
                    departmentCourses = n.DepartmentCourses.Select(dc => new
                    {
                        courseId = dc.CourseId,
                        course = new
                        {
                            id = dc.Course.ID,
                            name = dc.Course.Name
                        }
                    }).ToList()
                })
                .ToList();

            return Ok(data);
        }
        [HttpGet("{id}")]
        public ActionResult getbyid(int id)
        {
            Department d= Db.Departments
                .Include(n => n.Students)
                .Include(n => n.DepartmentCourses)
                .ThenInclude(n => n.Course)
                .FirstOrDefault(n => n.ID == id);
            if (d == null) return NotFound();
            //ReadDepartmentDTO dDTO = new ReadDepartmentDTO()
            //{
            //    id = d.ID,
            //    name = d.name,
            //    location = d.Loc,
            //    studentNames=d.Students.Select(n=>n.name).ToList()
            //};
            ReadDepartmentDTO dDTO = Map.Map<ReadDepartmentDTO>(d);
            return Ok(dDTO);
        }

        [HttpPost]
        public ActionResult add(WriteDepartmentDTO d)
        {
            if (d == null) return BadRequest();

            Department dep = new Department
            {
                name = d.name,
                Loc = d.location ?? d.loc
            };

            Db.Departments.Add(dep);
            Db.SaveChanges();
            return CreatedAtAction("getbyid", new { id = dep.ID }, dep);
        }

        [HttpPut("{id}")]
        public ActionResult update(int id, WriteDepartmentDTO d)
        {
            if (d == null) return BadRequest();

            Department old = Db.Departments.Find(id);
            if (old == null) return NotFound();

            old.name = d.name;
            old.Loc = d.location ?? d.loc;

            Db.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult delete(int id)
        {
            Department d = Db.Departments.Find(id);
            if (d == null) return NotFound();

            bool hasLinkedStudents = Db.Students.Any(n => n.deptid == id);
            if (hasLinkedStudents)
            {
                return Conflict(new
                {
                    message = "Cannot delete department because it is linked to students. Remove or reassign those students first."
                });
            }

            var depCourses = Db.DepartmentCourses.Where(n => n.DepartmentId == id).ToList();
            if (depCourses.Any()) Db.DepartmentCourses.RemoveRange(depCourses);

            Db.Departments.Remove(d);
            try
            {
                Db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                return Conflict(new
                {
                    message = "Cannot delete department because it is linked to other entities. Remove these links first."
                });
            }

            return Ok(d);
        }

        [HttpPost("{departmentId}/courses")]
        public ActionResult addCoursesToDepartment(int departmentId, [FromBody] List<int> courseIds)
        {
            Department d = Db.Departments.Find(departmentId);
            if (d == null) return NotFound("department not found");
            if (courseIds == null || courseIds.Count == 0) return BadRequest("courseIds is required");

            var validCourses = Db.Courses.Where(n => courseIds.Contains(n.ID)).Select(n => n.ID).ToList();
            foreach (var courseId in validCourses)
            {
                bool exists = Db.DepartmentCourses.Any(n => n.DepartmentId == departmentId && n.CourseId == courseId);
                if (!exists)
                {
                    Db.DepartmentCourses.Add(new DepartmentCourse
                    {
                        DepartmentId = departmentId,
                        CourseId = courseId
                    });
                }
            }

            Db.SaveChanges();
            return Ok();
        }

        [HttpDelete("{departmentId}/courses")]
        public ActionResult removeCoursesFromDepartment(int departmentId, [FromBody] List<int> courseIds)
        {
            if (courseIds == null || courseIds.Count == 0) return BadRequest("courseIds is required");

            var rows = Db.DepartmentCourses
                .Where(n => n.DepartmentId == departmentId && courseIds.Contains(n.CourseId))
                .ToList();

            if (rows.Count == 0) return NotFound();

            Db.DepartmentCourses.RemoveRange(rows);
            Db.SaveChanges();
            return Ok();
        }
    }
}
