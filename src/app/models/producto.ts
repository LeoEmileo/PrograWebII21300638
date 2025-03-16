export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number; 
    imagen: string;
  }
  
  export interface ProductoCarrito extends Producto {
    cantidadCarrito: number;
  }
  