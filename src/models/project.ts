


//namespace App{


export enum ProjectStatus{
    Active,Finished

}
/// creamos la clase project
export class Project{
    constructor(public id: string, public title:string,public description:string, public people: number,public status: ProjectStatus){

    }
}

//}