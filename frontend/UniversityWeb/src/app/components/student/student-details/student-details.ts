import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { IStudent } from '../../../models/i-student';
import { StudentService } from '../../../_services/student-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-details',
  imports: [RouterLink],
  templateUrl: './student-details.html',
  styleUrl: './student-details.css',
})
export class StudentDetails implements OnInit,OnDestroy
 {
  ngOnDestroy(): void {
   this.sub?.unsubscribe();
  }
 

 //stdid=input(0);
 stdService=inject(StudentService)
 activtedRoute=inject(ActivatedRoute);

 sub:Subscription|null=null;
  ngOnInit(): void {
   this.sub= this.activtedRoute.params.subscribe(a=>{
     this.stdService.getById(a['id']).subscribe(
      d=>{
        console.log(d);
        this.std.set(d);
      }
     )

    })
      //let id=this.activtedRoute.snapshot.params['id'];
  }
 std=signal<IStudent>({});
 /*=computed(()=>{
    return this.stdService.getById(this.stdid())
 })*/
 

}
