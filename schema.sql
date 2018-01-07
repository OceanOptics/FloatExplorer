drop table if exists meta;
create table meta (
  id integer primary key autoincrement,
  wmo integer not null,
  lab_id text not null,
  pi text not null,
  project text not null,
  model text not null,
  profile integer not null,
  dt_deploy text not null,
  lat_deploy real not null,
  lon_deploy real not null,
  dt_report text not null,
  lat_report real not null,
  lon_report real not null,
  status text not null
);
drop table if exists engineering_data;
create table engineering_data (
  id integer primary key autoincrement,
  lab_id text not null,
  profile_id integer not null,
  dt text not null,
  AirPumpAmps real not null,
  AirPumpVolts real not null,
  BuoyancyPumpAmps real not null,
  BuoyancyPumpVolts real not null,
  QuiescentAmps real not null,
  QuiescentVolts real not null,
  Sbe41cpAmps real not null,
  Sbe41cpVolts real not null,
  McomsAmps real not null,
  McomsVolts real not null,
  Sbe63Amps real not null,
  Sbe63Volts real not null
);