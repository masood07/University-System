import { Component, inject, OnInit, signal } from '@angular/core';
import { IStudent } from '../../../models/i-student';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../../_services/student-service';
import { ActivatedRoute, Router } from '@angular/router';
import { IDepartment } from '../../../models/idepartment';
import { DepartmentService } from '../../../_services/department-service';

@Component({
  selector: 'app-student-add',
  imports: [FormsModule],
  templateUrl: './student-add.html',
  styleUrl: './student-add.css',
})
export class StudentAdd implements OnInit
{
  depts=signal<IDepartment[]>([]);
  deptSer=inject(DepartmentService);
  route = inject(ActivatedRoute);
  isEditMode = false;
  router=inject(Router);
  stdSer=inject(StudentService)
  std:IStudent={}

  ngOnInit(): void {
    this.deptSer.getAll().subscribe(
      d=>{this.depts.set(d); console.log(d);}
    );

    this.route.paramMap.subscribe((params) => {
      const rawId = params.get('id');
      const id = rawId ? Number(rawId) : NaN;

      if (!Number.isFinite(id)) {
        this.isEditMode = false;
        this.std = {};
        return;
      }

      this.isEditMode = true;

      const navigationState = this.router.getCurrentNavigation()?.extras.state ?? history.state;
      const prefill = navigationState?.student as IStudent | undefined;
      if (prefill?.id === id) {
        this.std = {
          id: prefill.id,
          name: prefill.name,
          age: prefill.age,
          address: prefill.address,
          deptid: prefill.deptid,
        };
      }

      this.stdSer.getById(id).subscribe((s) => {
        this.std = {
          id: s.id,
          name: s.name,
          age: s.age,
          address: s.address,
          deptid: s.deptid,
        };
      });
    });
  }

  save(){
    if (this.isEditMode && this.std.id) {
      this.stdSer.update(this.std).subscribe(() => {
        this.router.navigateByUrl("/students");
      });
      return;
    }

    this.stdSer.Add(this.std).subscribe(() => {
      this.router.navigateByUrl("/students");
    });
  }
}
