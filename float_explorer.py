import sqlite3
from contextlib import closing
from flask import Flask, request, session, g, redirect, url_for, \
    abort, render_template, flash, send_file, jsonify
from datetime import datetime

app = Flask(__name__)

# Load application's settings
# Load configuration from environment variable
# export FLOAT_EXPLORER_SETTINGS='/path/to/config/file'
# app.config.from_envvar('FLOAT_EXPLORER_SETTINGS', silent=False)
# Load configuration from python file
app.config.from_pyfile('float_explorer_conf.py')

############
# DATABASE #
############
# Create database from command line
# sqlite3 /tmp/float_explorer.db < schema.sql
# Create database from app
# run python & from float_explorer import init_db & init_db()


def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()


def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

def make_dicts(cursor, row):
    return dict((cursor.description[idx][0], value)
                for idx, value in enumerate(row))

@app.before_request
def before_request():
    g.db = connect_db()
    # g.db.row_factory = sqlite3.Row
    g.db.row_factory = make_dicts


@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

# NOTE: g is a magic object that store the database connection
#         is avaible within each function
#         works in threaded environment

###########
# ROUTING #
###########


@app.route('/')
def dashboard():
    cur = g.db.execute('SELECT * FROM meta ORDER BY lab_id asc')
    entries = cur.fetchall()

    # Update delta for each float
    dt_query = datetime.utcnow()
    # dt_query = datetime.strptime('2015-11-19 16:12:04', '%Y-%m-%d %H:%M:%S')
    for entry in entries:
        # Compute delta_deploy
        if entry['dt_deploy'] != '':
            foo = dt_query - datetime.strptime(
                entry['dt_deploy'], '%Y-%m-%d %H:%M:%S')
            if foo.days > 2:
                entry['delta_deploy'] = str(foo.days) + ' d'
            else:
                h = int(foo.total_seconds()/3600)
                m = round((foo.total_seconds()-h*3600)/60)
                entry['delta_report'] = '%02d:%02d'%(h,m)
        # Compute delta_report
        if entry['dt_report'] != '':
            foo = dt_query - datetime.strptime(
                entry['dt_report'], '%Y-%m-%d %H:%M:%S')
            if foo.days > 2:
                entry['delta_report'] = str(foo.days) + ' d'
            else:
                h = int(foo.total_seconds()/3600)
                m = round((foo.total_seconds()-h*3600)/60)
                entry['delta_report'] = '%02d:%02d'%(h,m)
            # Set Status
            if foo.days < 10:
                entry['status'] = 'active'
            elif foo.days < 30:
                entry['status'] = 'unexpected'
            else:
                entry['status'] = 'inactive'
        # Render Latitude & Longitude
        if entry['lat_report'] != -9999:
            if entry['lat_report'] >= 0:
                entry['lat_report'] = '%.3f &deg;N'%entry['lat_report']
            else:
                entry['lat_report'] = '%.3f &deg;S'%abs(entry['lat_report'])
        if entry['lon_report'] != -9999:
            if entry['lon_report'] >= 0:
                entry['lon_report'] = '%.3f &deg;E'%entry['lon_report']
            else:
                entry['lon_report'] = '%.3f &deg;W'%abs(entry['lon_report'])
        # Render Profile id (Specific to PROVOR)
        if 'PROVOR' in entry['model']:
            entry['profile'] = entry['profile'] / 100
    return render_template('dashboard.html', entries=entries)


@app.route('/float/')
@app.route('/float/<lab_id>')
def float(lab_id=None):
    # Get list of floats
    cur = g.db.execute('SELECT wmo,lab_id FROM meta ORDER BY lab_id asc')
    float_list = cur.fetchall()
    # Re-route to first float
    if lab_id == None:
        return redirect(url_for('float', lab_id=float_list[0]['lab_id']))
    # Render page
    return render_template('float.html', float_list=float_list, lab_id=lab_id)


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.errorhandler(500)
def page_not_found(e):
    return render_template('500.html'), 500


if __name__ == '__main__':
    app.run()
