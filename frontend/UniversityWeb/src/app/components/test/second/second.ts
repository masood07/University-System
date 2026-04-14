import { Component, inject, OnDestroy } from '@angular/core';
import { TestrxjsService } from '../../../_services/testrxjs-service';
import { filter, map, skip, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-second',
  imports: [],
  templateUrl: './second.html',
  styleUrl: './second.css',
})
export class Second implements OnDestroy
{
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
  n=0;
  testrxjsSer=inject(TestrxjsService);
  sub:Subscription|null=null;
  stop(){
    this.sub?.unsubscribe();
  }
  start(){
   this.sub= this.testrxjsSer.createObservable()
   .pipe(
   // filter(d=>d%2==0),
   //skip(5),
    map(d=>d*2)
    
   )
   .subscribe({
      next: d=>{console.log(d)},
      complete: ()=>{console.log("completed")},
      error:er=>{console.log(er+" error occurred")}
    });
    console.log("complettttt");
  }

}
