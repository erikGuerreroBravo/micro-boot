//namespace App{

///Construimos las interfaces necesarias para utilizar el Drag and Drop
//Drag  Interface
export interface Draggable{
    //expezamos  el listener que se encarga de manejar los elementos de escucha para el arrastrar y soltar
    dragStartHandler(event: DragEvent):void;
    //el listener que escucha cuando termina el proceso de soltar el elemento
    dragEndHandler(event: DragEvent):void;
}
export interface DragTarget{
    //este elemento de escucha se utiliza para identificar la superficie objetivo para saber si es  valido para soltar el elemento
    dragOverHandler(event: DragEvent):void;
    // este elemento de escucha se utiliza cuando el usuario actualiza los datos o smplemente suelta el elemento a redibujar
    dropHandler(event: DragEvent):void;
    //este elemento de esucha se utiliza cuando el elemento de arrastrar esta lejso del oobjetiv o el usuario lo cancela.
    dragLeaveHandler(event: DragEvent):void;
}



//}







