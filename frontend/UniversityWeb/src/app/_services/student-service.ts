import { inject, Injectable } from '@angular/core';
import { IStudent } from '../models/i-student';
import { HttpClient } from '@angular/common/http';
import { IStudentCourseResult } from '../models/i-student-course-result';


@Injectable(
  {
  providedIn:'root',
}
)
export class StudentService {
  http=inject(HttpClient)
  private baseurl="https://localhost:7030/api/students/";
 private students:IStudent[]=[];
    getAll(){
     return  this.http.get<IStudent[]>(this.baseurl)
    }
    Add(std:IStudent){
      return this.http.post<IStudent>(this.baseurl,std);
    }
    getById(id:number){
      return this.http.get<IStudent>(this.baseurl+id);
    }
    update(std:IStudent){
      return this.http.put(this.baseurl+std.id,std);
    }
    delete(id:number){
      return this.http.delete(this.baseurl+id);
    }

    addOrUpdateDegree(studentId:number,courseId:number,degree:number){
      return this.http.post(this.baseurl+studentId+"/courses/"+courseId+"/degree/"+degree,{});
    }

    getByCourseDepartment(courseId:number,deptId:number){
      return this.http.get<IStudentCourseResult[]>(this.baseurl+"by-course-department?courseId="+courseId+"&deptId="+deptId);
    }

    getByDepartment(deptId:number){
      return this.http.get<IStudent[]>(this.baseurl+"by-department/"+deptId);
    }
}
