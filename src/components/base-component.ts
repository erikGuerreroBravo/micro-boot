

//namespace App{

    //Agregamos un componente base para reutilizar el codigo generado
export abstract class Component<T extends HTMLElement, U extends HTMLElement>
{
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

   constructor(templateId: string, hostElementId: string , insertAtStart: boolean ,newElement?: string)
   {
        this.templateElement = <HTMLTemplateElement> document.getElementById(templateId)! as HTMLTemplateElement;
        //vamos a utilizar el elemento T explicando que T es un elemento del tipo HTMLElement
        this.hostElement =<HTMLElement>document.getElementById(hostElementId)! as T;
        
        const importedNode = document.importNode(this.templateElement.content,true);
         this.element = importedNode.firstElementChild as U;
         if(newElement)
         {
            this.element.id= newElement;
         }
         this.attach(insertAtStart);
   
        //mandamos raer  los metodos asignados
        this.renderContent();
        this.configure();

   }
   private attach(insertAtStartBegining: boolean)
    {
        //se encarga de insertar un nodo de acuerdo a la posicion especifica en la cual se agrega dicho nodo.
        this.hostElement.insertAdjacentElement(insertAtStartBegining ? 'afterbegin' : 'beforeend',this.element);
    }

   //configuramos los elementos exctras necesarios para la clase
   abstract configure(): void;
   abstract renderContent(): void;

 }
//}