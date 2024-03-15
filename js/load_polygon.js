function labelPoly(json, lyr) {
    var att = json.properties;
    var label = att.nop;
    lyr.bindTooltip(label, {
        permanent: true,
        direction: "center",
        className: "labelBidang",
        style: {
          color: "white"
        }
    });

    lyr.on("dblclick", function () {
        var att = json.properties;
        var idPoly = att.id;

        if (idPoly) {
            getNilaiBidang(lyr, 'id', idPoly, function (lyr) {});
        }

        if (lyr) {
            if (lyrSelect) {
                lyrSelect.remove();
            }
            lyrSelect = L.geoJSON(lyr.toGeoJSON(), {
                style: { color: 'red', weight: 1.5, opacity: 1, fillOpacity: 0 }
            }).addTo(map);
            map.fitBounds(lyr.getBounds().pad(1));
            var att = lyr.feature.properties;
            $("#koordinat").val(JSON.stringify(lyr.feature.geometry));
        } else {
            alert("Eror");
        }
    });
}

function styleKondisi(json){
    var att = json.properties;
    switch (att.znt_baru){
        case 'KA':
            return {color:'black', fillColor:'yellow', weight:0.5, fillOpacity:0.7};
            break;
        case 'KC':
            return {color:'black', fillColor:'blue', weight:0.5, fillOpacity:0.7};
            break;
        case 'KH':
            return {color:'black', fillColor:'red', weight:0.5, fillOpacity:0.7};
            break;
        case 'KD':
            return {color:'black', fillColor:'green', weight:0.5, fillOpacity:0.7};
            break;
        case 'KK':
            return {color:'black', fillColor:'brown', weight:0.5, fillOpacity:0.7};
            break;
        case 'KJ':
            return {color:'black', fillColor:'gray', weight:0.5, fillOpacity:0.7};
            break;
        case 'KM':
            return {color:'black', fillColor:'purple', weight:0.5, fillOpacity:0.7};
            break;
    }
}

function styleKondisiPembayaran(json){
    var att = json.properties;
    switch (att.status){
        case 'lunas':
            return {color:'black', fillColor:'green', weight:0.5, fillOpacity:0.7};
            break;
        case 'hutang':
            return {color:'black', fillColor:'red', weight:0.5, fillOpacity:0.7};
            break;
        case 'blokir':
            return {color:'black', fillColor:'black', weight:0.5, fillOpacity:0.7};
            break;
    }
}

function styleDefault() {
    return {
        fillColor: 'white',
        fillOpacity: 0.4,
        color: 'black',
        weight: 0.5
    };
}

var currentStyleFunction = styleDefault; // Initial style function

function applyCurrentStyle() {
  if (layerPoly) {
    layerPoly.setStyle(currentStyleFunction);
  }
}

$(document).ready(function () {
  $("#pembayaran").click(function () {
      currentStyleFunction = styleKondisiPembayaran;
      applyCurrentStyle();
  });

  $("#ZNT").click(function () {
      currentStyleFunction = styleKondisi;
      applyCurrentStyle();
  });

});

function refreshPolygon() {
    $.getJSON('data/data_polygon.geojson', function (data) {
        layerPoly = L.geoJSON(data, {
            style: currentStyleFunction,
            onEachFeature: labelPoly,
        });
        layerPoly.addTo(map);
        map.fitBounds(layerPoly.getBounds());
        diagramZNT(layerPoly, "znt_baru");
        diagramPembayaran(layerPoly, "status");
    });
}

function getNilaiBidang(data, fld, val, callback) {
    if (Array.isArray(data.features)) {
        var filteredFeatures = data.features.filter(function(feature) {
            return feature.properties[fld] === val;
        });

        if (filteredFeatures.length > 0) {
            var firstFeature = filteredFeatures[0];
            var layer = L.geoJSON(firstFeature);
            callback(layer);
        } else {
            callback(false);
        }
    } else {
        callback(false);
    }
}