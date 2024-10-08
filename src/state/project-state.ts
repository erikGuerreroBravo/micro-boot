
namespace App{

///agregamos los oyentes
//type Listener = (items: Project[] ) => void;

type Listener<T> = (items: T[]) => void;

//manejamos el estado de la aplicacion de forma generica
class State<T>{
    protected listeners: Listener<T>[] = [];
    addListener(listenerFn: Listener<T>){
        this.listeners.push(listenerFn);
    }

}

///Manejo del estado del proyeco: Management State
///se crea un patronn de diseño del tipo singleton
export class ProjectState extends State<Project>{
   
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor(){
        super();
    }
    
    static getInstance(){
        if(this.instance){
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

   //metodo que se encarga de agregar objetos del tipo newProject al arreglo original projects
    addProject(title: string, description: string, numOfPeople:number){
        const newProject =new Project(Math.random.toString(),title,description,numOfPeople,ProjectStatus.Active);
         /*{
            id:Math.random().toString(),
            title: title,
            description: description,
            numOfPeople:numOfPeople
        };*/
        //agrgeamos al arreglo de proyectos  el nuevo objeto.
        this.projects.push(newProject);
        //for(const listeneerFn of this.listeners)
        //{
            ///retornamos una copìa del arreglo original por cada vez que se invoque la funcion
            /// listeneerFn(this.projects.slice());
        //}
        this.updateListeners();
    }
   
    ///este metodo se va a encargar de mover el estado del proyecto a otro status
    moveProject(projectId: string , newStatus: ProjectStatus)
    {
        const project = this.projects.find(p=> p.id === projectId);
        if(project){
            if(project && project.status !== newStatus){
                project.status = newStatus;
                this.updateListeners();
            }
        }
    }
   
    private updateListeners(){
        for(const listenerFn of this.listeners){
            listenerFn(this.projects.slice());
        }
    }


}
//creamos una constante global para poder ser utilizada  en cualquier parte dell proyecto.
export const projectState = ProjectState.getInstance();
}
