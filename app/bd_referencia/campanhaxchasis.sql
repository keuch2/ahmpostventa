SELECT
    Campañas."Empresa", Campañas."Registro campaña", Campañas."Fecha", Campañas."Tipo campaña", Campañas."Comentario campaña", Campañas."Inactivo",
    Empresas."Razon social", Empresas."Ruc",
    Campañas_detalles."Nro chassis", Campañas_detalles."Fecha venta", Campañas_detalles."Numero ot", Campañas_detalles."Realizado",
    Vehiculos."Matricula", Vehiculos."Año", Vehiculos."Carroceria",
    x_campaña_saldo_2."fecha nreparacion", x_campaña_saldo_2."UltNombCliente", x_campaña_saldo_2."Celular",
    Clientes."Cliente", Clientes."Razon social", Clientes."Telefono", Clientes."Prefijos", Clientes."Celular2", Clientes."Email contacto"
FROM
    { oj (((("stock"."dbo"."Campañas" Campañas INNER JOIN "stock"."dbo"."Campañas detalles" Campañas_detalles ON
        Campañas."Empresa" = Campañas_detalles."Empresa" AND
    Campañas."Registro campaña" = Campañas_detalles."Registro campaña")
     INNER JOIN "stock"."dbo"."Empresas" Empresas ON
        Campañas."Empresa" = Empresas."Empresa")
     LEFT OUTER JOIN "Stock"."dbo"."Vehiculos" Vehiculos ON
        Campañas_detalles."Empresa" = Vehiculos."Empresa" AND
    Campañas_detalles."Nro chassis" = Vehiculos."Nro chassis")
     INNER JOIN "Stock"."dbo"."x campaña saldo 2" x_campaña_saldo_2 ON
        Vehiculos."Nro chassis" = x_campaña_saldo_2."Nro chassis")
     LEFT OUTER JOIN "Stock"."dbo"."Clientes" Clientes ON
        Vehiculos."Empresa" = Clientes."Empresa" AND
    Vehiculos."Cliente" = Clientes."Cliente" AND
    Vehiculos."Cod sucursal" = Clientes."Cod sucursal"}
WHERE
    Campañas."Empresa" = 1
ORDER BY
    Campañas_detalles."Nro chassis" ASC