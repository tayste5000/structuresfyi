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

loadStructure("pyruvate-carboxylase/reaction.pdb", "rxn");
loadStructure("pyruvate-carboxylase/4jx5-single.pdb", "ct");
loadStructure("pyruvate-carboxylase/reaction-2.pdb", "rxn2");
loadStructure("pyruvate-carboxylase/2qf7_double.pdb", "pc");

/*return presentation object*/
return {
  "init": function init(){
    return Promise.all(pdbPromises);
  },
  "start": function start(){

    dialogue.innerHTML = "<p>Explore the features of Pyruvate Carboxylase</p>" +
    "<button type=\"button\" id=\"reaction\">Reaction</button><br>" +
    "<button type=\"button\" id=\"domain\">Domain Arrangement</button><br>" +
    "<button type=\"button\" id=\"about\">About PC</button>"; 


    viewer.setZoom(200,300);
    viewer.hide("*");
    viewer.centerOn( structures["pc"] );
    viewer.setRotation([0.8740044236183167, 0.4792707562446594, -0.0800875723361969, 0,
      0.06771733611822128, 0.043073661625385284, 0.9967735409736633, 0,
      0.48117509484291077, -0.8766081929206848, 0.005191337782889605, 0,
      0, 0, 0, 1], 300)
    viewer.cartoon("pc",structures["pc"]);

    reaction = document.querySelector("#reaction");

    reaction.addEventListener("click", function(){
      presentation.reaction.start();
    });

    domain = document.querySelector("#domain");

    domain.addEventListener("click", function(){
      presentation.domain.start();
    });

    about = document.querySelector("#about");

    about.addEventListener("click", function(){
      presentation.about();
    });
  },
  "about": function about(){
    dialogue.innerHTML = "<button id=\"menu\"><i class=\"fa fa-arrow-circle-left\"></i>&nbsp;To menu</button>" +
      "<p>There are several thousand chemical reactions occuring in our bodies at any given moment. Compounds for many different purposes are produced from the same core metabolic building blocks. Maintaining the body's supply of these building blocks is an important task. Pyruvate carboxylase is an important enzyme for balancing the bodies metabolism. Pyruvate carboxylase converts pyruvate, a common molecular fuel, into oxaloacetate, which is important for a variety of cellular processes as a chemical building block and more.</p>"; 

    menu = document.querySelector("#menu");

    menu.addEventListener("click", function(){
      presentation.start();
    });

  },
  "reaction": {
    "start": function start(){

      dialogue.innerHTML = "<button id=\"menu\"><i class=\"fa fa-arrow-circle-left\"></i>&nbsp;To menu</button>" +
      "<p>Pyruvate Carboxylase catalyzes the carboxylation of Pyruvate to form oxaloacetate.</p>" +
      "<p style=\"text-align:center;\"><b><span class=\"rxn\" id=\"pyr-co2\" >Carbon Dioxide + Pyrvate</span>&nbsp;<i class=\"fa fa-arrow-right\"></i>&nbsp;<span class=\"rxn\" id=\"oxa\">Oxaloacetate</span></b></p>" +
      "<button type=\"button\" id=\"next\">Next</button>"; 

      var pyr = document.querySelector("#pyr-co2");
      var oxa = document.querySelector("#oxa");

      pyr.classList.add("underline");


      viewer.setZoom(25,300);
      viewer.centerOn(structures["rxn"].select({rnames: ["PYR", "CO2"]}), 300);
      viewer.setRotation([-0.7982008457183838, -0.3651939332485199, 0.4790574610233307, 0,
        -0.5309801697731018, 0.8021028637886047, -0.27324211597442627, 0,
        -0.2844701409339905, -0.4724715054035187, -0.8341556787490845, 0,
        0, 0, 0, 1], 300);
      viewer.hide("*");
      viewer.ballsAndSticks("rxn",structures["rxn"].select({rnames: ["PYR", "CO2"]}));

      var before = true;

      rxnCycle = window.setInterval(function(){
        if (before){

          viewer.hide("*");
          viewer.ballsAndSticks("rxn",structures["rxn"].select({rname: "OXA"}));

          pyr.classList.remove("underline");
          oxa.classList.add("underline");

          before = false;
        }

        else{

          viewer.hide("*");
          viewer.ballsAndSticks("rxn",structures["rxn"].select({rnames: ["PYR", "CO2"]}));

          pyr.classList.add("underline");
          oxa.classList.remove("underline");

          before = true;
        }
      },1500)
      
      var next = document.querySelector("#next");

      next.addEventListener("click", function(){
        window.clearInterval( rxnCycle );
        presentation.reaction.carbonate();
      });

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        window.clearInterval( rxnCycle );
        presentation.start();
      });

    },

    "carbonate": function residues(){

      dialogue.innerHTML = "<button id=\"menu\"><i class=\"fa fa-arrow-circle-left\"></i>&nbsp;To menu</button>" +
      "<p>Since most cellular carbon dioxide exists in the form of bicarbonate, Pyruvate carboxylase needs to " +
      "convert bicarbonate into carbon dioxide first, using the energy from an ATP molecule</p>" +
      "<p style=\"text-align:center;\"><b><span class=\"rxn\" id=\"hco3\" >bicarbonate + ATP</span>&nbsp;<i class=\"fa fa-arrow-right\"></i>&nbsp;" +
      "<span class=\"rxn\" id=\"cpo\">ADP + carboxyphosphate</span>&nbsp;<i class=\"fa fa-arrow-right\"></i>&nbsp;<span class=\"rxn\" id=\"co2\">ADP + phosphate + carbon dioxide</span></b></p>" +
      "<button type=\"button\" id=\"prev\">Previous</button>" +
      "<button type=\"button\" id=\"next\">Next</button>";

      var hco3 = document.querySelector("#hco3");
      var cpo = document.querySelector("#cpo");
      var co2 = document.querySelector("#co2");

      hco3.classList.add("underline");

      viewer.hide("*")
      viewer.setZoom(25,300);
      viewer.setRotation([0.6748999953269958, 0.6065853238105774, -0.420185387134552, 0,
        0.7127294540405273, -0.38838252425193787, 0.5840882658958435, 0,
        0.1911076456308365, -0.6936811804771423, -0.6944498419761658, 0,
        0, 0, 0, 1],300);
      viewer.setCenter([124.88284301757812, 113.5218734741211, 52.12051010131836]);
      viewer.ballsAndSticks("rxn", structures["rxn"].select({rnames: ["ATP", "HCO"]}));

      var before = 0;

      rxnCycle = window.setInterval(function(){
        if (before % 3 == 0){

          viewer.hide("*");
          viewer.ballsAndSticks("rxn",structures["rxn"].select({rnames: ["ADP", "HYD", "CPO"]}));

          hco3.classList.remove("underline");
          cpo.classList.add("underline");
        }

        else if (before % 3 == 1){

          viewer.hide("*");
          viewer.ballsAndSticks("rxn",structures["rxn"].select({rnames: ["ADP", "PO4", "CO2"]}));

          cpo.classList.remove("underline");
          co2.classList.add("underline");
        }

        else if (before % 3 == 2){

          viewer.hide("*");
          viewer.ballsAndSticks("rxn",structures["rxn"].select({rnames: ["ATP", "HCO"]}));

          co2.classList.remove("underline");
          hco3.classList.add("underline");
        }

        before++;

      },1000)

      var next = document.querySelector("#next");

      next.addEventListener("click", function(){
        window.clearInterval( rxnCycle );
        presentation.reaction.biotin();
      });

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        window.clearInterval( rxnCycle );
        presentation.start();
      });

      var prev = document.querySelector("#prev");

      prev.addEventListener("click", function(){
        window.clearInterval( rxnCycle );
        presentation.reaction.start();
      })


    },   

    "biotin": function ligand(){
      dialogue.innerHTML = "<button id=\"menu\"><i class=\"fa fa-arrow-circle-left\"></i>&nbsp;To menu</button>" +
      "<p>To keep the carbon dioxide molecule from converting back into bicarbonate " +
      "before it reaches the site of the next reaction, it is attached to a biotin molecule</p>" +
      "<p style=\"text-align:center;\"><b><span class=\"rxn\" id=\"bti\" >Carbon Dioxide + Biotin</span>&nbsp;<i class=\"fa fa-arrow-right\"></i>&nbsp;<span class=\"rxn\" id=\"cbi\">Carboxybiotin</span></b></p>" +
      "<button type=\"button\" id=\"prev\">Previous</button>" +
      "<button type=\"button\" id=\"next\">Next</button>";

      var bti = document.querySelector("#bti");
      var cbi = document.querySelector("#cbi");

      bti.classList.add("underline");

      viewer.setZoom(25,300);
      viewer.setRotation([0.4917562007904053, -0.4994637370109558, 0.7132325768470764, 0,
        -0.5406818389892578, 0.46688956022262573, 0.6997494101524353, 0,
        -0.6825063228607178, -0.7297395467758179, -0.04045388475060463, 0,
        0, 0, 0, 1], 300)
      viewer.centerOn(structures["rxn"].select({rnames: ["BTI", "CO2"]}));
      viewer.hide("*");
      viewer.ballsAndSticks("rxn",structures["rxn"].select({rnames: ["BTI", "CO2"]}));

      before = true;

      rxnCycle = window.setInterval(function(){
        if (before){

          viewer.hide("*");
          viewer.ballsAndSticks("rxn",structures["rxn"].select({rname: "CBT"}));

          bti.classList.remove("underline");
          cbi.classList.add("underline");

          before = false;
        }

        else{

          viewer.hide("*");
          viewer.ballsAndSticks("rxn",structures["rxn"].select({rnames: ["BTI", "CO2"]}));

          bti.classList.add("underline");
          cbi.classList.remove("underline");

          before = true;
        }
      },1500)

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        window.clearInterval( rxnCycle );
        presentation.start()
      });

      var next = document.querySelector("#next");

      next.addEventListener("click", function(){
        window.clearInterval( rxnCycle );
        presentation.reaction.halfRxn();
      });

      var prev = document.querySelector("#prev");

      prev.addEventListener("click", function(){
        window.clearInterval( rxnCycle );
        presentation.reaction.biotin()
      });
    },
    "halfRxn": function ligand(){
      dialogue.innerHTML = "<button id=\"menu\"><i class=\"fa fa-arrow-circle-left\"></i>&nbsp;To menu</button>" +
      "<p>These reactions are performed all together in the <b>biotin carboxylase</b> domain of pyruvate carboxylase.</p>" +
      "<button type=\"button\" id=\"prev\">Previous</button>" +
      "<button type=\"button\" id=\"next\">Next</button>";

      viewer.setZoom(25,300);
      viewer.setRotation([-0.8920552730560303, 0.3818952739238739, -0.24162141978740692, 0,
        -0.17818959057331085, 0.19411112368106842, 0.96464604139328, 0,
        0.4152979254722595, 0.9035773277282715, -0.1051052063703537, 0,
        0, 0, 0, 1]);
      viewer.centerOn(structures["rxn"].select({rnames: ["BTI", "CO2"]}));
      viewer.hide("*");
      viewer.cartoon("pc", structures["pc"]);

      var before = 0;

      rxnCycle = window.setInterval(function(){

        switch (before % 5){

          case 0:
            viewer.rm("rxn");
            viewer.ballsAndSticks("rxn",structures["rxn"].select({rnames: ["BTI", "HCO", "ATP"]}));

            break;

          case 1:

            viewer.rm("rxn");
            viewer.ballsAndSticks("rxn",structures["rxn"].select({rnames: ["BTI", "HYD", "CPO", "ADP"]}));

            break;

          case 2:

            viewer.rm("rxn");
            viewer.ballsAndSticks("rxn",structures["rxn"].select({rnames: ["BTI", "CO2", "PO4", "ADP"]}));

            break;

          case 3:

            viewer.rm("rxn");
            viewer.ballsAndSticks("rxn",structures["rxn"].select({rnames: ["CBT", "PO4", "ADP"]}));

            break;

        }

        before++;

      },500);

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        window.clearInterval( rxnCycle );
        presentation.start()
      });

      var next = document.querySelector("#next");

      next.addEventListener("click", function(){
        window.clearInterval( rxnCycle );
        presentation.reaction.pyruvate();
      });

      var prev = document.querySelector("#prev");

      prev.addEventListener("click", function(){
        window.clearInterval( rxnCycle );
        presentation.reaction.biotin()
      });
    },
    "pyruvate": function ligand(){
      dialogue.innerHTML = "<button id=\"menu\"><i class=\"fa fa-arrow-circle-left\"></i>&nbsp;To menu</button>" +
      "<p>Next, the carboxyl carrying biotin is transported to the <b>carboxyltransferase</b> " + 
      "domain where it is used to carboxylate pyruvate in order to form oxaloacetate.</p>" +
      "<p style=\"text-align:center;\"><b><span class=\"rxn\" id=\"cbt\" >carboxybiotin + pyruvate</span>&nbsp;<i class=\"fa fa-arrow-right\"></i>&nbsp;" +
      "<span class=\"rxn\" id=\"bti\">biotin + CO2 + pyruvate</span>&nbsp;<i class=\"fa fa-arrow-right\"></i>&nbsp;<span class=\"rxn\" id=\"oxa\">biotin + oxaloacetate</span></b></p>" +
      "<button type=\"button\" id=\"prev\">Previous</button>";

      var cbt = document.querySelector("#cbt");
      var bti = document.querySelector("#bti");
      var oxa = document.querySelector("#oxa");

      cbt.classList.add("underline");

      viewer.setZoom(25,300);
      viewer.centerOn(structures["rxn2"].select({rnames: ["BTI", "CO2"]}));
      viewer.setRotation([0.17471960186958313, 0.8800305128097534, 0.44157958030700684, 0,
        0.6810445189476013, 0.21587009727954865, -0.6996638178825378, 0,
        -0.711059033870697, 0.422987163066864, -0.5616323947906494, 0,
        0, 0, 0, 1],300);
      viewer.hide("*");
      viewer.ballsAndSticks("rxn2",structures["rxn2"].select({rnames: ["CBT", "PYR"]}));
      viewer.cartoon("ct", structures["ct"]);

      var before = 0;

      rxnCycle = window.setInterval(function(){
        if (before % 3 == 0){

          viewer.rm("rxn2");
          viewer.ballsAndSticks("rxn2",structures["rxn2"].select({rnames: ["BTE", "HYD", "CO2", "PYE"]}));

          cbt.classList.remove("underline");
          bti.classList.add("underline");
        }

        else if (before % 3 == 1){

          viewer.rm("rxn2");
          viewer.ballsAndSticks("rxn2",structures["rxn2"].select({rnames: ["BTI", "OXA"]}));

          bti.classList.remove("underline");
          oxa.classList.add("underline");
        }

        else {

          viewer.rm("rxn2");
          viewer.ballsAndSticks("rxn2",structures["rxn2"].select({rnames: ["CBT", "PYR"]}));

          oxa.classList.remove("underline");
          cbt.classList.add("underline");
        }

        before++;

      },1000)

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        window.clearInterval( rxnCycle );
        presentation.start()
      });

      var prev = document.querySelector("#prev");

      prev.addEventListener("click", function(){
        window.clearInterval( rxnCycle );
        presentation.reaction.biotin()
      });
    },
  },
  "domain": {
    "start": function start(){

      dialogue.innerHTML = "<button id=\"menu\"><i class=\"fa fa-arrow-circle-left\"></i>&nbsp;To menu</button>" +
      "<p>A single chain of pyruvate carboxylase contains over 1000 amino acids</p>" +
      "<button type=\"button\" id=\"next\">Next</button>"; 

      viewer.setZoom(150,300);
      viewer.centerOn(structures["pc"].select({chain: "A" }), 300);
      viewer.setRotation([-0.2888628840446472, 0.8736864924430847, -0.3913517892360687, 0,
        -0.12120189517736435, 0.3721407353878021, 0.920219898223877, 0,
        0.9496287107467651, 0.31326746940612793, -0.0015848546754568815, 0,
        0, 0, 0, 1], 300);
      viewer.hide("*");
      selection = viewer.cartoon("pc",structures["pc"].select({chain: "A"}));
      //selection.setSelection(structures["car"].select({rnumRange:[340,348]}));

      var next = document.querySelector("#next");

      next.addEventListener("click", function(){
        presentation.domain.bc();
      });

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        presentation.start()
      });

    },
    "bc": function active(){

      dialogue.innerHTML = "<button id=\"menu\"><i class=\"fa fa-arrow-circle-left\"></i>&nbsp;To menu</button>" +
      "<p>The <span>biotin carboxylase</span> (BC) domain performs a reaction that converts bicarbonate " +
      "into carbon dioxide and transfers it to a biotin group.</p>" +
      "<button type=\"button\" id=\"prev\">Previous</button>" +
      "<button type=\"button\" id=\"next\">Next</button>";

      viewer.setZoom(150,300);
      viewer.centerOn(structures["pc"].select({chain: "A" }), 300);
      viewer.setRotation([-0.2888628840446472, 0.8736864924430847, -0.3913517892360687, 0,
        -0.12120189517736435, 0.3721407353878021, 0.920219898223877, 0,
        0.9496287107467651, 0.31326746940612793, -0.0015848546754568815, 0,
        0, 0, 0, 1], 300);
      viewer.hide("*");
      selection = viewer.cartoon("pc",structures["pc"].select({chain: "A"}));
      selection.setSelection(structures["pc"].select({chain: "A", rnumRange:[1,467]}));

      var next = document.querySelector("#next");

      next.addEventListener("click", function(){
        presentation.domain.ct();
      });

      var prev = document.querySelector("#prev");

      prev.addEventListener("click", function(){
        presentation.domain.start();
      });

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        presentation.start()
      });

    },

    "ct": function active(){

      dialogue.innerHTML = "<button id=\"menu\"><i class=\"fa fa-arrow-circle-left\"></i>&nbsp;To menu</button>" +
      "<p>The carboxyltransferase (CT) domain catalyzes the transfer of a carboxyl group from biotin to pyruvate to form oxaloacetate.</p>" +
      "<button type=\"button\" id=\"prev\">Previous</button>" +
      "<button type=\"button\" id=\"next\">Next</button>";

      viewer.setZoom(150,300);
      viewer.centerOn(structures["pc"].select({chain: "A" }), 300);
      viewer.setRotation([-0.2888628840446472, 0.8736864924430847, -0.3913517892360687, 0,
        -0.12120189517736435, 0.3721407353878021, 0.920219898223877, 0,
        0.9496287107467651, 0.31326746940612793, -0.0015848546754568815, 0,
        0, 0, 0, 1], 300);
      viewer.hide("*");
      selection = viewer.cartoon("pc",structures["pc"].select({chain: "A"}));
      selection.setSelection(structures["pc"].select({chain: "A", rnumRange:[516,1001]}));

      var next = document.querySelector("#next");

      next.addEventListener("click", function(){
        presentation.domain.bccp();
      });

      var prev = document.querySelector("#prev");

      prev.addEventListener("click", function(){
        presentation.domain.bc();
      });

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        presentation.start()
      });

    },

    "bccp": function active(){ 

      dialogue.innerHTML = "<button id=\"menu\"><i class=\"fa fa-arrow-circle-left\"></i>&nbsp;To menu</button>" +
      "<p>The <span>biotin carboxyl carrier protein</span> (BCCP) is linked to biotin and responsible for transporting " +
      "a carboxyl group from the BC domain to the CT domain in order to complete the reaction.</p>" +
      "<button type=\"button\" id=\"prev\">Previous</button>" +
      "<button type=\"button\" id=\"next\">Next</button>";

      viewer.setZoom(150,300);
      viewer.centerOn(structures["pc"].select({chain: "A" }), 300);
      viewer.setRotation([-0.2888628840446472, 0.8736864924430847, -0.3913517892360687, 0,
        -0.12120189517736435, 0.3721407353878021, 0.920219898223877, 0,
        0.9496287107467651, 0.31326746940612793, -0.0015848546754568815, 0,
        0, 0, 0, 1], 300);
      viewer.hide("*");
      viewer.hide("*");
      selection = viewer.cartoon("pc",structures["pc"].select({chain: "A"}));
      selection.setSelection(structures["pc"].select({chain: "A", rnumRange:[1077,1152]}));

      var next = document.querySelector("#next");

      next.addEventListener("click", function(){
        presentation.domain.mono();
      });

      var prev = document.querySelector("#prev");

      prev.addEventListener("click", function(){
        presentation.domain.ct();
      });

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        presentation.start()
      });

    },

    "mono": function mono(){

      dialogue.innerHTML = "<button id=\"menu\"><i class=\"fa fa-arrow-circle-left\"></i>&nbsp;To menu</button>" +
      "<p>It is unfavorable for the BCCP domain to travel from the BC to the CT domains within a single " +
      "pyruvate carboxylase unit due to the distance they are separated by.</p>" +
      "<button type=\"button\" id=\"prev\">Previous</button>" +
      "<button type=\"button\" id=\"next\">Next</button>";

      viewer.setZoom(150,300);
      viewer.centerOn(structures["pc"].select({chain: "A" }));
      viewer.setRotation([-0.2888628840446472, 0.8736864924430847, -0.3913517892360687, 0,
        -0.12120189517736435, 0.3721407353878021, 0.920219898223877, 0,
        0.9496287107467651, 0.31326746940612793, -0.0015848546754568815, 0,
        0, 0, 0, 1], 300);
      viewer.hide("*");
      selection = viewer.cartoon("pc",structures["pc"].select({chain: "A"}));
      selection.setSelection(structures["pc"].select({chain: "A", rnumRange:[1,467]}));

      before = true;

      rxnCycle = window.setInterval(function(){
        if (before){
          viewer.hide("*");
          selection = viewer.cartoon("pc",structures["pc"].select({chain: "A"}));
          selection.setSelection(structures["pc"].select({chain: "A", rnumRange:[516,1001]}));
        }

        else{
          viewer.hide("*");
          selection = viewer.cartoon("pc",structures["pc"].select({chain: "A"}));
          selection.setSelection(structures["pc"].select({chain: "A", rnumRange:[1,467]}));
        }

        before = !before;
      },1000);

      var next = document.querySelector("#next");

      next.addEventListener("click", function(){
        window.clearInterval(rxnCycle);
        presentation.domain.di();
      });

      var prev = document.querySelector("#prev");

      prev.addEventListener("click", function(){
        window.clearInterval(rxnCycle);
        presentation.domain.bccp();
      });

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        window.clearInterval(rxnCycle);
        presentation.start();
      });

    },

    "di": function di(){

      dialogue.innerHTML = "<button id=\"menu\"><i class=\"fa fa-arrow-circle-left\"></i>&nbsp;To menu</button>" +
      "<p>When two pyruvate carboxylase units come together with BC domain in one unit facing the CT in the other, " +
      "the distance that the BCCP domain needs to travel in order to transport CO2 is much shorter.</p>" +
      "<button type=\"button\" id=\"prev\">Previous</button>" +
      "<button type=\"button\" id=\"next\">Next</button>";

      viewer.setZoom(200,300);
      viewer.centerOn(structures["pc"].select({chains: ["A","C"] }), 300);
      viewer.setRotation([-0.2888628840446472, 0.8736864924430847, -0.3913517892360687, 0,
        -0.12120189517736435, 0.3721407353878021, 0.920219898223877, 0,
        0.9496287107467651, 0.31326746940612793, -0.0015848546754568815, 0,
        0, 0, 0, 1], 300);
      viewer.hide("*");
      selection = viewer.cartoon("pc",structures["pc"].select({chains: ["A","C"] }));
      selection.setSelection(structures["pc"].select({chain: "A", rnumRange:[1,467]}));

      before = true;

      rxnCycle = window.setInterval(function(){
        if (before){
          viewer.hide("*");
          selection = viewer.cartoon("pc",structures["pc"].select({chains: ["A","C"] }));
          selection.setSelection(structures["pc"].select({chain: "C", rnumRange:[516,1001]}));
        }

        else{
          viewer.hide("*");
          selection = viewer.cartoon("pc",structures["pc"].select({chains: ["A","C"] }));
          selection.setSelection(structures["pc"].select({chain: "A", rnumRange:[1,467]}));
        }

        before = !before;
      },1000);

      var next = document.querySelector("#next");

      next.addEventListener("click", function(){
        window.clearInterval(rxnCycle);
        presentation.domain.tetra();
      });

      var prev = document.querySelector("#prev");

      prev.addEventListener("click", function(){
        window.clearInterval(rxnCycle);
        presentation.domain.mono();
      });

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        window.clearInterval(rxnCycle);
        presentation.start();
      });

    },

    "tetra": function active(){

      dialogue.innerHTML = "<button id=\"menu\"><i class=\"fa fa-arrow-circle-left\"></i>&nbsp;To menu</button>" +
      "<p>In the active form of pyruvate carboxylase, four chains come together to form a tetramer.</p>" +
      "<button type=\"button\" id=\"prev\">Previous</button>";

      viewer.setZoom(200,300);

      viewer.centerOn( structures["pc"] );

      viewer.setRotation([-0.88040691614151, -0.45164376497268677, 0.1439330130815506, 0,
        0.07239040732383728, 0.1718580722808838, 0.9824074506759644, 0,
        -0.46849390864372253, 0.8753977417945862, -0.11853103339672089, 0,
        0, 0, 0, 1], 300);

      viewer.hide("*");
      viewer.cartoon("pc",structures["pc"].select({chain: "A"}), {color: pv.color.uniform("#7777cc")});
      viewer.cartoon("pc",structures["pc"].select({chain: "C"}), {color: pv.color.uniform("#9999ff")});
      viewer.cartoon("pc",structures["pc"].select({chain: "B"}), {color: pv.color.uniform("#33ccaa")});
      viewer.cartoon("pc",structures["pc"].select({chain: "D"}), {color: pv.color.uniform("#55ffcc")});


      var prev = document.querySelector("#prev");

      prev.addEventListener("click", function(){
        presentation.domain.di();
      });

      var menu = document.querySelector("#menu");

      menu.addEventListener("click", function(){
        presentation.start()
      });

    }
  }
};

}