/*!
 * Profile Explorer v0.1.1
 * Copyright 2017 Nils Haentjens
 *
 */

//////////////////////
// Global Variables //
//////////////////////
/*
 * The following global variables should be set in the parent script:
 *    usr_id
 *    path2data
 *
 */
// var path2data = '/static/data/'
// var usr_id = 'n0572';
var msg_id = 1;
var last_msg_id = 1;
var msg_ids = null;
var msg_dts = null;

////////////////////
// Plotly Options //
////////////////////
var options = {
  displaylogo: false,
  showLink: false,
  // linkText: 'Change this text',
  staticPlot: false,
  scrollZoom: false,
  displayModeBar:true
};
// default colors in order: ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"]

////////////////////
// Figures Layout //
////////////////////
var ts_layout = {
  // title: 'Average in Mixed Layer',
  margin: {
    l: 50,
    r: 50,
    b: 0,
    t: 20,
    pad: 4
  },
  showlegend: false,
  autosize: true,
  xaxis: {
    domain: [0.1, 0.9],
    autorange: true,
    showgrid: true,
    zeroline: false,
    showline: false,
    autotick: true,
    anchor:'y1'
  },
  // xaxis2: {
  //   domain: [0.3, 0.7],
  //   autorange: true,
  //   showgrid: true,
  //   zeroline: false,
  //   showline: false,
  //   autotick: true,
  //   anchor:'y4'
  // },
  yaxis: {
    domain: [0.525, 1],
    title: 'MLD (dBar)',
    autorange: 'reversed',
    titlefont: {color: '#1f77b4'},
    tickfont: {color: '#1f77b4'},
    tickcolor: '#1f77b4',
    linecolor: '#1f77b4',
    showgrid: true,
    showline: true,
    zeroline: false,
    ticks: 'outside'
  },
  yaxis2: {
    domain: [0.525, 1],
    title: 'Temperature (&deg;C)',
    titlefont: {color: '#ff7f0e'},
    tickfont: {color: '#ff7f0e'},
    tickcolor: '#ff7f0e',
    linecolor: '#ff7f0e',
    showgrid: false,
    showline: true,
    zeroline: false,
    ticks: 'outside',
    anchor: 'x',
    overlaying: 'y',
    side: 'right'
  },
  yaxis3: {
    domain: [0.525, 1],
    title: 'Salinity (ppt)',
    titlefont: {color: '#2ca02c'},
    tickfont: {color: '#2ca02c'},
    tickcolor: '#2ca02c',
    linecolor: '#2ca02c',
    showgrid: false,
    showline: true,
    zeroline: false,
    ticks: 'outside',
    anchor: 'free',
    overlaying: 'y',
    side: 'right',
    position: 1
  },
  yaxis4: {
    domain: [0.0, 0.475],
    title: 'Chlorophyll <i>a</i> (mg m<sup>-3</sup>)',
    // type: 'log',
    titlefont: {color: '#d62728'},
    tickfont: {color: '#d62728'},
    tickcolor: '#d62728',
    linecolor: '#d62728',
    showgrid: true,
    showline: true,
    zeroline: false,
    ticks: 'outside',
    anchor: 'x'
  },
  // yaxis5: {
  //   domain: [0.0, 0.475],
  //   title: 'POC (mg/m^3)',
  //   titlefont: {color: '#9467bd'},
  //   tickfont: {color: '#9467bd'},
  //   tickcolor: '#9467bd',
  //   linecolor: '#9467bd',
  //   showgrid: false,
  //   showline: true,
  //   zeroline: false,
  //   ticks: 'outside',
  //   anchor: 'free',
  //   overlaying: 'y4',
  //   side: 'left',
  //   position: 0
  // },
  yaxis5: {
    domain: [0.0, 0.475],
    title: 'b<sub>bp</sub>(700) (m<sup>-1</sup>)',
    titlefont: {color: '#9467bd'},
    tickfont: {color: '#9467bd'},
    tickcolor: '#9467bd',
    linecolor: '#9467bd',
    showgrid: false,
    showline: true,
    zeroline: false,
    ticks: 'outside',
    // anchor: 'free',
    overlaying: 'y4',
    // side: 'left',
    // position: 0
    side: 'right',
    // posiiton: 1
  },
  // yaxis6: {
  //   domain: [0.0, 0.475],
  //   title: 'FDOM (mg m<sup>-3</sup>)',
  //   titlefont: {color: '#8c564b'},
  //   tickfont: {color: '#8c564b'},
  //   tickcolor: '#8c564b',
  //   linecolor: '#8c564b',
  //   showgrid: false,
  //   showline: true,
  //   zeroline: false,
  //   ticks: 'outside',
  //   anchor: 'x',
  //   overlaying: 'y4',
  //   side: 'right'
  // },
  // yaxis7: {
  //   domain: [0.0, 0.475],
  //   title: 'O<sub>2</sub> (mL/L)', //(mg m<sup>-3</sup>)
  //   titlefont: {color: '#e377c2'},
  //   tickfont: {color: '#e377c2'},
  //   tickcolor: '#e377c2',
  //   linecolor: '#e377c2',
  //   showgrid: false,
  //   showline: true,
  //   zeroline: false,
  //   ticks: 'outside',
  //   anchor: 'free',
  //   overlaying: 'y4',
  //   side: 'right',
  //   position: 1
  // }
};
var pr_layout = {
  // title: 'Most recent profile (nº' + msg_id + ')',
  title: 'Profile',
  margin: {
    l: 50,
    r: 50,
    b: 50,
    t: 75,
    pad: 4
  },
  showlegend: false,
  autosize: true,
  hovermode:'y',
  yaxis: {
    domain: [0, 0.85],
    title: 'Pressure (dBar)',
    autorange: 'reversed',
    showgrid: true,
    zeroline: true,
    showline: false,
    autotick: true,
    anchor:'x1',
    orientation: 'reverse'
  },
  // xaxis2: {
  //   domain: [0.3, 0.7],
  //   autorange: true,
  //   showgrid: true,
  //   zeroline: false,
  //   showline: false,
  //   autotick: true,
  //   anchor:'y4'
  // },
  xaxis: {
    domain: [0, 0.225],
    title: 'PAR (&mu;mol photons m<sup>-2</sup> s<sup>-1</sup>)',
    titlefont: {color: '#1f77b4'},
    tickfont: {color: '#1f77b4'},
    tickcolor: '#1f77b4',
    linecolor: '#1f77b4',
    showgrid: true,
    showline: true,
    zeroline: false,
    ticks: 'outside',
    side: 'top'
  },
  xaxis2: {
    domain: [0.275, 0.475],
    title: 'Temperature (ºC)',
    titlefont: {color: '#ff7f0e'},
    tickfont: {color: '#ff7f0e'},
    tickcolor: '#ff7f0e',
    linecolor: '#ff7f0e',
    showgrid: true,
    showline: true,
    zeroline: false,
    ticks: 'outside',
    anchor: 'y',
    side: 'top'
  },
  xaxis3: {
    domain: [0.275, 0.475],
    title: 'Salinity (ppt)',
    titlefont: {color: '#2ca02c'},
    tickfont: {color: '#2ca02c'},
    tickcolor: '#2ca02c',
    linecolor: '#2ca02c',
    showgrid: false,
    showline: true,
    zeroline: false,
    ticks: 'outside',
    anchor: 'y',
    overlaying: 'x2'
  },
  xaxis4: {
    domain: [0.525, 0.725],
    title: 'Chlorophyll <i>a</i> (mg m<sup>-3</sup>)',
    titlefont: {color: '#d62728'},
    tickfont: {color: '#d62728'},
    tickcolor: '#d62728',
    linecolor: '#d62728',
    showgrid: true,
    showline: true,
    zeroline: false,
    ticks: 'outside',
    anchor: 'y',
    side: 'top'
  },
  // xaxis5: {
  //   domain: [0.525, 0.725],
  //   title: 'POC (mg/m^3)',
  //   titlefont: {color: '#9467bd'},
  //   tickfont: {color: '#9467bd'},
  //   tickcolor: '#9467bd',
  //   linecolor: '#9467bd',
  //   showgrid: true,
  //   showline: true,
  //   zeroline: false,
  //   ticks: 'outside',
  //   anchor: 'y',
  //   overlaying: 'x4'
  // },
  xaxis5: {
    domain: [0.525, 0.725],
    title: 'b<sub>bp</sub>(700) (m<sup>-1</sup>)',
    titlefont: {color: '#9467bd'},
    tickfont: {color: '#9467bd'},
    tickcolor: '#9467bd',
    linecolor: '#9467bd',
    showgrid: false,
    showline: true,
    zeroline: false,
    ticks: 'outside',
    anchor: 'y',
    overlaying: 'x4'
  },
  xaxis6: {
    domain: [0.775, 1],
    title: 'FDOM (mg m<sup>-3</sup>)',
    titlefont: {color: '#8c564b'},
    tickfont: {color: '#8c564b'},
    tickcolor: '#8c564b',
    linecolor: '#8c564b',
    showgrid: true,
    showline: true,
    zeroline: false,
    ticks: 'outside',
    anchor: 'y',
    side: 'top'
  },
  xaxis7: {
    domain: [0, 0.225],
    title: 'O<sub>2</sub> (mL/L)', //(mg m<sup>-3</sup>)
    titlefont: {color: '#e377c2'},
    tickfont: {color: '#e377c2'},
    tickcolor: '#e377c2',
    linecolor: '#e377c2',
    showgrid: false,
    showline: true,
    zeroline: false,
    ticks: 'outside',
    anchor: 'y',
    overlaying: 'x',
    side:'bottom'
  }
};
var ct_layout = {
  // title: '2D Timeseries',
  margin: {
    l: 50,
    r: 50,
    b: 50,
    t: 20,
    pad: 4
  },
  xaxis: {domain: [0, 0.45]},
  yaxis: {
    title: 'Pressure (dBar)',
    autorange: 'reversed'
  },
  xaxis2: {
    domain: [0.55, 1],
    anchor:'y'
  },
  showlegend:false
};

