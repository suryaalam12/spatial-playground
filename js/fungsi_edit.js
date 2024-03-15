function handlePolyEdit() {
  var alertShown = false;
  var jsnMulti = JSON.parse($("#koordinat").val());
  var jsnSingle = explodeMulti(jsnMulti);
  lyrEdit = L.geoJSON(jsnSingle).addTo(map);
  lyrEdit.pm.enable();
  console.log(lyrEdit);
  map.on("contextmenu", function () {
    if (confirm("Rubah ?")) {
      var jsnEdited = mergeLyrEdit(lyrEdit);
      $("#koordinat").val(JSON.stringify(jsnEdited));
      lyrEdit.pm.disable();
      map.off("contextmenu");

      if (!alertShown) {
        Swal.fire({
          html: '<div style="color: white; background-color: #333; border: 2px solid #333; border-radius: 5px; padding: 10px;">Klik Refresh Untuk Melihat Hasil <button id="refresh" class="btn btn-warning"><i class="fa-solid fa-arrows-rotate" id="refresh"></i></button></div>',
          showConfirmButton: false,
          background: "transparent",
          backdrop: "rgba(0,0,0,0.5)",
        });
        alertShown = true;
      }
    } else {
      alert("error");
    }
  });
}

function mergeLyrEdit(lyrEdit) {
  var jsnEdited = lyrEdit.toGeoJSON();
  var arCoordinates = [];
  var type = "Multi" + jsnEdited.features[0].geometry.type;
  for (var i = 0; i < jsnEdited.features.length; i++) {
    var coordinates = jsnEdited.features[i].geometry.coordinates;
    arCoordinates.push(coordinates);
  }
  return { type: type, coordinates: arCoordinates };
}

function explodeMulti(jsnMulti) {
  if (jsnMulti.type.substring(0, 5) != "Multi") {
    alert("Bentuk bukan multigeometri");
  } else {
    var features = [];
    var type = jsnMulti.type.substring(5);
    for (var i = 0; i < jsnMulti.coordinates.length; i++) {
      var feature = { type: type, coordinates: jsnMulti.coordinates[i] };
      features.push(feature);
    }
    return features;
  }
}
