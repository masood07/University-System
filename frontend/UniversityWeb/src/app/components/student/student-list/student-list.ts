import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { IStudent } from '../../../models/i-student';

import { StudentService } from '../../../_services/student-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-student-list',
  imports: [RouterLink],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
 // providers:[{provide:StudentService,useClass:StudentService}]
})
export class StudentList implements OnInit
{
  
  ngOnInit(): void {
   this.stdService.getAll().subscribe(
    {
      next:d=>{
       this.students.set(d);
        console.log(d);
      }
    }
   )

  }

  students=signal<IStudent[]>([]);

  statusMessage = signal('');
  isError = signal(false);

  stdService=inject(StudentService);

  remove(student: IStudent){
    const id = student?.id;
    if(!id) return;

    const label = student?.name?.trim() || `ID ${id}`;
    const ok = confirm(`Are you sure you want to delete ${label}?`);
    if (!ok) return;

    this.stdService.delete(id).subscribe({
      next: () => {
        this.students.update(list=>list.filter(n=>n.id!==id));
        this.setStatus('Student deleted successfully.');
      },
      error: (err: HttpErrorResponse) => {
        if (this.isForeignKeyConflict(err)) {
          this.setStatus('Cannot delete student because course records exist for this student. Remove student-course records first.', true);
          return;
        }

        this.setStatus('Failed to delete student. Please try again.', true);
      }
    })
  }

  setStatus(message: string, error = false) {
    this.statusMessage.set(message);
    this.isError.set(error);
  }

  private isForeignKeyConflict(err: HttpErrorResponse) {
    const raw = (err?.error?.message ?? err?.error ?? err?.message ?? '').toString().toLowerCase();
    return err.status === 409 || raw.includes('foreign key') || raw.includes('reference constraint');
  }

}