///////////
// Plots //
///////////
function setTimeSeriesPlot(callback=null){
  $.getJSON( path2data + usr_id + ".timeseries.json", function( _data ) {
    var trace_id = {
        name: usr_id,
        x: _data['profile_id'],
        visible: false
      };
    var trace1 = {
        x: ('mld' in _data ? _data['dt'] : []),
        y: ('mld' in _data ? _data['mld'] : []),
        type: 'scatter',
        name: 'MLD',
      };
    var trace2 = {
        x: ('t' in _data ? _data['dt'] : []),
        y: ('t' in _data ? _data['t'] : []),
        type: 'scatter',
        yaxis: 'y2',
        name: 'Temperature'
      };
    var trace3 = {
        x: ('s' in _data ? _data['dt'] : []),
        y: ('s' in _data ? _data['s'] : []),
        type: 'scatter',
        yaxis: 'y3',
        name: 'Salinity'
      };
    var trace4 = {
        x: ('chla_adj' in _data ? _data['dt'] : []),
        y: ('chla_adj' in _data ? _data['chla_adj'] : []),
        type: 'scatter',
        xaxis: 'x',
        yaxis: 'y4',
        name: 'Chlorophyll a'
      };
    // var trace5 = {
    //     x: ('poc' in _data ? _data['dt'] : []),
    //     y: ('poc' in _data ? _data['poc'] : []),
    //     type: 'scatter',
    //     xaxis: 'x',
    //     yaxis: 'y5',
    //     name: 'POC'
    //   };
    var trace5 = {
        x: ('bbp' in _data ? _data['dt'] : []),
        y: ('bbp' in _data ? _data['bbp'] : []),
        type: 'scatter',
        xaxis: 'x',
        yaxis: 'y5',
        name: 'bbp'
      };
    // var trace6 = {
    //     x: ('fdom' in _data ? _data['dt'] : []),
    //     y: ('fdom' in _data ? _data['fdom'] : []),
    //     type: 'scatter',
    //     xaxis: 'x',
    //     yaxis: 'y6',
    //     name: 'FDOM'
    //   };
    // var trace7 = {
    //     x: ('o2_c' in _data ? _data['dt'] : []),
    //     y: ('o2_c' in _data ? _data['o2_c'] : []),
    //     type: 'scatter',
    //     xaxis: 'x',
    //     yaxis: 'y7',
    //     name: 'O2'
    //   };
    // var data = [trace1, trace2, trace3, trace4, trace5, trace6, trace7, trace_id];
    var data = [trace1, trace2, trace3, trace4, trace5, {}, {}, trace_id];
    // Create new plot
    Plotly.newPlot('timeseries', data, ts_layout, options);
    // Set globals for Profile Plot
    var i = _data['profile_id'].length-1;  // Last Index
    last_msg_id = _data['profile_id'][i];  // Maximum number of profiles
    msg_id = last_msg_id;                  // By default first profile displayed is the last one
    msg_dts = ('dt' in _data ? _data['dt'].map(function(x){return x.replace('T', ' ');}) : null);
    msg_ids = ('profile_id' in _data ? _data['profile_id'] : null);
    // Set Last Profiles plot if requested
    if (callback != null){
      callback();
    };
    // Link Time Series with Profiles
    linkTimeSeriesWithProfiles();
  }).fail(function() {
    console.log("ERROR: Loading time series from " + usr_id);
  });
}

