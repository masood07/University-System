import { Component } from '@angular/core';
import {Validators,FormGroup,FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { required } from '@angular/forms/signals';

@Component({
  selector: 'app-testform1',
  imports: [ReactiveFormsModule],
  templateUrl: './testform1.html',
  styleUrl: './testform1.css',
})
export class Testform1 {
  model=new FormGroup({
    id:new FormControl(10,Validators.required),
    name:new FormControl("ahmed"),
    age:new FormControl(20),
    skills:new FormArray([])

  });
  get skills(){
    return this.model.get('skills') as FormArray;
  }
  get id(){
    return this.model.get('id') as FormControl;
  }
  addskill(){
    this.skills.push(new FormControl());
  }

  update(){
    this.model.patchValue({
      id:50
    })
  }
  onsubmit(){
    console.log(this.model.value)
  }
}
