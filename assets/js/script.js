import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.144.0//examples/jsm/controls/OrbitControls.js";

$(document).ready(function () {
  $("#calculation-form").on("submit", function (e) {
    e.preventDefault();

    const BOX_LIST = [];
    const ITEM_LIST = [];

    $(".box-size-item").each(function () {
      let box = {
        name: $(this).find(".box-name").val(),
        width: $(this).find(".box-width").val(),
        length: $(this).find(".box-length").val(),
        height: $(this).find(".box-height").val(),
        weight: $(this).find(".box-weight").val(),
      };
      BOX_LIST.push(box);
    });

    $(".item-details").each(function () {
      let item = {
        name: $(this).find(".item-name").val(),
        qty: $(this).find(".item-qty").val(),
        width: $(this).find(".item-width").val(),
        length: $(this).find(".item-length").val(),
        height: $(this).find(".item-height").val(),
        weight: $(this).find(".item-weight").val(),
      };
      ITEM_LIST.push(item);
    });

    $.ajax({
      url: "calculator.php",
      method: "POST",
      data: {
        BOX_LIST,
        ITEM_LIST,
      },
      success: function (result) {
        console.log(result);

        var data = JSON.parse(result);
        $(".output-span").html(data.output);
        $([document.documentElement, document.body]).animate(
          {
            scrollTop: $(".output-span").offset().top,
          },
          500
        );
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);

        // var box = data[0].box;
        // const geometry = new THREE.BoxGeometry(
        //   box.innerWidth,
        //   box.innerLength,
        //   box.innerDepth
        // );
        // const material = new THREE.MeshBasicMaterial({
        //   color: getRandomColor(),
        // });
        // const cube = new THREE.Mesh(geometry, material);
        // cube.position.x = 0;
        // cube.position.y = 0;
        // cube.position.z = 0;
        // scene.add(cube);

        data.result[0].items.map((item) => {
          console.log(item);
          const geometry = new THREE.BoxGeometry(
            item.width,
            item.length,
            item.depth
          );
          const material = new THREE.MeshBasicMaterial({
            color: getRandomColor(),
          });
          const cube = new THREE.Mesh(geometry, material);
          cube.position.x = item.x;
          cube.position.y = item.y;
          cube.position.z = item.z;
          scene.add(cube);
        });

        camera.position.set(5, 10, 80);

        controls.update();

        function animate() {
          requestAnimationFrame(animate);

          // required if controls.enableDamping or controls.autoRotate are set to true
          controls.update();

          renderer.render(scene, camera);
        }

        animate();
      },
    });
  });

  addBoxes("Medium Box", 60, 40, 40, 18000);
  addBoxes("Small Box", 60, 40, 25, 18000);
  //addItems("Car", 1, 100, 100, 100, 1000000);
});

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function addBoxes(
  boxName = "",
  boxWidth = "",
  boxLength = "",
  boxHeight = "",
  boxWeight = ""
) {
  $(".box-size-container").append(`
    <div class="row box-size-item">
        <div class="col-md-12 col-sm-12">
            <button class="btn btn-danger float-right" onclick="removebox($(this))">x</button>
        </div>
        <div class="col-md-12 col-sm-12">
            <div class="form-group">
                <label>Box Name:</label>
                <input type="text" class="form-control box-name" value="${boxName}" required />
            </div>
        </div>
            <div class="col-md-3 col-sm-12">
                <div class="form-group">
                  <label>Width:</label>
                  <input type="number" class="form-control box-width" value="${boxWidth}" required />
                </div>
            </div>
        <div class="col-md-3 col-sm-12">
            <div class="form-group">
                <label>Length:</label>
                <input type="number" class="form-control box-length" value="${boxLength}" required />
            </div>
        </div>
        <div class="col-md-3 col-sm-12">
            <div class="form-group">
                <label>Height:</label>
                <input type="number" class="form-control box-height" value="${boxHeight}" required />
            </div>
        </div>
        <div class="col-md-3 col-sm-12">
            <div class="form-group">
                <label>Max-Weight:</label>
                <input type="number" class="form-control box-weight" value="${boxWeight}" required />
            </div>
            </div>
        </div>
    `);
}

function removebox(elem) {
  elem.parent().parent().remove();
}

function addItems(
  itemName = "",
  itemQty = "",
  itemWidth = "",
  itemLength = "",
  itemHeight = "",
  itemWeight = ""
) {
  $(".item-details-container").append(`
    <div class="row item-details">
        <div class="col-md-12 col-sm-12">
            <button class="btn btn-danger float-right" onclick="removeItem($(this))">x</button>
        </div>
        <div class="col-md-8 col-sm-12">
            <div class="form-group">
                <label>Item Name:</label>
                <input type="text" class="form-control item-name" value="${itemName}" required />
            </div>
        </div>
         <div class="col-md-4 col-sm-12">
            <div class="form-group">
                <label>Quantity:</label>
                <input type="number" class="form-control item-qty" value="${itemQty}" required />
            </div>
        </div>
        <div class="col-md-3 col-sm-12">
            <div class="form-group">
                <label>Width:</label>
                <input type="number" class="form-control item-width" value="${itemWidth}" required />
            </div>
        </div>
        <div class="col-md-3 col-sm-12">
            <div class="form-group">
                <label>Length:</label>
                <input type="number" class="form-control item-length" value="${itemLength}" required />
            </div>
        </div>
        <div class="col-md-3 col-sm-12">
            <div class="form-group">
                <label>Height:</label>
                <input type="number" class="form-control item-height" value="${itemHeight}" required />
            </div>
        </div>
        <div class="col-md-3 col-sm-12">
            <div class="form-group">
                <label>Weight:</label>
                <input type="number" class="form-control item-weight" value="${itemWeight}" required />
            </div>
            </div>
        </div>
    `);
}

function removeItem(elem) {
  elem.parent().parent().remove();
}
