export default function PublicFooter() {
  return (
    <footer className="bg-honda-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="font-bold text-sm mb-3">VICAR S.A.</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Concesionario oficial Honda Paraguay. Venta, postventa y repuestos genuinos.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3">Enlaces</h4>
            <ul className="space-y-1 text-xs text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Vehiculos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Propietarios</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Buscar Concesionario</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3">Contacto</h4>
            <p className="text-xs text-gray-400">(021) 600-1234</p>
            <p className="text-xs text-gray-400">info@vicar.com.py</p>
            <p className="text-xs text-gray-400 mt-1">Asuncion, Paraguay</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} VICAR S.A. — Honda Paraguay. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
