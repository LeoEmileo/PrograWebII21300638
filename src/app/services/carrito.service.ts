import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: Producto[] = [];

  constructor() {}

  agregarProducto(producto: Producto) {
    this.carrito.push(producto);
    console.log(`Producto ${producto.nombre} agregado al carrito. Stock actualizado: ${producto.cantidad}`);
  }

  obtenerCarritoAgrupado() {
    const carritoAgrupado: { [id: number]: { producto: Producto, cantidad: number } } = {};
    this.carrito.forEach((producto) => {
      if (carritoAgrupado[producto.id]) {
        carritoAgrupado[producto.id].cantidad++;
      } else {
        carritoAgrupado[producto.id] = { producto, cantidad: 1 };
      }
    });
    return Object.values(carritoAgrupado);
  }

  obtenerTotal(): number {
    return this.carrito.reduce((total, producto) => total + producto.precio, 0);
  }

  eliminarProducto(id: number): void {
    const index = this.carrito.findIndex(p => p.id === id);
    if (index !== -1) {
      this.carrito.splice(index, 1);
    }
    
  }

  generarXML(): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<recibo>\n';
    const carritoAgrupado = this.obtenerCarritoAgrupado();
    carritoAgrupado.forEach((item) => {
      xml += `<producto id="${item.producto.id}">
                  <nombre>${item.producto.nombre}</nombre>
                  <cantidad>${item.cantidad}</cantidad>
                  <precio_unitario>${item.producto.precio}</precio_unitario>
                  <precio_total>${item.producto.precio * item.cantidad}</precio_total>
              </producto>\n`;
    });
    xml += `<total>${this.obtenerTotal()}</total>\n`;
    xml += '</recibo>';
    return xml;
  }

  generarYDescargarXML() {
    const xml = this.generarXML();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    a.click();
    URL.revokeObjectURL(url);
  }
}
