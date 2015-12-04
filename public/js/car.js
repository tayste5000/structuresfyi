window.addEventListener('load', setup);
var viewer;
var presentation;
var dialogue;

function setup() {

var options = {
  width: "auto",
  height: 500,
  background: "#fdfdfd",
  antialias: true,
  quality: 'medium',
  outlineWidth: 1.0
};

viewer = pv.Viewer(document.getElementById('viewer'), options);
dialogue = document.querySelector("#dialogue");

viewer.on("viewerReady", function(){

  presentation = makePresentation(dialogue);

  presentation.init().then(function(){
    document.querySelector("#spinner").remove();

    dialogue.innerHTML += "<button type=\"button\" id=\"start\">Start</button>";

    var startBtn = document.querySelector("#start");

    startBtn.addEventListener("click", function(){
      presentation.start();
    });
  });

});

}

function makePresentation(dialogue){

var count;
var reverse = false;
var structures = {};

var pdbPromises = []

/*init*/
loadStructure = function loadStructure(filename,structureName){
  var pdbPromise = new Promise(function(resolve,reject){
    pv.io.fetchPdb("/public/pdbs/" + filename, function(output){
      structures[structureName] = output;
      resolve();
    });
  });
  pdbPromises.push( pdbPromise );
}

loadStructure("car/1xnx_1xv9.pdb", "car");

/*return presentation object*/
return {
  "init": function init(){
    return Promise.all(pdbPromises);
  },
  "start": function start(){

    dialogue.innerHTML = "<p>Explore the features of CAR</p>" +
    "<button type=\"button\" id=\"ligand\">Ligand Binding Pocket</button><br>" +
    "<button type=\"button\" id=\"helix\">Helix 12</button>"; 


    viewer.setZoom(100,300);
    viewer.hide("*")
    viewer.centerOn(structures["car"],300);
    viewer.cartoon("car",structures["car"].select({chain: "D"}));

    ligand = document.querySelector("#ligand");

    ligand.addEventListener("click", function(){
      presentation.ligandBinding.start();
    });

    helix = document.querySelector("#helix");

    helix.addEventListener("click", function(){
      presentation.helix12.start();
    });
  },
  "ligandBinding": {
    "start": function start(){

      dialogue.innerHTML = "<button id=\"menu\">To menu</button>" +
      "<p>This is the ligand binding pocket of CAR</p>" +
      "<button type=\"button\" id=\"next\">Next</button>"; 

      viewer.setZoom(50,300);
      viewer.centerOn(structures["car"].select({rname: "ATE"}));
      viewer.setRotation([0.37443265318870544, 0.8846359848976135, -0.2777596414089203, 0, -0.9266472458839417, 0.3674111068248749, -0.07880409806966782, 0, 0.03230752795934677, 0.28687307238578796, 0.9573444724082947, 0, 0, 0, 0, 1], 300);
      viewer.hide("*");
      viewer.cartoon("car",structures["car"].select({chain: "D"}));
      
      var next = document.querySelector("#next");

      next.addEventListener("click", function(){
        presentation.ligandBinding.residues();
      });

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        presentation.start()
      });

    },
    "residues": function residues(){

      dialogue.innerHTML = "<button id=\"menu\">To menu</button>" +
      "<p>This pocket is lined with <span style =\"color:#ffa200\">hydrophobic</span> amino acids.</p>" +
      "<button type=\"button\" id=\"prev\">Previous</button>" +
      "<button type=\"button\" id=\"next\">Next</button>";

      viewer.setZoom(50,300);
      viewer.centerOn(structures["car"].select({rname: "ATE"}));
      viewer.setRotation([0.37443265318870544, 0.8846359848976135, -0.2777596414089203, 0, -0.9266472458839417, 0.3674111068248749, -0.07880409806966782, 0, 0.03230752795934677, 0.28687307238578796, 0.9573444724082947, 0, 0, 0, 0, 1], 300);      viewer.hide("*");
      viewer.cartoon("car",structures["car"].select({chain:"D"})); 
      viewer.ballsAndSticks("binding", structures["car"].select({
        chain: "D",
        rnums: [
        161,
        162,
        164,
        165,
        168,
        199,
        202,
        203,
        206,
        217,
        224,
        226,
        229,
        234,
        238,
        239,
        242,
        243,
        330,
        333]}),{radius: 0.2, color: pv.color.uniform("orange")});

      var next = document.querySelector("#next");

      next.addEventListener("click", function(){
        presentation.ligandBinding.ligand();
      });

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        presentation.start();
      });

      var prev = document.querySelector("#prev");

      prev.addEventListener("click", function(){
        presentation.ligandBinding.start();
      })


    },   
    "ligand": function ligand(){
       dialogue.innerHTML = "<button id=\"menu\">To menu</button>" +
      "<p>The chemistry of the ligand binding pocket attracts molecules " +
      "such as <span style=\"color:#ffcc73\">5&beta;-pregnane-3,20-dione</span>, " +
      "which increases gene activation by CAR</p>" +
      "<button type=\"button\" id=\"prev\">Previous</button>";

      viewer.setZoom(50,300);
      viewer.centerOn(structures["car"].select({rname: "ATE"}));
      viewer.setRotation([0.37443265318870544, 0.8846359848976135, -0.2777596414089203, 0, -0.9266472458839417, 0.3674111068248749, -0.07880409806966782, 0, 0.03230752795934677, 0.28687307238578796, 0.9573444724082947, 0, 0, 0, 0, 1], 300);
      viewer.hide("*");
      viewer.cartoon("car",structures["car"].select({chain: "D"}));
      viewer.ballsAndSticks("binding", structures["car"].select({
        chain: "D",
        rnums: [
        161,
        162,
        164,
        165,
        168,
        199,
        202,
        203,
        206,
        217,
        224,
        226,
        229,
        234,
        238,
        239,
        242,
        243,
        330,
        333]}),{radius: 0.2, color: pv.color.uniform("orange")});
      viewer.spheres("ligand", structures["car"].select({rname: "CI2"}), {radius: 0.5, color: pv.color.uniform("yellow")})

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        presentation.start()
      });

      var prev = document.querySelector("#prev");

      prev.addEventListener("click", function(){
        presentation.ligandBinding.residues()
      });
    }
  },
  "helix12": {
    "start": function start(){

      dialogue.innerHTML = "<button id=\"menu\">To menu</button>" +
      "<p>The shape of <span style=\"color:lime\">helix 12</span> determines whether " +
      "CAR will activate or deactivate genes</p>" +
      "<button type=\"button\" id=\"next\">Next</button>"; 

      viewer.setZoom(50,300);
      viewer.centerOn(structures["car"].select({chain: "D", rnumRange: [340,348]}));
      viewer.setRotation([0.9705421328544617, 0.23866713047027588, 0.032934244722127914, 0, -0.13699118793010712, 0.6591164469718933, -0.7394567131996155, 0, -0.19819200038909912, 0.7131625413894653, 0.6723951101303101, 0, 0, 0, 0, 1], 300);
      viewer.hide("*");
      selection = viewer.cartoon("car",structures["car"].select({chain: "D"}));
      selection.setSelection(structures["car"].select({rnumRange:[340,348]}));

      var next = document.querySelector("#next");

      next.addEventListener("click", function(){
        presentation.helix12.active();
      });

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        presentation.start()
      });

    },
    "active": function active(){

      dialogue.innerHTML = "<button id=\"menu\">To menu</button>" +
      "<p>In the active state, <span style=\"color:lime\">helix 12</span> will is recognized by proteins such as " +
      "<span style=\"color:#e00\">SRC</span> that help to initiate gene activation.</p>" +
      "<button type=\"button\" id=\"prev\">Previous</button>" +
      "<button type=\"button\" id=\"next\">Next</button>";

      viewer.setZoom(50,300);
      viewer.centerOn(structures["car"].select({chain: "D", rnumRange: [340,348]}));
      viewer.setRotation([0.9705421328544617, 0.23866713047027588, 0.032934244722127914, 0, -0.13699118793010712, 0.6591164469718933, -0.7394567131996155, 0, -0.19819200038909912, 0.7131625413894653, 0.6723951101303101, 0, 0, 0, 0, 1], 300);
      viewer.hide("*");
      selection = viewer.cartoon("car",structures["car"].select({chain: "D"}));
      selection.setSelection(structures["car"].select({rnumRange:[340,348]}));
      viewer.cartoon("src", structures["car"].select({chain: "H"}), {color: pv.color.uniform("red")});

      var next = document.querySelector("#next");

      next.addEventListener("click", function(){
        presentation.helix12.inactive();
      });

      var prev = document.querySelector("#prev");

      prev.addEventListener("click", function(){
        presentation.helix12.start();
      });

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        presentation.start()
      });

    },

    "inactive": function inactive(){
      
      dialogue.innerHTML = "<button id=\"menu\">To menu</button>" +
      "<p>In the inactive state, <span style=\"color:lime\">helix 12</span> will is recognized by proteins such as " +
      "SMRT (not shown) that prevent gene activation.</p>" +
      "<button type=\"button\" id=\"prev\">Previous</button>" +
      "<button type=\"button\" id=\"next\">Next</button>";

      viewer.setZoom(50,300);
      viewer.centerOn(structures["car"].select({chain: "D", rnumRange: [340,348]}));
      viewer.setRotation([0.9705421328544617, 0.23866713047027588, 0.032934244722127914, 0, -0.13699118793010712, 0.6591164469718933, -0.7394567131996155, 0, -0.19819200038909912, 0.7131625413894653, 0.6723951101303101, 0, 0, 0, 0, 1], 300);
      viewer.hide("*");
      selection = viewer.cartoon("car",structures["car"].select({chain: "B"}));
      selection.setSelection(structures["car"].select({chain: "B", rnumRange:[350,358]}));

      var next = document.querySelector("#next");

      next.addEventListener("click", function(){
        presentation.helix12.ligand();
      });

      var prev = document.querySelector("#prev");

      prev.addEventListener("click", function(){
        presentation.helix12.active();
      });

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        presentation.start()
      });
    },

    "ligand": function ligand(){

      dialogue.innerHTML = "<button id=\"menu\">To menu</button>" +
      "<p>The shape of <span style=\"color:lime\">helix 12</span> is controlled by ligand binding. " +
      "CAR will be active when either an <span>agonistic</span> molecule, or no molecule, is bound. " +
      "CAR will be inactive when an <span>inverse agonistic</span> molecule is bound.</p>" +
      "<button type=\"button\" id=\"prev\">Previous</button>";

      var active = 1;

      viewer.setZoom(50,300);
      viewer.centerOn(structures["car"].select({chain: "D", rnumRange: [340,348]}));
      viewer.setRotation([0.9705421328544617, 0.23866713047027588, 0.032934244722127914, 0, -0.13699118793010712, 0.6591164469718933, -0.7394567131996155, 0, -0.19819200038909912, 0.7131625413894653, 0.6723951101303101, 0, 0, 0, 0, 1], 300);
      viewer.hide("*");
      selection = viewer.cartoon("car",structures["car"].select({chain: "D"}));
      selection.setSelection(structures["car"].select({rnumRange:[340,348]}));
      viewer.spheres("ligand",structures["car"].select({rname:"CI2"}), {color: pv.color.uniform("red")})

      interval = window.setInterval(function(){

        if(active){
          viewer.hide("*");
          selection = viewer.cartoon("car",structures["car"].select({chain: "B"}));
          selection.setSelection(structures["car"].select({chain: "B", rnumRange:[350,358]}));
          viewer.spheres("ligand",structures["car"].select({rname:"ATE"}), {color: pv.color.uniform("blue")})

          active = 0;
        }

        else{
          viewer.hide("*");
          selection = viewer.cartoon("car",structures["car"].select({chain: "D"}));
          selection.setSelection(structures["car"].select({rnumRange:[340,348]}));
          viewer.spheres("ligand",structures["car"].select({rname:"CI2"}), {color: pv.color.uniform("red")})

          active = 1;
        }

      },1000);

      var prev = document.querySelector("#prev");

      prev.addEventListener("click", function(){
        window.clearInterval(interval);
        presentation.helix12.inactive();
      });

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        window.clearInterval(interval);
        presentation.start()
      });

    }
  }
};
}