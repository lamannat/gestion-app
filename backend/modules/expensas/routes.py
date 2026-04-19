from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

from flask import Blueprint, jsonify

from database import supabase

expensas_bp = Blueprint("expensas", __name__)


def to_decimal(value):
    try:
        return Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError):
        return Decimal("0")


def money(value):
    return float(value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


@expensas_bp.get("/calcular")
def calcular_expensas():
    try:
        gastos_res = supabase.table("gastos_ordinarios").select("monto").execute()
        unidades_res = (
            supabase.table("unidades")
            .select("id, piso, apartamento, nombre_responsable, superficie")
            .order("piso")
            .order("apartamento")
            .execute()
        )

        gastos = gastos_res.data or []
        unidades = unidades_res.data or []

        if not unidades:
            return jsonify({"error": "No hay unidades para calcular expensas"}), 400

        superficies = []
        for unidad in unidades:
            superficie = to_decimal(unidad.get("superficie"))
            if superficie <= 0:
                unidad_label = f"{unidad.get('piso')} {unidad.get('apartamento')}"
                return jsonify({"error": f"La unidad {unidad_label} no tiene superficie positiva"}), 400
            superficies.append((unidad, superficie))

        total_gastos = sum((to_decimal(gasto.get("monto")) for gasto in gastos), Decimal("0"))
        total_superficie = sum((superficie for _, superficie in superficies), Decimal("0"))

        expensas = []
        for unidad, superficie in superficies:
            proporcion = superficie / total_superficie
            monto = total_gastos * proporcion
            expensas.append(
                {
                    "unidad_id": unidad.get("id"),
                    "piso": unidad.get("piso"),
                    "apartamento": unidad.get("apartamento"),
                    "nombre_responsable": unidad.get("nombre_responsable"),
                    "superficie": float(superficie),
                    "porcentaje": float((proporcion * Decimal("100")).quantize(Decimal("0.0001"))),
                    "monto": money(monto),
                }
            )

        return (
            jsonify(
                {
                    "total_gastos": money(total_gastos),
                    "total_superficie": float(total_superficie),
                    "expensas": expensas,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
