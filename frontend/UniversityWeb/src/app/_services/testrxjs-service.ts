import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestrxjsService {

  createObservable(){
      return interval(1000)
    
    
      let ds=new Observable<number>(observer=>{
      setTimeout(() => {
        observer.next(100);
      }, 1000);

      setTimeout(() => {
        observer.next(200);
      }, 2000);

      
      setTimeout(() => {
        observer.error("backend disconnected");
      }, 4000);

    setTimeout(() => {
        observer.next(500);
      }, 5000);
       setTimeout(() => {
        observer.complete()
      }, 6000);





    });


    return ds;

  }
}
