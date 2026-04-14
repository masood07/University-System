import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDepartment } from '../models/idepartment';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {

  private baseurl="https://localhost:7030/api/Department/";
  http=inject(HttpClient);

  getAll(){
    return this.http.get<IDepartment[]>(this.baseurl);
  }

  getById(id:number){
    return this.http.get<IDepartment>(this.baseurl+id);
  }

  add(dep:IDepartment){
    return this.http.post<IDepartment>(this.baseurl,this.toApiPayload(dep));
  }

  update(dep:IDepartment){
    return this.http.put(this.baseurl+dep.id,this.toApiPayload(dep));
  }

  delete(id:number){
    return this.http.delete(this.baseurl+id);
  }

  addCourses(departmentId:number, courseIds:number[]){
    return this.http.post(this.baseurl+departmentId+"/courses",courseIds);
  }

  removeCourses(departmentId:number, courseIds:number[]){
    return this.http.delete(this.baseurl+departmentId+"/courses",{ body: courseIds });
  }

  private toApiPayload(dep: IDepartment) {
    const locationValue = dep.location ?? dep.loc;

    return {
      id: dep.id,
      name: dep.name,
      location: locationValue,
      loc: locationValue,
    };
  }

}
