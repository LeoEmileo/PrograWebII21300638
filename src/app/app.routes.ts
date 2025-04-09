import { Routes } from '@angular/router';
import { ProductoComponent } from './components/producto/producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { InventarioComponent } from './components/inventario/inventario.component';


export const routes: Routes = [
    { path: '', component: ProductoComponent }, // Ruta raíz
    { path: 'carrito', component: CarritoComponent }, // Ruta al carrito
    { path: 'inventario', component: InventarioComponent },
];
