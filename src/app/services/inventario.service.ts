import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

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
export class InventarioService {
  private xmlUrl = 'assets/productos.xml';
  private productos: Producto[] = [];

  constructor(private http: HttpClient) {}

 
  obtenerProductos(): Observable<Producto[]> {
    const saved = localStorage.getItem('productos');
    if (saved) {
      this.productos = JSON.parse(saved);
      return of(this.productos);
    }
    return this.http.get(this.xmlUrl, { responseType: 'text' }).pipe(
      map(xmlString => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
        const productoNodes = xmlDoc.getElementsByTagName('producto');
        const lista: Producto[] = [];
        for (let i = 0; i < productoNodes.length; i++) {
          const node = productoNodes[i];
          const id = parseInt(node.getElementsByTagName('id')[0].textContent || '0', 10);
          const nombre = node.getElementsByTagName('nombre')[0].textContent || '';
          const precio = parseFloat(node.getElementsByTagName('precio')[0].textContent || '0');
          const cantidad = parseInt(node.getElementsByTagName('cantidad')[0].textContent || '0', 10);
          const imagen = node.getElementsByTagName('imagen')[0].textContent || '';
          lista.push({ id, nombre, precio, cantidad, imagen });
        }
        this.productos = lista;
        localStorage.setItem('productos', JSON.stringify(lista));
        return lista;
      })
    );
  }



 
  crearProducto(nuevo: Producto) {
    if (nuevo.id === null || nuevo.id === undefined || nuevo.id === 0) {
      const maxId = this.productos.reduce((acc, cur) => Math.max(acc, cur.id), 0);
      nuevo.id = maxId + 1;
    }
   
    this.productos.push(nuevo);
  }


  modificarProducto(productoModificado: Producto) {
    const index = this.productos.findIndex(p => p.id === productoModificado.id);
    if (index !== -1) {
      this.productos[index] = productoModificado;
    }
  }

  eliminarProducto(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
  }


  generarXML(): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<productos>\n';
    this.productos.forEach(p => {
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

  
  descargarXML() {
    const xml = this.generarXML();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'productos.xml';
    a.click();
    URL.revokeObjectURL(url);
  }
}
