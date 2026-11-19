import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

// Categorías de productos
const CATEGORIAS = ['Todas', 'Tornillería', 'Clavos', 'Herramientas', 'Electricidad', 'Plomería', 'Pintura', 'Seguridad'];

// Zonas de delivery exclusivas de Armenia, Sonsonate
const ZONAS_DELIVERY = [
  { id: '1', nombre: 'Armenia - Zona Urbana / Centro', costo: 1.25, tiempo: '15 - 25 min' },
  { id: '2', nombre: 'Colonia San Damián y Alrededores', costo: 1.50, tiempo: '15 - 30 min' },
  { id: '3', nombre: 'Caseríos y Cantones de Armenia', costo: 2.25, tiempo: '30 - 45 min' },
];

// Base de datos de productos ampliada
const PRODUCTOS_INICIALES = [
  { id: '1', nombre: 'Tornillo p/Madera 2" (Caja x100)', categoria: 'Tornillería', precio: 4.50, icono: '🔩', desc: 'Tornillos de acero galvanizado autorroscantes ideales para carpintería.' },
  { id: '2', nombre: 'Clavo de Acero 3" (Libra)', categoria: 'Clavos', precio: 2.20, icono: '📌', desc: 'Clavos de alta resistencia para concreto, mampostería y madera.' },
  { id: '3', nombre: 'Martillo de Uña 16oz Stanley', categoria: 'Herramientas', precio: 12.80, icono: '🔨', desc: 'Mango ergonómico de fibra de vidrio resistente a impactos.' },
  { id: '4', nombre: 'Juego Destornilladores (6 Pzs)', categoria: 'Herramientas', precio: 9.50, icono: '🪛', desc: 'Incluye puntas planas y phillips imantadas de alta precisión.' },
  { id: '5', nombre: 'Cinta Métrica 5 metros / 16ft', categoria: 'Herramientas', precio: 5.00, icono: '📏', desc: 'Cinta métrica metálica flexible con mecanismo de bloqueo y gancho.' },
  { id: '6', nombre: 'Cable Eléctrico THHN #12 (Metro)', categoria: 'Electricidad', precio: 0.85, icono: '⚡', desc: 'Conductor de cobre para instalaciones eléctricas residenciales.' },
  { id: '7', nombre: 'Tubo PVC Agua Potable 1/2" (6m)', categoria: 'Plomería', precio: 3.75, icono: '🚰', desc: 'Tubo de PVC rígido de alta presión para distribución de agua.' },
  { id: '8', nombre: 'Pintura Látex Blanco (Galón)', categoria: 'Pintura', precio: 18.00, icono: '🎨', desc: 'Pintura látex lavable para acabado mate en interiores y exteriores.' },
  { id: '9', nombre: 'Cinta Aislante Negra 3M', categoria: 'Electricidad', precio: 1.50, icono: '🔌', desc: 'Cinta vinílica retardante de llama y aislante de voltaje.' },
  { id: '10', nombre: 'Llave Ajustable Perica 10"', categoria: 'Herramientas', precio: 11.25, icono: '🔧', desc: 'Fabricada en acero forjado con apertura amplia y precisa.' },
  { id: '11', nombre: 'Taladro Percutor 1/2" 650W DeWalt', categoria: 'Herramientas', precio: 65.00, icono: '⚙️', desc: 'Motor potente de 650W ideal para perforación en concreto, madera y metal.' },
  { id: '12', nombre: 'Disco de Corte p/Metal 4-1/2"', categoria: 'Herramientas', precio: 1.25, icono: '🪚', desc: 'Disco abrasivo ultra delgado para cortes rápidos y limpios en acero.' },
  { id: '13', nombre: 'Alicate Universal 8" Truper', categoria: 'Herramientas', precio: 7.80, icono: '🛠️', desc: 'Alicate multifunción de acero cromo vanadio con mango antideslizante.' },
  { id: '14', nombre: 'Juego de Llaves Mixtas (8 a 19mm)', categoria: 'Herramientas', precio: 16.50, icono: '🔧', desc: 'Set de 10 llaves combinadas de corona y boca abierta.' },
  { id: '15', nombre: 'Cortafrío / Cincel 8" p/Concreto', categoria: 'Herramientas', precio: 4.20, icono: '⛏️', desc: 'Cincel plano reforzado con protector de mano antimpacto.' },
  { id: '16', nombre: 'Silicona Transparente Multiuso 300ml', categoria: 'Plomería', precio: 3.90, icono: '🧪', desc: 'Sellador impermeabilizante para vidrios, lavabos y juntas.' },
  { id: '17', nombre: 'Extension Eléctrica Uso Rudo 10m', categoria: 'Electricidad', precio: 14.50, icono: '🔌', desc: 'Extensión calibre 14 AWG reforzada para intemperie y trabajo pesado.' },
  { id: '18', nombre: 'Guantes de Cuero p/Trabajo Pesado', categoria: 'Seguridad', precio: 5.50, icono: '🧤', desc: 'Guantes de caraza reforzados para protección contra abrasión y cortes.' },
  { id: '19', nombre: 'Lentes de Seguridad Transparentes', categoria: 'Seguridad', precio: 2.50, icono: '🥽', desc: 'Gafas de policarbonato con protección UV y antirrayaduras.' },
  { id: '20', nombre: 'Sierra Manual p/Metal 12"', categoria: 'Herramientas', precio: 8.75, icono: '🪚', desc: 'Arco de sierra ergonómico con hoja bimetálica incluida.' }
];

