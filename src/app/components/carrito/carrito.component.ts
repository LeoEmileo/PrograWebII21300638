import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { ProductoService } from '../../services/producto.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: { producto: any, cantidad: number }[] = [];
  total: number = 0;

  constructor(
    private carritoService: CarritoService,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.actualizarCarrito();
  }

  actualizarCarrito() {
    this.carrito = this.carritoService.obtenerCarritoAgrupado();
    this.total = this.carritoService.obtenerTotal();
  }

  eliminarProducto(id: number) {
    // Elimina la unidad del carrito
    this.carritoService.eliminarProducto(id);
    
    // Ahora, consulta el producto actualizado (esto es importante si el objeto en la UI no está sincronizado)
    this.productoService.obtenerProductos().subscribe(productos => {
      const producto = productos.find(p => p.id === id);
      if (producto) {
        const nuevoStock = producto.cantidad + 1;
        const productoActualizado = { ...producto, cantidad: nuevoStock };
        this.productoService.modificarProducto(productoActualizado).subscribe({
          next: () => {
            console.log('Stock incrementado:', nuevoStock);
            // Actualiza la UI si es necesario
          },
          error: err => console.error('Error al actualizar stock:', err)
        });
      }
      this.actualizarCarrito();
    });
  }
  

  generarYDescargarXML() {
    const xml = this.carritoService.generarXML();
    console.log("Recibo generado:\n", xml);
    this.descargarXML(xml);
  }

  descargarXML(xml: string) {
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  navegarATienda() {
    this.router.navigate(['/']);
  }

  
}
