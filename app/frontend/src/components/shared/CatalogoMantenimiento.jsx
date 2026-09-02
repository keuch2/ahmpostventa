import { useMemo, useState } from 'react';
import DATA from '../../data/catalogo-mantenimiento.json';
import './CatalogoMantenimiento.css';

/*
 * Catálogo de Mantenimiento HONDA (modo mostrador).
 * Portado de "Catalogo Mantenimiento HONDA (mostrador).html": bloque "Selección"
 * + ficha, KPIs y detalle del mantenimiento. Sin encabezado ni búsqueda por VIN.
 */

const A = DATA.arts;
const V = DATA.variantes;
const M = DATA.meta;

const MODELOS = [...new Set(V.map((v) => v.modelo))];

/* ---------- utilidades ---------- */
const gs = (n) => Math.round(n).toLocaleString('es-PY');
const kmf = (n) => n.toLocaleString('es-PY');
const pl = (n, s, p) => `${n} ${n === 1 ? s : p}`;
const artOf = (i) => A[i];
const isMO = (i) => A[i].m === 1;
const cubre = (v, y) => y >= v.ai && y <= v.af;
const parseKm = (s) => parseInt((s || '').replace(/\D/g, ''), 10) || 0;

const aniosDe = (modelo) =>
  [...new Set(
    V.filter((v) => v.modelo === modelo)
      .flatMap((v) => { const a = []; for (let y = v.ai; y <= v.af; y++) a.push(y); return a; })
  )].sort((a, b) => b - a);

/* variantes que cumplen modelo + año exacto */
const candidatas = (modelo, anio) => V.filter((v) => v.modelo === modelo && cubre(v, +anio));

/*
 * Normaliza la selección en cascada: cada nivel conserva su valor si sigue
 * disponible tras cambiar un filtro de arriba; si no, toma la primera opción.
 */
function cascade({ modelo, anio, grado, varId }) {
  if (!modelo) return { modelo: '', anio: '', grado: '', varId: '', anios: [], grados: [], variantes: [] };

  const anios = aniosDe(modelo);
  const y = anios.includes(+anio) ? String(anio) : String(anios[0]);

  const cands = candidatas(modelo, y);
  const grados = [...new Set(cands.map((v) => v.grado))];
  const g = grados.includes(grado) ? grado : grados[0];

  const variantes = cands.filter((v) => v.grado === g);
  const id = variantes.some((v) => v.id === varId) ? varId : variantes[0].id;

  return { modelo, anio: y, grado: g, varId: id, anios, grados, variantes };
}