export default function App() {
  const [pantalla, setPantalla] = useState('login');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState('1');
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState('Tarjeta');
  const [modalFacturaVisible, setModalFacturaVisible] = useState(false);

  // Datos para el Formulario de Delivery
  const [direccion, setDireccion] = useState('');
  const [referencia, setReferencia] = useState('');
  const [telefonoContacto, setTelefonoContacto] = useState('');
  const [zonaSeleccionada, setZonaSeleccionada] = useState(ZONAS_DELIVERY[0]);

  // Datos para el Formulario de Tarjeta
  const [tarjetaNombre, setTarjetaNombre] = useState('');
  const [tarjetaNumero, setTarjetaNumero] = useState('');
  const [tarjetaExp, setTarjetaExp] = useState('');
  const [tarjetaCvv, setTarjetaCvv] = useState('');

  const manejarLogin = () => {
    if (usuario.trim() === '' || password.trim() === '') {
      Alert.alert('Atención', 'Por favor ingrese su usuario y contraseña');
      return;
    }
    setUsuarioLogueado(usuario);
    setPantalla('catalogo');
  };

  const manejarCerrarSesion = () => {
    setUsuarioLogueado(null);
    setUsuario('');
    setPassword('');
    setCarrito([]);
    resetearFormularios();
    setPantalla('login');
  };

  const resetearFormularios = () => {
    setTarjetaNombre('');
    setTarjetaNumero('');
    setTarjetaExp('');
    setTarjetaCvv('');
    setDireccion('');
    setReferencia('');
    setTelefonoContacto('');
    setZonaSeleccionada(ZONAS_DELIVERY[0]);
  };

  const productosFiltrados = PRODUCTOS_INICIALES.filter(p => {
    const coincideCategoria = categoriaSeleccionada === 'Todas' || p.categoria === categoriaSeleccionada;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.categoria.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const agregarAlCarrito = () => {
    const cantNum = parseInt(cantidad, 10);
    if (isNaN(cantNum) || cantNum <= 0) {
      Alert.alert('Error', 'Ingrese una cantidad válida mayor a 0');
      return;
    }
    const itemExistente = carrito.find(item => item.id === productoSeleccionado.id);
    if (itemExistente) {
      setCarrito(carrito.map(item =>
        item.id === productoSeleccionado.id
          ? { ...item, cantidad: item.cantidad + cantNum }
          : item
      ));
    } else {
      setCarrito([...carrito, { ...productoSeleccionado, cantidad: cantNum }]);
    }
    Alert.alert('¡Añadido!', `${cantNum} unidad(es) agregada(s) al carrito.`);
    setPantalla('catalogo');
    setCantidad('1');
  };

  const cambiarCantidadCarrito = (id, delta) => {
    setCarrito(prev => prev.map(item => {
      if (item.id === id) {
        const nuevaCant = item.cantidad + delta;
        return nuevaCant > 0 ? { ...item, cantidad: nuevaCant } : item;
      }
      return item;
    }));
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  const procesarCompra = () => {
    if (carrito.length === 0) {
      Alert.alert('Carrito Vacío', 'Agregue productos antes de procesar la orden.');
      return;
    }
    if (!direccion.trim()) {
      Alert.alert('Dirección requerida', 'Por favor ingrese la dirección exacta para el envío en Armenia.');
      return;
    }
    if (!telefonoContacto.trim() || telefonoContacto.length < 8) {
      Alert.alert('Teléfono requerido', 'Ingrese un número de teléfono de contacto válido para el repartidor.');
      return;
    }
    if (metodoPago === 'Tarjeta') {
      if (!tarjetaNombre.trim()) {
        Alert.alert('Datos de tarjeta incompletos', 'Por favor ingrese el nombre del titular.');
        return;
      }
      const numLimpio = tarjetaNumero.replace(/\s+/g, '');
      if (numLimpio.length < 15) {
        Alert.alert('Datos de tarjeta incompletos', 'Ingrese un número de tarjeta válido (16 dígitos).');
        return;
      }
      if (!tarjetaExp.trim() || tarjetaExp.length < 4) {
        Alert.alert('Datos de tarjeta incompletos', 'Ingrese una fecha de vencimiento válida (MM/AA).');
        return;
      }
      if (!tarjetaCvv.trim() || tarjetaCvv.length < 3) {
        Alert.alert('Datos de tarjeta incompletos', 'Ingrese un código CVV válido.');
        return;
      }
    }
    setModalFacturaVisible(true);
  };

  const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const envio = subtotal > 0 ? zonaSeleccionada.costo : 0;
  const iva = subtotal * 0.13;
  const total = subtotal + envio + iva;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* PANTALLA LOGIN */}
        {pantalla === 'login' && (
          <View style={styles.loginContainer}>
            <Text style={styles.logoText}>🏗️ FERRETERÍA LA CONFIABLE</Text>
            <Text style={styles.subtituloLogin}>Acceso a Tienda Virtual & Delivery (Armenia)</Text>
            <View style={styles.cardLogin}>
              <Text style={styles.labelInput}>Usuario / Correo:</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. cliente@laconfiable.com"
                value={usuario}
                onChangeText={setUsuario}
                autoCapitalize="none"
              />
              <Text style={styles.labelInput}>Contraseña:</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.botonPrincipal} onPress={manejarLogin}>
                <Text style={styles.textoBoton}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ENCABEZADO */}
        {pantalla !== 'login' && (
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tituloHeader} numberOfLines={1}>🏗️ FERRETERÍA LA CONFIABLE</Text>
              <Text style={styles.usuarioHeader}>Bienvenido, {usuarioLogueado}</Text>
            </View>
            <View style={styles.headerBotones}>
              <TouchableOpacity style={styles.botonBolsa} onPress={() => setPantalla('carrito')}>
                <Text style={styles.textoBolsa}>🛒 ({carrito.reduce((a, b) => a + b.cantidad, 0)})</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botonSalir} onPress={manejarCerrarSesion}>
                <Text style={styles.textoSalir}>Salir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* PANTALLA CATÁLOGO */}
        {pantalla === 'catalogo' && (
          <View style={styles.contenido}>
            <TextInput
              style={styles.inputBuscador}
              placeholder="🔍 Buscar por producto o categoría..."
              value={busqueda}
              onChangeText={setBusqueda}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasScroll}>
              {CATEGORIAS.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chipCategoria, categoriaSeleccionada === cat && styles.chipActivo]}
                  onPress={() => setCategoriaSeleccionada(cat)}
                >
                  <Text style={[styles.textoChip, categoriaSeleccionada === cat && styles.textoChipActivo]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <FlatList
              data={productosFiltrados}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.tarjetaProducto}
                  onPress={() => {
                    setProductoSeleccionado(item);
                    setPantalla('detalle');
                  }}
                >
                  <View style={styles.boxIcono}>
                    <Text style={styles.emojiIcono}>{item.icono}</Text>
                  </View>
                  <View style={styles.infoProducto}>
                    <Text style={styles.nombreProducto}>{item.nombre}</Text>
                    <Text style={styles.categoriaProducto}>{item.categoria}</Text>
                    <Text style={styles.precioProducto}>${item.precio.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.textVerMas}>Ver ➔</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* PANTALLA DETALLE */}
        {pantalla === 'detalle' && productoSeleccionado && (
          <ScrollView style={styles.contenido}>
            <TouchableOpacity style={styles.botonVolver} onPress={() => setPantalla('catalogo')}>
              <Text style={styles.textoVolver}>⬅ Volver al Catálogo</Text>
            </TouchableOpacity>

            <View style={styles.detalleContainer}>
              <View style={styles.boxIconoGrande}>
                <Text style={styles.emojiIconoGrande}>{productoSeleccionado.icono}</Text>
              </View>
              <Text style={styles.nombreDetalle}>{productoSeleccionado.nombre}</Text>
              <Text style={styles.categoriaBadge}>{productoSeleccionado.categoria}</Text>
              <Text style={styles.descripcionText}>{productoSeleccionado.desc}</Text>
              <Text style={styles.precioDetalle}>Precio: ${productoSeleccionado.precio.toFixed(2)}</Text>

              <Text style={styles.labelInput}>Cantidad a llevar:</Text>
              <TextInput
                style={styles.inputCantidad}
                keyboardType="numeric"
                value={cantidad}
                onChangeText={setCantidad}
              />

              <TouchableOpacity style={styles.botonPrincipal} onPress={agregarAlCarrito}>
                <Text style={styles.textoBoton}>Agregar al Carrito 🛒</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* PANTALLA CARRITO & CHECKOUT */}
        {pantalla === 'carrito' && (
          <ScrollView style={styles.contenido}>
            <TouchableOpacity style={styles.botonVolver} onPress={() => setPantalla('catalogo')}>
              <Text style={styles.textoVolver}>⬅ Seguir Comprando</Text>
            </TouchableOpacity>

            <Text style={styles.subtitulo}>🛒 Tu Carrito de Compras</Text>

            {carrito.length === 0 ? (
              <Text style={styles.textoVacio}>No tienes productos añadidos al carrito.</Text>
            ) : (
              <>
                {carrito.map(item => (
                  <View key={item.id} style={styles.itemCarrito}>
                    <Text style={{ fontSize: 24, marginRight: 8 }}>{item.icono}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemNombre}>{item.nombre}</Text>
                      <Text style={styles.itemDetalle}>${item.precio.toFixed(2)} c/u</Text>
                    </View>
                    
                    <View style={styles.controlesCantidad}>
                      <TouchableOpacity style={styles.btnCantidad} onPress={() => cambiarCantidadCarrito(item.id, -1)}>
                        <Text style={styles.txtBtnCantidad}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.numCantidad}>{item.cantidad}</Text>
                      <TouchableOpacity style={styles.btnCantidad} onPress={() => cambiarCantidadCarrito(item.id, 1)}>
                        <Text style={styles.txtBtnCantidad}>+</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.itemSubtotal}>${(item.cantidad * item.precio).toFixed(2)}</Text>
                    <TouchableOpacity onPress={() => eliminarDelCarrito(item.id)} style={{ marginLeft: 8 }}>
                      <Text style={{ fontSize: 16 }}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                {/* SECCIÓN 1: DATOS DE DELIVERY Y ENVÍO */}
                <Text style={styles.seccionTitulo}>📦 Delivery en Armenia, Sonsonate:</Text>

                <View style={styles.cardSeccionForm}>
                  <Text style={styles.labelForm}>Selecciona la Zona de Envío:</Text>
                  {ZONAS_DELIVERY.map(z => (
                    <TouchableOpacity
                      key={z.id}
                      style={[styles.opcionZona, zonaSeleccionada.id === z.id && styles.opcionZonaActiva]}
                      onPress={() => setZonaSeleccionada(z)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.txtZonaNombre, zonaSeleccionada.id === z.id && styles.txtBlanco]}>{z.nombre}</Text>
                        <Text style={[styles.txtZonaTiempo, zonaSeleccionada.id === z.id && styles.txtBlancoMuted]}>⏱ Tiempo: {z.tiempo}</Text>
                      </View>
                      <Text style={[styles.txtZonaCosto, zonaSeleccionada.id === z.id && styles.txtBlanco]}>${z.costo.toFixed(2)}</Text>
                    </TouchableOpacity>
                  ))}

                  <Text style={styles.labelForm}>Dirección de Entrega Exacta (Armenia):</Text>
                  <TextInput
                    style={styles.inputForm}
                    placeholder="Ej. Barrio El Centro, Calle Principal #12"
                    value={direccion}
                    onChangeText={setDireccion}
                  />

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, marginRight: 4 }}>
                      <Text style={styles.labelForm}>Punto de Referencia:</Text>
                      <TextInput
                        style={styles.inputForm}
                        placeholder="Ej. Cerca de la alcaldía"
                        value={referencia}
                        onChangeText={setReferencia}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 4 }}>
                      <Text style={styles.labelForm}>Teléfono de Contacto:</Text>
                      <TextInput
                        style={styles.inputForm}
                        placeholder="Ej. 7890-1234"
                        keyboardType="phone-pad"
                        value={telefonoContacto}
                        onChangeText={setTelefonoContacto}
                      />
                    </View>
                  </View>

                  <View style={styles.bannerTiempoEstimado}>
                    <Text style={styles.txtBannerTiempo}>🚚 Tiempo de llegada estimado: <Text style={{fontWeight: 'bold'}}>{zonaSeleccionada.tiempo}</Text></Text>
                  </View>
                </View>

                {/* SECCIÓN 2: MÉTODOS DE PAGO */}
                <Text style={styles.seccionTitulo}>💳 Método de Pago Virtual:</Text>
                <View style={styles.metodosPagoContainer}>
                  {['Tarjeta', 'Transferencia', 'Efectivo'].map(metodo => (
                    <TouchableOpacity
                      key={metodo}
                      style={[styles.opcionPago, metodoPago === metodo && styles.opcionPagoSeleccionada]}
                      onPress={() => setMetodoPago(metodo)}
                    >
                      <Text style={[styles.textoPago, metodoPago === metodo && styles.textoPagoSeleccionado]}>
                        {metodo === 'Tarjeta' ? '💳 Tarjeta' : metodo === 'Transferencia' ? '🏦 Banco' : '💵 Contra Entrega'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* FORMULARIO DE TARJETA SI APLICA */}
                {metodoPago === 'Tarjeta' && (
                  <View style={styles.cardSeccionForm}>
                    <Text style={styles.tituloSubForm}>💳 Ingresa los datos de tu Tarjeta</Text>
                    
                    <Text style={styles.labelForm}>Titular de la tarjeta:</Text>
                    <TextInput
                      style={styles.inputForm}
                      placeholder="Nombre como figura en la tarjeta"
                      value={tarjetaNombre}
                      onChangeText={setTarjetaNombre}
                    />

                    <Text style={styles.labelForm}>Número de Tarjeta:</Text>
                    <TextInput
                      style={styles.inputForm}
                      placeholder="1234 5678 9012 3456"
                      keyboardType="numeric"
                      maxLength={19}
                      value={tarjetaNumero}
                      onChangeText={(val) => {
                        const limpio = val.replace(/\D/g, '');
                        const formateado = limpio.match(/.{1,4}/g)?.join(' ') || limpio;
                        setTarjetaNumero(formateado);
                      }}
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1, marginRight: 5 }}>
                        <Text style={styles.labelForm}>Vencimiento:</Text>
                        <TextInput
                          style={styles.inputForm}
                          placeholder="MM/AA"
                          keyboardType="numeric"
                          maxLength={5}
                          value={tarjetaExp}
                          onChangeText={(val) => {
                            let limpio = val.replace(/\D/g, '');
                            if (limpio.length >= 3) {
                              limpio = limpio.substring(0, 2) + '/' + limpio.substring(2, 4);
                            }
                            setTarjetaExp(limpio);
                          }}
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 5 }}>
                        <Text style={styles.labelForm}>CVV / CVC:</Text>
                        <TextInput
                          style={styles.inputForm}
                          placeholder="123"
                          keyboardType="numeric"
                          secureTextEntry
                          maxLength={4}
                          value={tarjetaCvv}
                          onChangeText={setTarjetaCvv}
                        />
                      </View>
                    </View>
                  </View>
                )}

                {/* RESUMEN FINANCIERO */}
                <View style={styles.resumenCard}>
                  <View style={styles.filaResumen}><Text>Subtotal Productos:</Text><Text>${subtotal.toFixed(2)}</Text></View>
                  <View style={styles.filaResumen}><Text>Envío Delivery ({zonaSeleccionada.nombre}):</Text><Text>${envio.toFixed(2)}</Text></View>
                  <View style={styles.filaResumen}><Text>IVA (13%):</Text><Text>${iva.toFixed(2)}</Text></View>
                  <View style={[styles.filaResumen, { borderTopWidth: 1, borderColor: '#ccc', paddingTop: 8 }]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>TOTAL FINAL:</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#27ae60' }}>${total.toFixed(2)}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.botonPrincipal, { backgroundColor: '#27ae60', marginVertical: 20 }]}
                  onPress={procesarCompra}
                >
                  <Text style={styles.textoBoton}>Confirmar Pedido en Armenia 🚀</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        )}

        {/* MODAL FACTURA / TICKET DE ENVÍO */}
        <Modal visible={modalFacturaVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitulo}>📄 Factura & Orden de Delivery</Text>
              <Text style={styles.modalCliente}>👤 Cliente: {usuarioLogueado}</Text>
              <Text style={styles.modalCliente}>📞 Teléfono: {telefonoContacto}</Text>
              <Text style={styles.modalCliente}>📍 Dirección: {direccion} (Armenia)</Text>
              {referencia ? <Text style={styles.modalCliente}>🏠 Ref: {referencia}</Text> : null}

              <View style={styles.modalBadgeTiempo}>
                <Text style={styles.txtModalTiempo}>⏱ Tiempo Llegada Estimado: {zonaSeleccionada.tiempo}</Text>
              </View>

              <Text style={styles.modalCliente}>Método de Pago: {metodoPago}</Text>
              {metodoPago === 'Tarjeta' && (
                <Text style={styles.modalCliente}>
                  Tarjeta: **** **** **** {tarjetaNumero.replace(/\s+/g, '').slice(-4) || '****'}
                </Text>
              )}

              <View style={{ height: 1, backgroundColor: '#ddd', marginVertical: 10 }} />

              <ScrollView style={{ maxHeight: 120 }}>
                {carrito.map(i => (
                  <Text key={i.id} style={{ fontSize: 12, marginBottom: 3 }}>
                    • {i.icono} {i.nombre} (x{i.cantidad}) - ${(i.cantidad * i.precio).toFixed(2)}
                  </Text>
                ))}
              </ScrollView>

              <View style={{ height: 1, backgroundColor: '#ddd', marginVertical: 10 }} />
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                <Text style={{ fontSize: 12, color: '#64748b' }}>Envío Delivery:</Text>
                <Text style={{ fontSize: 12, color: '#64748b' }}>${envio.toFixed(2)}</Text>
              </View>
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'right', color: '#16a34a' }}>
                Total Pagado: ${total.toFixed(2)}
              </Text>

              <TouchableOpacity
                style={[styles.botonPrincipal, { marginTop: 15 }]}
                onPress={() => {
                  setModalFacturaVisible(false);
                  setCarrito([]);
                  resetearFormularios();
                  setPantalla('catalogo');
                  Alert.alert('¡Orden Procesada!', 'Tu pedido de ferretería va en camino en Armenia.');
                }}
              >
                <Text style={styles.textoBoton}>Finalizar y Volver al Inicio</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  loginContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#1e293b' },
  logoText: { fontSize: 22, fontWeight: 'bold', color: '#f59e0b', marginBottom: 5, textAlign: 'center' },
  subtituloLogin: { color: '#94a3b8', marginBottom: 25 },
  cardLogin: { backgroundColor: '#fff', width: '100%', padding: 20, borderRadius: 12, elevation: 4 },
  labelInput: { fontWeight: 'bold', color: '#334155', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', padding: 12, borderRadius: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#1e293b', paddingTop: Platform.OS === 'android' ? 35 : 15 },
  tituloHeader: { fontSize: 15, fontWeight: 'bold', color: '#f59e0b' },
  usuarioHeader: { color: '#94a3b8', fontSize: 11 },
  headerBotones: { flexDirection: 'row', alignItems: 'center' },
  botonBolsa: { backgroundColor: '#f59e0b', padding: 8, borderRadius: 6, marginRight: 8 },
  textoBolsa: { color: '#fff', fontWeight: 'bold' },
  botonSalir: { backgroundColor: '#ef4444', padding: 8, borderRadius: 6 },
  textoSalir: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  contenido: { flex: 1, padding: 15 },
  inputBuscador: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12 },
  categoriasScroll: { maxHeight: 40, marginBottom: 15 },
  chipCategoria: { backgroundColor: '#e2e8f0', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 8, height: 35 },
  chipActivo: { backgroundColor: '#1e293b' },
  textoChip: { color: '#475569', fontWeight: 'bold', fontSize: 12 },
  textoChipActivo: { color: '#fff' },
  tarjetaProducto: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10, alignItems: 'center', elevation: 2 },
  boxIcono: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  emojiIcono: { fontSize: 28 },
  infoProducto: { flex: 1 },
  nombreProducto: { fontWeight: 'bold', fontSize: 14, color: '#1e293b' },
  categoriaProducto: { color: '#64748b', fontSize: 11 },
  precioProducto: { color: '#16a34a', fontWeight: 'bold', marginTop: 2, fontSize: 14 },
  textVerMas: { color: '#2563eb', fontWeight: 'bold', fontSize: 12 },
  botonVolver: { marginBottom: 15 },
  textoVolver: { color: '#2563eb', fontWeight: 'bold' },
  detalleContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center' },
  boxIconoGrande: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  emojiIconoGrande: { fontSize: 55 },
  nombreDetalle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#1e293b' },
  categoriaBadge: { backgroundColor: '#fef3c7', color: '#d97706', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, marginVertical: 6, fontWeight: 'bold' },
  descripcionText: { color: '#64748b', textAlign: 'center', marginVertical: 10, fontSize: 13 },
  precioDetalle: { fontSize: 22, color: '#16a34a', fontWeight: 'bold', marginVertical: 10 },
  inputCantidad: { backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1', width: 80, padding: 8, borderRadius: 8, textAlign: 'center', fontSize: 16, marginVertical: 10 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#1e293b' },
  textoVacio: { textAlign: 'center', color: '#64748b', marginTop: 30 },
  itemCarrito: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemNombre: { fontWeight: 'bold', fontSize: 13, color: '#1e293b' },
  itemDetalle: { color: '#64748b', fontSize: 11 },
  itemSubtotal: { fontWeight: 'bold', color: '#16a34a', marginLeft: 8 },
  controlesCantidad: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 6, paddingHorizontal: 4 },
  btnCantidad: { width: 26, height: 26, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e2e8f0', borderRadius: 4 },
  txtBtnCantidad: { fontWeight: 'bold', fontSize: 14 },
  numCantidad: { marginHorizontal: 8, fontWeight: 'bold', fontSize: 13 },
  seccionTitulo: { fontWeight: 'bold', marginTop: 15, marginBottom: 10, fontSize: 14, color: '#1e293b' },
  cardSeccionForm: { backgroundColor: '#fff', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 15 },
  tituloSubForm: { fontWeight: 'bold', color: '#1e293b', marginBottom: 8, fontSize: 13 },
  labelForm: { fontSize: 11, fontWeight: 'bold', color: '#475569', marginTop: 6, marginBottom: 2 },
  inputForm: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', padding: 8, borderRadius: 6, fontSize: 13 },
  opcionZona: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 6, backgroundColor: '#f8fafc' },
  opcionZonaActiva: { backgroundColor: '#1e293b', borderColor: '#1e293b' },
  txtZonaNombre: { fontWeight: 'bold', fontSize: 12, color: '#1e293b' },
  txtZonaTiempo: { fontSize: 11, color: '#64748b' },
  txtZonaCosto: { fontWeight: 'bold', fontSize: 13, color: '#16a34a' },
  txtBlanco: { color: '#fff' },
  txtBlancoMuted: { color: '#cbd5e1' },
  bannerTiempoEstimado: { backgroundColor: '#fef3c7', padding: 10, borderRadius: 6, marginTop: 10, alignItems: 'center' },
  txtBannerTiempo: { color: '#d97706', fontSize: 12 },
  metodosPagoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  opcionPago: { flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', marginHorizontal: 3, alignItems: 'center' },
  opcionPagoSeleccionada: { backgroundColor: '#1e293b', borderColor: '#1e293b' },
  textoPago: { fontSize: 11, fontWeight: 'bold', color: '#475569' },
  textoPagoSeleccionado: { color: '#fff' },
  resumenCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  filaResumen: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  botonPrincipal: { backgroundColor: '#1e293b', width: '100%', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  textoBoton: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', width: '100%', borderRadius: 12, padding: 20, elevation: 5 },
  modalTitulo: { fontSize: 17, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
  modalCliente: { color: '#64748b', fontSize: 12, marginBottom: 3 },
  modalBadgeTiempo: { backgroundColor: '#ecfdf5', padding: 8, borderRadius: 6, marginVertical: 8, borderWidth: 1, borderColor: '#a7f3d0' },
  txtModalTiempo: { color: '#047857', fontWeight: 'bold', fontSize: 12, textAlign: 'center' }
});