import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto.component.html', 
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];

  constructor( 
    private productoService: ProductoService,
    private carritoService: CarritoService, 
    private router: Router
  ){}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      }
    });
  }

  agregarAlCarrito(producto: Producto) {
    const stockActual = Number(producto.cantidad);
    if (stockActual > 0) {
      // Reducir el stock en 1
      const nuevoStock = stockActual - 1;
      // Crear un objeto con el stock actualizado
      const productoActualizado = { ...producto, cantidad: nuevoStock };

      // Llamar al backend para actualizar el stock
      this.productoService.modificarProducto(productoActualizado).subscribe({
        next: () => {
          // Una vez que el backend confirma la actualización, actualizamos localmente:
          producto.cantidad = nuevoStock;
          // Y agregamos el producto actualizado al carrito
          this.carritoService.agregarProducto(productoActualizado);
          // (Opcional) Refrescar la lista para que la UI muestre el nuevo stock
          this.cargarProductos();
        },
        error: err => {
          console.error('Error al actualizar stock:', err);
          alert('No se pudo actualizar el stock. Intenta nuevamente.');
        }
      });
    } else {
      alert('No hay suficiente stock para este producto.');
    }
  }

  irAlCarrito(){
    this.router.navigate(['/carrito']);
  }

  irAlInventario() {
    this.router.navigate(['/inventario']);
  }
}