function updateTimeSeriesPlot(){
  var fig = document.getElementById('timeseries')
  // 2. Update Profiles Data
  $.getJSON( path2data + usr_id + ".timeseries.json", function(_data) {
    fig.data[0].x = ('mld' in _data ? _data['dt'] : []);
    fig.data[0].y = ('mld' in _data ? _data['mld'] : []);
    fig.data[1].x = ('t' in _data ? _data['dt'] : []);
    fig.data[1].y = ('t' in _data ? _data['t'] : []);
    fig.data[2].x = ('s' in _data ? _data['dt'] : []);
    fig.data[2].y = ('s' in _data ? _data['s'] : []);
    fig.data[3].x = ('chla_adj' in _data ? _data['dt'] : []);
    fig.data[3].y = ('chla_adj' in _data ? _data['chla_adj'] : []);
    // fig.data[4].x = ('poc' in _data ? _data['poc'] : []);
    // fig.data[4].y = ('poc' in _data ? _data['p'] : []);
    fig.data[4].x = ('bbp' in _data ? _data['dt'] : []);
    fig.data[4].y = ('bbp' in _data ? _data['bbp'] : []);
    // fig.data[5].x = ('fdom' in _data ? _data['dt'] : []);
    // fig.data[5].y = ('fdom' in _data ? _data['fdom'] : []);
    // fig.data[6].x = ('o2_c' in _data ? _data['dt'] : []);
    // fig.data[6].y = ('o2_c' in _data ? _data['o2_c'] : []);
    fig.data[7].name = usr_id;
    fig.data[7].x = _data['profile_id'];
    // 3. Redraw Timeseries
    Plotly.redraw(fig);
    // 4. Update Profiles Plot
    if ('layout' in document.getElementById('profiles')) {
      var i = _data['profile_id'].length-1;  // Last Index
      msg_id = pad(_data['profile_id'][i],3)
      updateProfilesPlot(_data['dt'][i].replace('T', ' '));
    };
  }).fail(function() {
    console.log("ERROR: Loading time series from " + usr_id);
  });
}

