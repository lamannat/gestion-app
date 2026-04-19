from decimal import Decimal, InvalidOperation

from flask import Blueprint, jsonify, request

from database import supabase

unidades_bp = Blueprint("unidades", __name__)


REQUIRED_FIELDS = (
    "piso",
    "apartamento",
    "nombre_responsable",
    "dni_responsable",
    "mail_responsable",
    "tel_responsable",
    "superficie",
)


def parse_piso(value):
    try:
        piso = int(value)
    except (TypeError, ValueError):
        return None

    if piso < 0:
        return None

    return piso


def parse_superficie(value):
    try:
        superficie = Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError):
        return None

    if superficie <= 0:
        return None

    return str(superficie)


def build_payload(data, partial=False):
    if not partial:
        missing = [field for field in REQUIRED_FIELDS if data.get(field) in (None, "")]
        if missing:
            return None, f"Campos requeridos: {', '.join(missing)}"

    payload = {}

    if "piso" in data:
        piso = parse_piso(data.get("piso"))
        if piso is None:
            return None, "Piso debe ser un entero no negativo"
        payload["piso"] = piso

    for field in (
        "apartamento",
        "nombre_responsable",
        "dni_responsable",
        "mail_responsable",
        "tel_responsable",
    ):
        if field in data:
            value = (data.get(field) or "").strip()
            if not value:
                return None, f"{field} es requerido"
            payload[field] = value

    if "superficie" in data:
        superficie = parse_superficie(data.get("superficie"))
        if superficie is None:
            return None, "Superficie debe ser mayor a cero"
        payload["superficie"] = superficie

    return payload, None


@unidades_bp.get("/")
def listar_unidades():
    try:
        res = (
            supabase.table("unidades")
            .select(
                "id, piso, apartamento, nombre_responsable, dni_responsable, "
                "mail_responsable, tel_responsable, superficie"
            )
            .order("piso")
            .order("apartamento")
            .execute()
        )
        return jsonify(res.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@unidades_bp.post("/")
def crear_unidad():
    data = request.get_json(silent=True) or {}
    payload, error = build_payload(data)
    if error:
        return jsonify({"error": error}), 400

    try:
        res = supabase.table("unidades").insert(payload).execute()
        return jsonify(res.data[0] if res.data else None), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@unidades_bp.put("/<string:unidad_id>")
def actualizar_unidad(unidad_id):
    data = request.get_json(silent=True) or {}
    payload, error = build_payload(data, partial=True)
    if error:
        return jsonify({"error": error}), 400

    if not payload:
        return jsonify({"error": "No hay campos para actualizar"}), 400

    try:
        res = supabase.table("unidades").update(payload).eq("id", unidad_id).execute()
        if not res.data:
            return jsonify({"error": "Unidad no encontrada"}), 404
        return jsonify(res.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@unidades_bp.delete("/<string:unidad_id>")
def eliminar_unidad(unidad_id):
    try:
        res = supabase.table("unidades").delete().eq("id", unidad_id).execute()
        if not res.data:
            return jsonify({"error": "Unidad no encontrada"}), 404
        return jsonify({"message": "Unidad eliminada exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
