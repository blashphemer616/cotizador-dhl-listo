import React, { useState } from 'react';
import {
  FaBoxOpen, FaWeightHanging, FaRulerCombined, FaMapMarkerAlt,
  FaMapMarkedAlt, FaRoute, FaCalculator, FaFileInvoiceDollar,
  FaBox, FaWeight, FaTag, FaCube, FaTruck, FaDollarSign,
  FaRedo, FaPrint
} from 'react-icons/fa';

const styles = `
  :root {
    --dhl-yellow: #FFCC00;
    --dhl-red: #D40511;
    --dhl-dark: #222;
  }
  .dhl-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f8f9fa;
    color: #333;
    padding: 20px;
  }
  .dhl-header {
    background: linear-gradient(135deg, var(--dhl-red), var(--dhl-yellow));
    color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    overflow: hidden;
  }
  .dhl-logo {
    height: 60px;
    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));
  }
  .form-container {
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
  }
  .form-container:hover {
    box-shadow: 0 6px 24px rgba(0,0,0,0.12);
  }
  .btn-dhl {
    background-color: var(--dhl-red);
    color: white;
    font-weight: bold;
    padding: 12px 24px;
    border: none;
    transition: all 0.3s;
  }
  .btn-dhl:hover {
    background-color: #b30000;
    transform: translateY(-2px);
  }
  .result-card {
    border-left: 5px solid var(--dhl-yellow);
    animation: fadeIn 0.5s ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .package-icon {
    font-size: 24px;
    margin-right: 10px;
    color: var(--dhl-red);
  }
  .form-label {
    font-weight: 600;
    color: var(--dhl-dark);
  }
  .total-container {
    background-color: #FFF9C4;
    border-radius: 8px;
  }
`;

const DHLShippingCalculator = () => {
  const [formData, setFormData] = useState({
    tipoPaquete: '', peso: '', ancho: '', alto: '', fondo: '',
    origen: '', destino: '', distancia: ''
  });

  const [resultados, setResultados] = useState({
    show: false, tipo: '-', peso: '- kg', volumen: '- cm³', distancia: '- km',
    base: '$0.00', vol: '$0.00', transporte: '$0.00', total: '$0.00'
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validarDatos = (peso, ancho, alto, fondo, distancia, tipo) => {
    if (isNaN(peso) || peso <= 0) return false;
    if (isNaN(ancho) || isNaN(alto) || isNaN(fondo) || ancho <= 0 || alto <= 0 || fondo <= 0) return false;
    if (isNaN(distancia) || distancia <= 0) return false;
    switch(tipo) {
      case 'sobre': return peso >= 0.01 && peso <= 0.5;
      case 'caja': return peso > 0.5 && peso <= 20;
      case 'tarima': return peso > 20 && peso <= 50;
      case 'contenedor': return peso > 50 && peso <= 5000;
      default: return false;
    }
  };

  const calcularVolumen = (a, h, f) => a * h * f;
  const calcularCostoBase = (tipo, peso) => ({
    sobre: 20, caja: 100, tarima: 500, contenedor: Math.ceil(peso / 50) * 600
  }[tipo] || 0);
  const calcularCostoVolumen = v => v * 0.01;
  const calcularCostoTransporte = d => d * 5;

  const handleSubmit = e => {
    e.preventDefault();
    const { tipoPaquete, peso, ancho, alto, fondo, distancia } = formData;
    const [p, a, h, f, d] = [peso, ancho, alto, fondo, distancia].map(parseFloat);
    if (!validarDatos(p, a, h, f, d, tipoPaquete)) return alert("Datos inválidos");
    const v = calcularVolumen(a, h, f);
    const base = calcularCostoBase(tipoPaquete, p);
    const vol = calcularCostoVolumen(v);
    const trans = calcularCostoTransporte(d);
    const total = base + vol + trans;
    const tipoTexto = { sobre: 'Sobre', caja: 'Caja', tarima: 'Tarima', contenedor: 'Contenedor' }[tipoPaquete];

    setResultados({
      show: true, tipo: tipoTexto, peso: `${p} kg`, volumen: `${v} cm³`, distancia: `${d} km`,
      base: `$${base.toFixed(2)}`, vol: `$${vol.toFixed(2)}`, transporte: `$${trans.toFixed(2)}`,
      total: total.toFixed(2)
    });
  };
 // ✅ Enviar al backend PHP
  fetch("http://localhost/cotizacion.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tipo_paquete: tipoPaquete,
      peso: p,
      ancho: a,
      alto: h,
      fondo: f,
      volumen: v,
      origen: origen,
      destino: destino,
      distancia: d,
      costo_base: base,
      costo_volumen: vol,
      costo_transporte: trans,
      total: total
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("✅ Cotización guardada correctamente en MySQL");
    } else {
      alert("❌ Error al guardar cotización");
      console.error(data);
    }
  })
  .catch(err => {
    console.error("❌ Error al conectar con PHP:", err);
    alert("❌ Error de red al conectar con el servidor");
  });

  const resetearFormulario = () => {
    setFormData({ tipoPaquete: '', peso: '', ancho: '', alto: '', fondo: '', origen: '', destino: '', distancia: '' });
    setResultados(prev => ({ ...prev, show: false }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const style = document.createElement('style');
  style.innerHTML = styles;
  document.head.appendChild(style);

  return (
    <div className="dhl-container">
      <h2 className="dhl-header">Cotizador DHL</h2>
      <form className="form-container" onSubmit={handleSubmit}>
        <select name="tipoPaquete" onChange={handleChange} required>
          <option value="">Tipo de paquete</option>
          <option value="sobre">Sobre</option>
          <option value="caja">Caja</option>
          <option value="tarima">Tarima</option>
          <option value="contenedor">Contenedor</option>
        </select><br />
        <input name="peso" placeholder="Peso (kg)" onChange={handleChange} /><br />
        <input name="ancho" placeholder="Ancho (cm)" onChange={handleChange} /><br />
        <input name="alto" placeholder="Alto (cm)" onChange={handleChange} /><br />
        <input name="fondo" placeholder="Fondo (cm)" onChange={handleChange} /><br />
        <input name="distancia" placeholder="Distancia (km)" onChange={handleChange} /><br />
        <button type="submit" className="btn-dhl">Calcular</button>
      </form>
      {resultados.show && (
        <div className="result-card total-container">
          <h3>Total a Pagar: ${resultados.total} MXN</h3>
          <p>Tipo: {resultados.tipo}</p>
          <p>Peso: {resultados.peso}</p>
          <p>Volumen: {resultados.volumen}</p>
          <p>Distancia: {resultados.distancia}</p>
          <p>Costo Base: {resultados.base}</p>
          <p>Costo Volumen: {resultados.vol}</p>
          <p>Costo Transporte: {resultados.transporte}</p>
          <button onClick={resetearFormulario}>Nueva Cotización</button>
        </div>
      )}
    </div>
  );
};

const Precios = DHLShippingCalculator;
export default Precios;