function setProfilesPlot(){
  var msg_id_str = pad(msg_id, 3)
  $.getJSON( path2data + usr_id + "." + msg_id_str + ".profile.json", function( _data ) {
    // Set traces
    var trace2 = {
        x: _data['t'],
        y: _data['p'],
        type: 'scatter',
        xaxis: 'x2',
        name: 'Temperature',
        hoverinfo: "x+y"
      };
    var trace3 = {
        x: _data['s'],
        y: _data['p'],
        type: 'scatter',
        xaxis: 'x3',
        name: 'Salinity',
        hoverinfo: "x+y"
      };
    var trace4 = {
        x: ('chla_adj' in _data ? _data['chla_adj'] : []),
        y: ('chla_adj' in _data ? _data['p'] : []),
        type: 'scatter',
        xaxis: 'x4',
        name: 'Chlorophyll a',
        hoverinfo: "x+y"
      };
    // var trace5 = {
    //     x: ('poc' in _data ? _data['poc'] : []),
    //     y: ('poc' in _data ? _data['p'] : []),
    //     type: 'scatter',
    //     xaxis: 'x5',
    //     name: 'POC',
    //     hoverinfo: "x+y"
    //   };
    var trace5 = {
        x: ('bbp' in _data ? _data['bbp'] : []),
        y: ('bbp' in _data ? _data['p'] : []),
        type: 'scatter',
        xaxis: 'x5',
        name: 'bbp',
        hoverinfo: "x+y"
      };
    var trace6 = {
        x: ('fdom' in _data ? _data['fdom'] : []),
        y: ('fdom' in _data ? _data['p'] : []),
        type: 'scatter',
        xaxis: 'x6',
        name: 'FDOM',
        hoverinfo: "x+y"
      };
    var trace7 = {
        x: ('o2_c' in _data ? _data['o2_c'] : []),
        y: ('o2_c' in _data ? _data['p'] : []),
        type: 'scatter',
        xaxis: 'x7',
        name: 'O2',
        hoverinfo: "x+y"
      };
    var trace8 = {
        x: ('par' in _data ? _data['par'] : []),
        y: ('par' in _data ? _data['p'] : []),
        type: 'scatter',
        xaxis: 'x',
        name: 'PAR',
        hoverinfo: "x+y"
      };
    var data = [trace8, trace2, trace3, trace4, trace5, trace6, trace7];
    // Update layout title
    if (msg_dts == null || msg_ids == null) {
      pr_layout.title = 'Profile N&deg;' + msg_id_str;
    } else {
      var dt = msg_dts[msg_ids.indexOf(msg_id)];
      pr_layout.title = 'N&deg;' + msg_id_str + ' at ' + dt;
    }
    // Create New Plot
    Plotly.newPlot('profiles', data, pr_layout, options);
  }).fail(function() {
    console.log("ERROR: Loading " + usr_id + "." + msg_id_str + ".json");
  });
}

