SELECT
    V_combos."Articulo", V_combos."Cantidad", V_combos."Precio", V_combos."Lista precio",
    Orden_trabajo_tipo."Empresa", Orden_trabajo_tipo."Combo", Orden_trabajo_tipo."Año inicio", Orden_trabajo_tipo."Año final", Orden_trabajo_tipo."Descripcion", Orden_trabajo_tipo."Carroceria", Orden_trabajo_tipo."Kilometraje", Orden_trabajo_tipo."Vds",
    Articulos."Descripcion articulo", Articulos."Cod linea",
    Empresas."Empresa", Empresas."Razon social", Empresas."Ruc",
    Tipo_transmision."Descripcion transmision",
    Tipo_combustible."Descripcion"
FROM
    { oj (((("Stock"."dbo"."V_combos" V_combos INNER JOIN "Stock"."dbo"."Articulos" Articulos ON
        V_combos."Empresa" = Articulos."Empresa" AND
    V_combos."Articulo" = Articulos."Articulo")
     INNER JOIN "stock"."dbo"."Empresas" Empresas ON
        V_combos."Empresa" = Empresas."Empresa")
     INNER JOIN "Stock"."dbo"."Orden trabajo tipo" Orden_trabajo_tipo ON
        V_combos."Empresa" = Orden_trabajo_tipo."Empresa" AND
    V_combos."Combo" = Orden_trabajo_tipo."Combo")
     INNER JOIN "Stock"."dbo"."Tipo combustible" Tipo_combustible ON
        Orden_trabajo_tipo."Tipo combustible" = Tipo_combustible."Tipo combustible")
     INNER JOIN "Stock"."dbo"."Tipo transmision" Tipo_transmision ON
        Orden_trabajo_tipo."Cod transmision" = Tipo_transmision."Cod transmision"}
WHERE
    Orden_trabajo_tipo."Empresa" = 1 AND
    Orden_trabajo_tipo."Año inicio" >= 0 AND
    Orden_trabajo_tipo."Año final" <= 9999
ORDER BY
    Orden_trabajo_tipo."Vds" ASC,
    Orden_trabajo_tipo."Combo" ASC,
    Articulos."Cod linea" ASC,
    V_combos."Articulo" ASC
