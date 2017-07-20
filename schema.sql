drop table if exists entries;
create table meta (
  id integer primary key autoincrement,
  wmo integer not null,
  lab_id text not null,
  pi text not null,
  host text not null,
  profile integer not null,
  dt_deploy text not null,
  lat_deploy real not null,
  lon_deploy real not null,
  dt_report text not null,
  lat_report real not null,
  lon_report real not null,
  status text not null
);