export default function CatalogoMantenimiento() {
  const [sel, setSel] = useState(() => cascade({ modelo: '', anio: '', grado: '', varId: '' }));
  const [kmIdx, setKmIdx] = useState('');
  const [kmAct, setKmAct] = useState('');

  const variante = useMemo(() => V.find((x) => x.id === sel.varId) || null, [sel.varId]);

  /* si dos VDS comparten modelo, año, versión y combustible, se muestra el VDS */
  const veces = {};
  sel.variantes.forEach((v) => { veces[v.comb] = (veces[v.comb] || 0) + 1; });
  const repetido = Object.values(veces).some((n) => n > 1);

  const aplicar = (cambios) => {
    const next = cascade({ ...sel, ...cambios });
    setSel(next);
    /* conservar el kilometraje elegido si la nueva variante tiene el mismo km */
    if (next.varId !== sel.varId) {
      const prevKm = variante && kmIdx !== '' ? variante.combos[+kmIdx]?.km ?? null : null;
      const nv = V.find((x) => x.id === next.varId);
      const j = nv && prevKm !== null ? nv.combos.findIndex((c) => c.km === prevKm) : -1;
      setKmIdx(j >= 0 ? String(j) : '');
    }
  };

  const onKmAct = (val) => {
    setKmAct(val);
    const k = parseKm(val);
    if (variante && k > 0) {
      const j = variante.combos.findIndex((c) => c.km > k);
      setKmIdx(j >= 0 ? String(j) : '');
    }
  };

  const combo = variante && kmIdx !== '' ? variante.combos[+kmIdx] : null;
  const kmNum = parseKm(kmAct);

  return (
    <div className="catmant catmant-print">
      {/* ---------- Selección ---------- */}
      <div className="card" id="catmant-sel">
        <h2>Selección <span>Elegí modelo, año, versión y combustible</span></h2>
        <div className="pad">
          <div className="grid g3">
            <div>
              <label className="lbl" htmlFor="catmant-mod">Modelo</label>
              <select id="catmant-mod" value={sel.modelo} onChange={(e) => aplicar({ modelo: e.target.value })}>
                <option value="">— Elegir modelo —</option>
                {MODELOS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl" htmlFor="catmant-anio">Año</label>
              <select id="catmant-anio" value={sel.anio} disabled={!sel.modelo} onChange={(e) => aplicar({ anio: e.target.value })}>
                {!sel.modelo && <option value="">—</option>}
                {sel.anios.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl" htmlFor="catmant-ver">Versión / grado</label>
              <select id="catmant-ver" value={sel.grado} disabled={!sel.modelo} onChange={(e) => aplicar({ grado: e.target.value })}>
                {!sel.modelo && <option value="">—</option>}
                {sel.grados.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl" htmlFor="catmant-comb">Combustible</label>
              <select id="catmant-comb" value={sel.varId} disabled={!sel.modelo} onChange={(e) => aplicar({ varId: e.target.value })}>
                {!sel.modelo && <option value="">—</option>}
                {sel.variantes.map((v) => (
                  <option key={v.id} value={v.id}>
                    {veces[v.comb] > 1 ? `${v.comb} · VDS ${v.vds}` : v.comb}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="lbl" htmlFor="catmant-selkm">Kilometraje del mantenimiento</label>
              <select id="catmant-selkm" value={kmIdx} disabled={!variante} onChange={(e) => setKmIdx(e.target.value)}>
                {variante
                  ? <option value="">— Elegir kilometraje —</option>
                  : <option value="">—</option>}
                {variante && variante.combos.map((c, i) => (
                  <option key={c.k} value={String(i)}>{kmf(c.km)} km</option>
                ))}
              </select>
            </div>
            <div>
              <label className="lbl" htmlFor="catmant-km">
                Kilometraje actual del vehículo <span style={{ textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
              </label>
              <input
                className="txt"
                id="catmant-km"
                inputMode="numeric"
                placeholder="Ej. 47000"
                autoComplete="off"
                value={kmAct}
                onChange={(e) => onKmAct(e.target.value)}
              />
            </div>
          </div>
          <p className="note">
            {repetido
              ? `Este modelo, año, versión y combustible existe con ${sel.variantes.length} VDS distintos. Confirmá el VDS en el chasis para elegir el correcto.`
              : ''}
          </p>
        </div>
      </div>

      {/* ---------- Resultado ---------- */}
      {!variante && (
        <div className="hint">
          <b>Elegí el vehículo.</b> Seleccioná modelo, año, versión y combustible.
        </div>
      )}

      {variante && (
        <>
          <div className="ficha">
            <div className="fi"><div className="k">Modelo</div><div className="v">{variante.modelo}</div></div>
            <div className="fi"><div className="k">Versión</div><div className="v">{variante.grado}</div></div>
            <div className="fi"><div className="k">VDS</div><div className="v m">{variante.vds}</div></div>
            <div className="fi">
              <div className="k">Año</div>
              <div className="v m">{sel.anio || `${variante.ai}–${variante.af}`}<small> · {variante.ai}–{variante.af}</small></div>
            </div>
            <div className="fi"><div className="k">Combustible</div><div className="v">{variante.comb}</div></div>
            <div className="fi"><div className="k">Equipamiento</div><div className="v">{variante.equip}</div></div>
          </div>

          {kmNum > 0 && (() => {
            const nx = variante.combos.find((c) => c.km > kmNum);
            return nx ? (
              <div className="msg warn">Con <b>{kmf(kmNum)} km</b>, el próximo mantenimiento es el de <b>{kmf(nx.km)} km</b>.</div>
            ) : (
              <div className="msg ok">Con <b>{kmf(kmNum)} km</b> el vehículo superó el último kilometraje cargado. A partir de acá el ciclo se repite: elegí el kilometraje equivalente.</div>
            );
          })()}

          {!combo && (
            <div className="hint">
              <b>Elegí el kilometraje del mantenimiento</b> para ver los repuestos, la mano de obra y el precio.
            </div>
          )}

          {combo && <Resultado v={variante} c={combo} idx={+kmIdx} />}
        </>
      )}

      <div className="foot">
        Mano de obra tarifada a Gs. {gs(M.tarifaMO)} por hora. Los tiempos se muestran en minutos.<br />
        Precios de referencia sujetos a la lista vigente al {M.fecha}. No sustituye al presupuesto emitido por el sistema.
      </div>
    </div>
  );
}

function Resultado({ v, c, idx }) {
  const rpi = c.i.filter((x) => !isMO(x[0]));
  const moi = c.i.filter((x) => isMO(x[0]));
  const min = moi.reduce((s, x) => s + x[1], 0) * 0.6;
  const tramo = c.km - (v.combos[idx - 1] ? v.combos[idx - 1].km : 0);

  return (
    <>
      <div className="kpis">
        <div className="kpi n">
          <div className="k">Mantenimiento<br />de {kmf(c.km)} km</div>
          <div className="v">{gs(c.t)}</div>
          <div className="s">Gs. · {pl(c.i.length, 'ítem', 'ítems')}</div>
        </div>
        <div className="kpi">
          <div className="k">Repuestos e insumos</div>
          <div className="v">{gs(c.rp)}</div>
          <div className="s">{(c.rp / c.t * 100).toFixed(1)}% de este mantenimiento · {pl(rpi.length, 'ítem', 'ítems')}</div>
        </div>
        <div className="kpi g">
          <div className="k">Mano de obra</div>
          <div className="v">{gs(c.mo)}</div>
          <div className="s">{(c.mo / c.t * 100).toFixed(1)}% de este mantenimiento · {pl(moi.length, 'operación', 'operaciones')}</div>
        </div>
        <div className="kpi">
          <div className="k">Tiempo de taller</div>
          <div className="v">{min.toFixed(0)}</div>
          <div className="s">minutos · {(min / 60).toFixed(1)} h</div>
        </div>
        <div className="kpi">
          <div className="k">Costo por kilómetro<br />del tramo</div>
          <div className="v">{gs(c.t / tramo)}</div>
          <div className="s">Gs./km · tramo de {kmf(tramo)} km</div>
        </div>
      </div>

      <div className="card">
        <h2>Detalle del mantenimiento de {kmf(c.km)} km <span>{v.modelo} {v.grado} · {v.comb}</span></h2>
        <div className="pad">
          <Detalle rp={rpi} mo={moi} />
          <div className="tools">
            <button type="button" className="btn ghost sm" onClick={() => window.print()}>IMPRIMIR</button>
          </div>
        </div>
      </div>
    </>
  );
}

function Detalle({ rp, mo }) {
  const trp = rp.reduce((s, x) => s + artOf(x[0]).p * x[1], 0);
  const tmo = mo.reduce((s, x) => s + artOf(x[0]).p * x[1], 0);
  const minutos = (mo.reduce((s, x) => s + x[1], 0) * 0.6).toFixed(0);

  return (
    <div className="detgrid">
      {rp.length > 0 && <TablaDetalle rows={rp} titulo={`Repuestos e insumos · ${rp.length} ítems`} total={trp} esMO={false} />}
      {mo.length > 0 && <TablaDetalle rows={mo} titulo={`Mano de obra · ${minutos} minutos`} total={tmo} esMO />}
    </div>
  );
}

function TablaDetalle({ rows, titulo, total, esMO }) {
  return (
    <div>
      <h4>{titulo}</h4>
      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th className="num">{esMO ? 'Minutos' : 'Cant.'}</th>
              <th className="num">Unit.</th>
              <th className="num">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x, i) => {
              const a = artOf(x[0]);
              return (
                <tr key={`${a.c}-${i}`}>
                  <td className="mono">{a.c}</td>
                  <td>{a.d}</td>
                  <td className="num">{esMO ? (x[1] * 0.6).toFixed(0) : x[1]}</td>
                  <td className="num">{gs(a.p)}</td>
                  <td className="num">{gs(a.p * x[1])}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="num">Subtotal</td>
              <td className="num"></td>
              <td className="num">{gs(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