function updateProfilesPlot(){
  var fig = document.getElementById('profiles')
  // 1. Update Profiles title
  var msg_id_str = pad(msg_id, 3)
  if (msg_dts == null || msg_ids == null) {
    fig.layout.title = 'Profile N&deg;' + msg_id_str;
  } else {
    var dt = msg_dts[msg_ids.indexOf(msg_id)];
    fig.layout.title = 'N&deg;' + msg_id_str + ' at ' + dt;
  }
  // 2. Update Profiles Data
  $.getJSON( path2data + usr_id + "." + msg_id_str + ".profile.json", function( _data ) {
    fig.data[0].x = ('par' in _data ? _data['par'] : []);
    fig.data[0].y = ('par' in _data ? _data['p'] : []);
    fig.data[1].x = ('t' in _data ? _data['t'] : []);
    fig.data[1].y = ('t' in _data ? _data['p'] : []);
    fig.data[2].x = ('s' in _data ? _data['s'] : []);
    fig.data[2].y = ('s' in _data ? _data['p'] : []);
    fig.data[3].x = ('chla_adj' in _data ? _data['chla_adj'] : []);
    fig.data[3].y = ('chla_adj' in _data ? _data['p'] : []);
    // fig.data[4].x = ('poc' in _data ? _data['poc'] : []);
    // fig.data[4].y = ('poc' in _data ? _data['p'] : []);
    fig.data[4].x = ('bbp' in _data ? _data['bbp'] : []);
    fig.data[4].y = ('bbp' in _data ? _data['p'] : []);
    fig.data[5].x = ('fdom' in _data ? _data['fdom'] : []);
    fig.data[5].y = ('fdom' in _data ? _data['p'] : []);
    fig.data[6].x = ('o2_c' in _data ? _data['o2_c'] : []);
    fig.data[6].y = ('o2_c' in _data ? _data['p'] : []);
    // 3. Redraw Profiles
    Plotly.redraw(fig);
  }).fail(function() {
    console.log("ERROR: Loading " + usr_id + "." + msg_id_str + ".json");
  });
}

