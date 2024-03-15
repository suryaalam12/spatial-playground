function polygonCut(polygon, line, idPrefix) {
  const THICK_LINE_UNITS = "kilometers";
  const THICK_LINE_WIDTH = 0.001;
  var i, j, id, intersectPoints, lineCoords, forCut, forSelect;
  var thickLineString, thickLinePolygon, clipped, polyg, intersect;
  var polyCoords = [];
  var cutPolyGeoms = [];
  var cutFeatures = [];
  var offsetLine = [];
  var retVal = null;

  if (
    (polygon.type != "Polygon" && polygon.type != "MultiPolygon") ||
    line.type != "LineString"
  ) {
    return retVal;
  }

  if (typeof idPrefix === "undefined") {
    idPrefix = "";
  }

  intersectPoints = turf.lineIntersect(polygon, line);
  if (intersectPoints.features.length == 0) {
    return retVal;
  }

  var lineCoords = turf.getCoords(line);
  if (
    turf.booleanWithin(turf.point(lineCoords[0]), polygon) ||
    turf.booleanWithin(turf.point(lineCoords[lineCoords.length - 1]), polygon)
  ) {
    return retVal;
  }

  offsetLine[0] = turf.lineOffset(line, THICK_LINE_WIDTH, {
    units: THICK_LINE_UNITS,
  });
  offsetLine[1] = turf.lineOffset(line, -THICK_LINE_WIDTH, {
    units: THICK_LINE_UNITS,
  });

  for (i = 0; i <= 1; i++) {
    forCut = i;
    forSelect = (i + 1) % 2;
    polyCoords = [];
    for (j = 0; j < line.coordinates.length; j++) {
      polyCoords.push(line.coordinates[j]);
    }
    for (j = offsetLine[forCut].geometry.coordinates.length - 1; j >= 0; j--) {
      polyCoords.push(offsetLine[forCut].geometry.coordinates[j]);
    }
    polyCoords.push(line.coordinates[0]);

    thickLineString = turf.lineString(polyCoords);
    thickLinePolygon = turf.lineToPolygon(thickLineString);
    clipped = turf.difference(polygon, thickLinePolygon);

    cutPolyGeoms = [];
    for (j = 0; j < clipped.geometry.coordinates.length; j++) {
      polyg = turf.polygon(clipped.geometry.coordinates[j]);
      intersect = turf.lineIntersect(polyg, offsetLine[forSelect]);
      if (intersect.features.length > 0) {
        cutPolyGeoms.push(polyg.geometry.coordinates);
      }
    }

    cutPolyGeoms.forEach(function (geometry, index) {
      id = idPrefix + (i + 1) + "." + (index + 1);
      cutFeatures.push(turf.polygon(geometry, { id: id }));
    });
  }

  if (cutFeatures.length > 0) retVal = turf.featureCollection(cutFeatures);

  return retVal;
}

const cutIdPrefix = "cut_";

function cutPolygonStyle(feature) {
  var id, color;

  id = feature.properties.id;
  if (typeof id !== "undefined") {
    id = id.substring(0, cutIdPrefix.length + 1);
  }

  if (id == cutIdPrefix + "1") color = "green";
  else if (id == cutIdPrefix + "2") color = "red";
  else {
    color = "blue";
  }
  return { color: color, opacity: 0.8, fillOpacity: 0.8, weight: 1 };
}

var handleDraw = (function () {
  var alertShown = false;
  return function (
    event,
    drawnPolygons,
    drawnLines,
    polygons,
    polygonCut,
    cutIdPrefix,
    cutPolygonStyle
  ) {
    var drawnLayer = event.layer;
    var drawnGeoJSON = drawnLayer.toGeoJSON();
    var drawnGeometry = turf.getGeom(drawnGeoJSON);

    if (drawnGeometry.type == "Polygon") {
      var unkinked = turf.unkinkPolygon(drawnGeometry);
      turf.geomEach(unkinked, function (geometry) {
        polygons.push(geometry);
      });
      drawnPolygons.clearLayers();
      drawnLines.clearLayers();
      drawnPolygons.addLayer(drawnLayer);
    }

    if (drawnGeometry.type == "LineString") {
      drawnLines.addLayer(drawnLayer);
      drawnPolygons.clearLayers();
      polygons.forEach(function (polygon, index) {
        var cutPolygon = polygonCut(polygon, drawnGeometry, cutIdPrefix);
        if (cutPolygon != null) {
          L.geoJSON(cutPolygon, {
            style: cutPolygonStyle,
          }).addTo(drawnPolygons);
          turf.geomEach(cutPolygon, function (geometry) {
            newPolygons.push(geometry);
          });
        } else {
          L.geoJSON(polygon).addTo(drawnPolygons);
          newPolygons.push(polygon);
        }
      });
      polygons = newPolygons;
      console.log(newPolygons);
    }

    if (!alertShown) {
      Swal.fire({
        html: '<div style="color: white; background-color: #333; border: 2px solid #333; border-radius: 5px; padding: 10px;">Klik Refresh Untuk Melihat Hasil <button id="refresh" class="btn btn-warning"><i class="fa-solid fa-arrows-rotate" id="refresh"></i></button></div>',
        showConfirmButton: false,
        background: "transparent",
        backdrop: "rgba(0,0,0,0.5)",
      });
      alertShown = true;
    }

    return polygons;
  };
})();
