Float Explorer
==============

*Float Explorer* is a web application to explore profiles from BGC-Argo floats and monitor their status. It's developp on python 2.7 or 3.5 on top of flask, SQLite3 and FloatProcessor.

# Installation
Require python 2.7 or 3.6
  + flask
  + SQLite 3

An additional package is *FloatProcessor* which can run in parallel as *FloatExplorer* and will update the database used by *FloatExplorer*.

# Configuration
Update line 14 of float_explorer.py with the name of your configuration file.
    app.config.from_pyfile('float_explorer_conf.py')
The default configuration file is default_conf.py


# TODO
  + Add APEX floats
  + Add Provor Floats
  + Dashboard page
    + Order by status, PI, Host...
    + Add time of last update from server
  + Float Data page
    + Float Metadata
    + Float Data 3D plots
  + Map page
  + Documentation page
  + Link to data on FTP
