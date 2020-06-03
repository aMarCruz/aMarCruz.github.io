# Menú Digital

Esta aplicación implementa un sistema de menú o carta digital.

Las propuestas son tres versiones en orden de complejidad:

## Primera opción, lista básica mezclada con imágenes

Código QR para descargar una App.

Se pueden proporcionar imagenes que aparecen en lugares determinados por el usuario y datos que el sistema formateará automaticamente. Sólo se deben ingresar los datos que cambian.

Los datos se presentan en secciones como en las cartas convencionales con esquema de colores personalizables.

El fondo es una imagen seleccionable por el usuario.

Opcionalmente, los productos seleccionados (la orden) se van mostrando en un depósito tipo carrito de compras. El mesero deberá tomar la orden manualmente.

Se incluye la posibilidad de imprimir la carta, en caso de que falle la conexión a Internet.

## Segunda opción, App con toma de orden

Código QR para descargar una App que con funcionalidad para toma de órdenes, además de las características de la segunda opción.

### Funcionamiento Básico

1. El cliente escanea el código QR de tu establecimiento con su celular.
2. El cliente visualiza (en una App descargada) tu menú.
3. El menú permite ir marcando y viendo el pedido con precios.
4. En cuanto el cliente confirma, la orden será visible en el sistema, con área/múmero de mesa para que se trabaje.
5. La orden se puede marcar como "lista".
6. Una vez cobrado el consumo, la mesa se cierra y los datos se van a un depósito histórico.

Todas las ordenes se acumulan por mesa hasta que se cierran.
La App no implementa cobros, contabilidad, ni ningún tipo de administración excepto el de mantenimiento del menú y la toma de ordenes.

#### Ingreso de datos

Los productos en el menú deben ser ingresados manualmente y consisten de:

- Sección
- Subsección
- Título
- Descripción breve
- Precio

Para presentación expandida:

- Fotografía
- Descripción ampliada

El menú se puede mostrar en uno de 2 idiomas si se ingresan las traducciones y/o en otra moneda proporcionando un tipo de cambio global (el del dólar lo puede proporcionar automáticamente la App).

Los productos pueden agruparse en paquetes, por ejemplo para promociones, o desagruparse paquetes en dos o más productos.

El fondo es una o más imágenes seleccionables por el usuario.
