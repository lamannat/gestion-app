create extension if not exists pgcrypto;

create table if not exists public.unidades (
  id uuid not null default gen_random_uuid(),
  piso smallint not null,
  apartamento text not null,
  nombre_responsable text not null,
  dni_responsable text not null,
  mail_responsable text not null,
  tel_responsable text not null,
  superficie numeric(10,2) not null,
  constraint unidades_pkey primary key (id),
  constraint unidad_unica unique (piso, apartamento),
  constraint piso_no_negativo check (piso >= 0),
  constraint superficie_positiva check (superficie > 0)
);

alter table public.unidades
  add column if not exists superficie numeric(10,2);

alter table public.unidades
  drop constraint if exists superficie_positiva;

alter table public.unidades
  add constraint superficie_positiva check (superficie is null or superficie > 0);

create table if not exists public.gastos_ordinarios (
  id uuid not null default gen_random_uuid(),
  monto numeric(12,2) not null,
  descripcion text not null,
  constraint gastos_ordinarios_pkey primary key (id),
  constraint gastos_ordinarios_monto_positivo check (monto > 0)
);

create index if not exists idx_gastos_ordinarios_descripcion
  on public.gastos_ordinarios (descripcion);

-- Si esta migracion se aplica sobre una tabla unidades existente, cargar la
-- superficie real de las filas previas antes de endurecer la columna.
-- Ejemplo:
-- update public.unidades set superficie = 45.50 where piso = 1 and apartamento = 'A';
-- alter table public.unidades alter column superficie set not null;
