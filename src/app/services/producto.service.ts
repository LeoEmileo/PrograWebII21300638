import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  crearProducto(nuevo: Producto): Observable<any> {
    return this.http.post(this.apiUrl, nuevo);
  }

  modificarProducto(producto: Producto): Observable<any> {
    console.log('[ProductoService] Enviando PUT:', producto);
    return this.http.put(`${this.apiUrl}/${producto.id}`, producto);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  
  generarXML(productos: Producto[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<productos>\n';
    productos.forEach(p => {
      xml += `  <producto>
    <id>${p.id}</id>
    <nombre>${p.nombre}</nombre>
    <precio>${p.precio}</precio>
    <cantidad>${p.cantidad}</cantidad>
    <imagen>${p.imagen}</imagen>
  </producto>\n`;
    });
    xml += '</productos>';
    return xml;
  }
}
