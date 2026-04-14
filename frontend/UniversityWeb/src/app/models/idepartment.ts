export interface IDepartment {
    id?:number,
    name?:string,
    location?:string,
    loc?:string,
    departmentCourses?: {
        courseId?: number,
        course?: {
            id?: number,
            name?: string
        }
    }[]
}
