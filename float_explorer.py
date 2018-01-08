import sqlite3
from contextlib import closing
from flask import Flask, request, session, g, redirect, url_for, \
    abort, render_template, flash, send_file, jsonify, send_from_directory
from datetime import datetime
from math import floor

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

################
# PAGE ROUTING #
################


@app.route('/')
def dashboard():
    cur = g.db.execute('SELECT * FROM meta ORDER BY dt_report desc')
    entries = cur.fetchall()

    # Update delta for each float
    dt_query = datetime.utcnow()
    # dt_query = datetime.strptime('2015-11-19 16:12:04', '%Y-%m-%d %H:%M:%S')
    for entry in entries:
        # Compute delta_deploy
        if entry['dt_deploy'] != '':
            foo = dt_query - datetime.strptime(
                entry['dt_deploy'], '%Y-%m-%d %H:%M:%S')
            if foo.days >= 2:
                entry['delta_deploy'] = str(foo.days) + ' d'
            else:
                h = int(foo.total_seconds()/3600)
                m = floor((foo.total_seconds()-h*3600)/60)
                entry['delta_deploy'] = '%02d:%02d'%(h,m)
        # Compute delta_report
        if entry['dt_report'] != '':
            foo = dt_query - datetime.strptime(
                entry['dt_report'], '%Y-%m-%d %H:%M:%S')
            if foo.days >= 2:
                entry['delta_report'] = str(foo.days) + ' d'
            else:
                h = int(foo.total_seconds()/3600)
                m = floor((foo.total_seconds()-h*3600)/60)
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
        # Render Missing WMO
        if entry['wmo'] < 0:
            entry['wmo'] = 'NA'
    return render_template('dashboard.html', entries=entries)


@app.route('/float/')
@app.route('/float/<lab_id>')
def float(lab_id=None):
    # Get float list
    cur = g.db.execute('SELECT wmo,lab_id FROM meta ORDER BY lab_id asc')
    float_list =  cur.fetchall()
    # Re-route to first float
    if lab_id == None:
        return redirect(url_for('float', lab_id=float_list[-1]['lab_id']))
    # Render page
    return render_template('float.html', float_list=float_list, lab_id=lab_id)


@app.route('/engineering/')
@app.route('/engineering/<lab_id>')
def engineering(lab_id=None, pi='Emmanuel Boss'):
    # Get float list
    cur = g.db.execute('SELECT wmo,lab_id FROM meta WHERE pi = "'+ pi +'" ORDER BY lab_id asc')
    float_list =  cur.fetchall()
    # Re-route to first float
    if lab_id == None:
        return redirect(url_for('engineering', lab_id=float_list[-1]['lab_id']))
    # Render page
    return render_template('engineering.html', float_list=float_list, lab_id=lab_id)


@app.route('/documentation')
def documentation():
    return render_template('documentation.html')


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.errorhandler(500)
def page_not_found(e):
    return render_template('500.html'), 500


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

###############
# API routing #
###############

@app.route('/api/eng/<lab_id>/<varname>')
def api_eng(lab_id, varname):
    cur = g.db.execute('SELECT dt, ' + varname + ' ' +
                       'FROM engineering_data ' +
                       'WHERE lab_id = "' + lab_id + '" ' +
                       'ORDER BY profile_id desc')
    data = cur.fetchall()
    return jsonify(x=[foo['dt'] for foo in data if foo['dt'] is not None],
                   y=[foo[varname] for foo in data if foo[varname] is not None],
                   type='scatter')


if __name__ == '__main__':
    app.run()
