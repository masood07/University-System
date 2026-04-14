using AutoMapper;
using Day4.DTOs.StudentDTO;
using Day4.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Day4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class studentsController : ControllerBase
    {
        ITIContext db;
        IMapper _map;
        public studentsController(ITIContext db ,IMapper _map)
        {
            this.db = db;
            this._map = _map;
        }

        [HttpGet,Authorize(Roles ="student")]
        public ActionResult Getall()
        {
            List<Student> sts= db.Students.Include(s=>s.dept).ToList();

            //List<ReadStudentDTO> stsDTO = new List<ReadStudentDTO>();

            //foreach (var s in sts)
            //{
            //    ReadStudentDTO sDTO = new ReadStudentDTO()
            //    {
            //        id = s.ID,
            //        name = s.name,
            //        age = s.age,
            //        address = s.adddress,
            //        departmentName = s.dept.name
            //    };
            //    stsDTO.Add(sDTO);
            //}
            List<ReadStudentDTO> stsDTO = _map.Map<List<ReadStudentDTO>>(sts);
            return Ok(stsDTO);
        }
        
        [HttpGet("{id:int}")]
        [Produces("application/json")]

        public ActionResult getbyid(int id)
        {
           Student s= db.Students.Include(s=>s.dept).Where(n => n.ID == id).FirstOrDefault();
            if (s == null) return NotFound();
            //ReadStudentDTO stDTO = new ReadStudentDTO()
            //{
            //    id = s.ID,
            //    name = s.name,
            //    age = s.age,
            //    address = s.adddress,
            //    departmentName = s.dept.name
            //};
          ReadStudentDTO stDTO =  _map.Map<ReadStudentDTO>(s);
             return Ok(stDTO);
        }
      //  [HttpGet("/api/sts/{name}")]
        [HttpGet("{name:alpha}")]

        public ActionResult getbyname(string name)
        {
            Student s = db.Students.Include(s=>s.dept).Where(n => n.name==name).FirstOrDefault();
            if (s == null) return NotFound();
            ReadStudentDTO stDTO = new ReadStudentDTO()
            {
                id = s.ID,
                name = s.name,
                age = s.age,
                address = s.adddress,
                departmentName = s.dept.name
            };

            return Ok(stDTO);
        }

        [HttpPost]
        [Consumes("application/json")]
        public ActionResult add(AddStudentDTO sdto)
        {
            if (sdto == null) return BadRequest();
            if(!ModelState.IsValid) return BadRequest(ModelState);
            Student s = new Student()
            {
                name = sdto.name,
                age = sdto.age,
                adddress = sdto.address,
                deptid = sdto.deptid
            };

            db.Students.Add(s);
            db.SaveChanges();
            // return Created("ay7aga", s);
            return CreatedAtAction("getbyid", new { id = s.ID }, new
            {
                id = s.ID,
                name = s.name,
                age = s.age,
                address = s.adddress,
                deptid = s.deptid
            });
        }

        [HttpPut("{id}")]
        public ActionResult update(int id, AddStudentDTO sdto)
        {
            if (sdto == null) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);

            Student old = db.Students.FirstOrDefault(n => n.ID == id);
            if (old == null) return NotFound();

            old.name = sdto.name;
            old.age = sdto.age;
            old.adddress = sdto.address;
            old.deptid = sdto.deptid;

            db.SaveChanges();
            return NoContent();
        }


        [HttpDelete("{id}")]
        public ActionResult delete(int id)
        {
            Student s=db.Students.FirstOrDefault(n=>n.ID == id);
            if (s == null) return NotFound();
            db.Students.Remove(s);
            db.SaveChanges();
            return Ok(s);
        }

        [HttpPost("{studentId}/courses/{courseId}/degree/{degree}")]
        public ActionResult addOrUpdateDegree(int studentId, int courseId, int degree)
        {
            var student = db.Students.Find(studentId);
            if (student == null) return NotFound("student not found");

            var course = db.Courses.Find(courseId);
            if (course == null) return NotFound("course not found");

            var rel = db.StudentCourses.FirstOrDefault(n => n.StudentId == studentId && n.CourseId == courseId);
            if (rel == null)
            {
                rel = new StudentCourse
                {
                    StudentId = studentId,
                    CourseId = courseId,
                    Degree = degree
                };
                db.StudentCourses.Add(rel);
            }
            else
            {
                rel.Degree = degree;
            }

            db.SaveChanges();
            return Ok(new
            {
                studentId = rel.StudentId,
                courseId = rel.CourseId,
                degree = rel.Degree
            });
        }

        [HttpGet("by-course-department")]
        public ActionResult getStudentsByCourseAndDepartment([FromQuery] int courseId, [FromQuery] int deptId)
        {
            var result = db.StudentCourses
                .Include(n => n.Student)
                .Where(n => n.CourseId == courseId && n.Student.deptid == deptId)
                .Select(n => new
                {
                    studentId = n.StudentId,
                    studentName = n.Student.name,
                    degree = n.Degree,
                    courseId = n.CourseId,
                    departmentId = deptId
                })
                .ToList();

            return Ok(result);
        }

        [HttpGet("by-department/{deptId:int}")]
        public ActionResult getStudentsByDepartment(int deptId)
        {
            var data = db.Students
                .Include(n => n.dept)
                .Where(n => n.deptid == deptId)
                .Select(n => new
                {
                    id = n.ID,
                    name = n.name,
                    age = n.age,
                    address = n.adddress,
                    deptid = n.deptid,
                    departmentName = n.dept != null ? n.dept.name : null
                })
                .ToList();

            return Ok(data);
        }


        [HttpPost("{id}")]
        public ActionResult test([FromQuery]int id ,[FromBody] string name )
        {
            return Ok();
        }

    }
}