function setContourPlot(var_ids){
  $.getJSON( path2data + usr_id + "." + var_ids[0] + ".contour.json", function( _data ) {
    // Set first trace
    var trace1_bg = {
      name: _data['name'],
      x: _data['dt'],
      y: _data['p'],
      z: _data['data'],
      // zauto:false,
        // zmin:0,
        // zmax:0.002,
      type: 'contour',
      // Set colorscale (default: Jet)
      colorscale: ('colorscale' in _data ? _data['colorscale'] : 'Jet'),
      reversescale: _data['reversescale'],
      // Set maximum number of contour lines
      ncontours:5,
      // Color bar label
      colorbar:{
        title: _data['label'],
        titleside:'right',
        x:0.45,
      },
      // Smooth contour coloring
      contours: {coloring: 'heatmap'},
      // Information to display when mouse ohover
      hoverinfo: 'z+name'
    };

    var trace1_MLD = {
      name: 'MLD',
      x: _data['dt'],
      y: _data['mld'],
      mode: 'lines',
      // line:{color:'rgba(67,67,67,1)'},
      line:{color:'rgba(255,255,255,1)'},
      hoverinfo: 'y+name',
      color:'black'
    }

    $.getJSON( path2data + usr_id + "." + var_ids[1] + ".contour.json", function( _data ) {
      // Set second trace (if first trace loaded properly)
      var trace2_bg = {
        name: _data['name'],
        x: _data['dt'],
        y: _data['p'],
        z: _data['data'],
        // zauto:false,
        // zmin:0,
        // zmax:4,
        type: 'contour',
        // Set colorscale (default: Jet)
        colorscale: ('colorscale' in _data ? _data['colorscale'] : 'Jet'),
        reversescale: _data['reversescale'],
        // Set maximum number of contour lines
        ncontours:5,
        // Color bar label
        colorbar:{
          title: _data['label'],
          titleside:'right',
          x:1
        },
        // Information to display when mouse ohover
        hoverinfo: 'z+name',
        // Smooth contour coloring
        contours: {coloring: 'heatmap'},
        // Link Pressure (y) axis, use new Time axis (x) 
        xaxis: 'x2'
      };

      var trace2_MLD = {
        name: 'MLD',
        x: _data['dt'],
        y: _data['mld'],
        mode: 'lines',
        line:{color:'rgba(67,67,67,1)'},
        hoverinfo: 'y+name',
        color:'black',
        xaxis: 'x2'
      }

      var data = [trace1_bg, trace2_bg, trace1_MLD, trace2_MLD];

      // Create New Plot
      Plotly.newPlot('contours', data, ct_layout, options);
      // Link Contour Plot with Profiles
      linkContourPlotWithProfiles();
    }).fail(function() {
      console.log("ERROR: Loading " + usr_id + "." + var_ids[1] + ".contour.json");
    });
  }).fail(function() {
    console.log("ERROR: Loading " + usr_id + "." + var_ids[0] + ".contour.json");
  });
}

function removeProfileExplorer() {
  var fig_timeseries = document.getElementById('timeseries');
  var fig_profiles = document.getElementById('profiles');
  Plotly.purge(fig_profiles);
  Plotly.purge(fig_timeseries);
}

////////////////////////////////////
// Link time series with profiles //
////////////////////////////////////
function linkTimeSeriesWithProfiles(){
  var fig_timeseries = document.getElementById('timeseries')
  fig_timeseries.on('plotly_click', function(data){
    // Draw selected profiles
    // 0. Update msg_id
    i = fig_timeseries.data[0].x.indexOf(data.points[0].x.replace(' ', 'T'))
    msg_id = fig_timeseries.data[7].x[i]
    // 1. Update Profiles Title
    var fig_profiles = document.getElementById('profiles')
    if ('layout' in fig_profiles) {
      // 2. Update Profiles Plot
      updateProfilesPlot();
    } else {
      // 2. Create Profiles Plot
      setProfilesPlot();
    };
  });
}

function linkContourPlotWithProfiles(){
  var fig_contours = document.getElementById('contours')
  fig_contours.on('plotly_click', function(data){
    // Use figure Timeseries as reference for conversion from date to msg_id
    var fig_timeseries = document.getElementById('timeseries')
    // Draw selected profiles
    // 0. Update msg_id
    i = fig_timeseries.data[0].x.indexOf(data.points[0].x.replace(' ', 'T'))
    msg_id = fig_timeseries.data[7].x[i]
    // 1. Update Profiles Title
    var fig_profiles = document.getElementById('profiles')
    if ('layout' in fig_profiles) {
      // 2. Update Profiles Plot
      updateProfilesPlot();
    } else {
      // 2. Create Profiles Plot
      setProfilesPlot();
    };
  });
}

////////////////////////
// Keyboard shortcuts //
////////////////////////
$(document).keydown(function(e){
  switch(e.which) {
    case 40: // down
    case 37: // left (previous profile)
    msg_id = (msg_id > 1 ? msg_id - 1 : msg_id);
    break;

    case 38: // up
    case 39: // right (next profile)
    msg_id = (msg_id < last_msg_id ? msg_id + 1 : msg_id);
    break;

    default: return; // exit this handler for other keys
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
  // Update Profile with new msg_id
  updateProfilesPlot();
});

/////////////////////////
// Engineering Figures //
/////////////////////////
function setEngineeringTimeSeriesPlot(){
  // Disable Async mode for getJSON
  $.ajaxSetup({
    async: false
  });
  // Load layout
  var layout = null;
  $.getJSON( url_static + 'layout_engineeringtimeseries.json', function( _layout ) {
    layout = _layout;
  }).fail(function() {
    console.error("ERROR: Unable to load layout.");
    return;
  });
  // Load data for each variables
  var varid = ['AirPumpVolts', 'BuoyancyPumpVolts', 'QuiescentVolts','Sbe41cpVolts',
               'AirPumpAmps', 'BuoyancyPumpAmps', 'QuiescentAmps', 'Sbe41cpAmps'];
  var varname = ['Air Pump', 'Buoyancy Pump', 'Quiescent', 'Sbe41cp',
                 'Air Pump', 'Buoyancy Pump', 'Quiescent', 'Sbe41cp'];
  var varyaxis = ['y', 'y2', 'y3', 'y4', 'y5', 'y6', 'y7', 'y8'];
  var varcolor = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']
  var data = [];
  for (var i = 0; i < varid.length; i++) {
    // (function(i) {
      $.getJSON( url_api + varid[i], function( _data ) {
        data[i] = _data;
        data[i]['name'] = varname[i];
        data[i]['yaxis'] = varyaxis[i];
        data[i]['marker'] = {'color': varcolor[i]}
      }).fail(function() {
        console.error("ERROR: Unable to load data.");
        return;
      });
    // })(i);
  }
  // Re-Enable Async mode for getJSON
  $.ajaxSetup({
    async: true
  });
  // console.log('Display data', data)
  // Plot data
  Plotly.newPlot('engineering_timeseries', data, layout, options);
}

/////////////
// Helpers //
/////////////
// Function for padding zeros
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}