// Liste des animations
window.onload = function () {
    var select = document.getElementById("listeAnimations"),
        i = 0,
        options = ["Aucune", "bounce", "flash", "pulse", "rubberBand", "shake", "swing", "tada", "wobble", "jello", "bounceIn", "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp", "bounceOut", "bounceOutDown", "bounceOutLeft", "bounceOutRight", "bounceOutUp", "fadeIn", "fadeInDown", "fadeInDownBig", "fadeInLeft", "fadeInLeftBig", "fadeInRight", "fadeInRightBig", "fadeInUp", "fadeInUpBig", "fadeOut", "fadeOutDown", "fadeOutDownBig", "fadeOutLeft", "fadeOutLeftBig", "fadeOutRight", "fadeOutRightBig", "fadeOutUp", "fadeOutUpBig", "flipInX", "flipInY", "flipOutX", "flipOutY", "lightSpeedIn", "lightSpeedOut", "rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight", "rotateOut", "rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight", "hinge", "rollIn", "rollOut", "zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp", "zoomOut", "zoomOutDown", "zoomOutLeft", "zoomOutRight", "zoomOutUp", "slideInDown", "slideInLeft", "slideInRight", "slideInUp", "slideOutDown", "slideOutLeft", "slideOutRight", "slideOutUp" ];
    for (i = 0; i < options.length; i++) {
        var opt = options[i],
            el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
}

// Importation des elements
function importation() {
    var file = document.querySelector('input[type=file]').files[0],
        reader = new FileReader();
    reader.readAsDataURL(file);
    var fs = require('fs');
    if (file.name.slice(file.name.lastIndexOf('.')+1, file.name.length) == "mp4"){
        var destination = './resultat/video.mp4';
        fs.createReadStream(file.path).pipe(fs.createWriteStream(destination));
        // Ajout de la video
        function ajoutVideo() { 
            var video1El = document.getElementById('video1'),
                video1 = new fabric.Image(video1El, {
                angle: -15
            });
            canvas.add(video1);
            video1.set('src', "video1");
            video1.set('id', index+1);
            video1.getElement().play();
            fabric.util.requestAnimFrame(function render() {
                canvas.renderAll();
                fabric.util.requestAnimFrame(render);
            });
        }
        setTimeout(ajoutVideo,1000);
        index = index+1;
    }
    else {
     
        var destination = './resultat/' + file.name + '';
        fs.createReadStream(file.path).pipe(fs.createWriteStream(destination)); 
        // Ajout de l'element
        function ajout () {
                fabric.Image.fromURL('.' +destination +'', function(oImg) {canvas.add(oImg);oImg.set('selectable', true);oImg.set('src', destination);oImg.set('id', index+1);});
        } 
        setTimeout(ajout, 500);
        index = index+1;
    }
        var select = document.getElementById("listeElements");
        select.options[select.options.length] = new Option(file.name);
        select.selectedIndex = select.options.length -1;
}

// Ajout de la classe JS à HTML pour l'importation d'elements
document.querySelector("html").classList.add('js');
 
// initialisation des variables pour l'importation des elements
var fileInput  = document.querySelector( ".input-file" ),  
    button     = document.querySelector( ".input-file-trigger" ),
    the_return = document.querySelector(".file-return");

// Création du zip final
function creationZip() {
    canvas.forEachObject(function(obj) {
        // Recuperation des propietes de chaque element
        var objetAngle = obj.getAngle(),
            objetLeft = obj.getLeft(),
            objetTop = obj.getTop(),
            objetWidth = obj.getWidth(),
            objetHeight = obj.getHeight(),
            objetOpacite = obj.getOpacity(),
            objetSource = obj.get('src'),
            objetId = obj.get('id'),
            objetAnimation = obj.get('animation'),
            objetDelai = obj.get('delai'),
            objetDuree = obj.get('duree'),
        // Ecriture dans le fichier final index.html
            appliquer = "",
            fs = require('fs'),
            array = fs.readFileSync('./resultat/index.html').toString().split("\n");
        console.log(array);
        for(i in array) {
            if (array[i].indexOf("<div id=\"container\">") == -1  && array[i].indexOf("      background-color: transparent;}") == -1){
                appliquer += array[i] + "\n";
            }
            else if (array[i].indexOf("<div id=\"container\">") != -1){
                if (objetSource == "video1"){
                    appliquer += array[i] + "\n" + "<video src=\"video.mp4\" class=\"classe" + objetId + " " + objetAnimation + " animated speed-"+ objetDuree + "s delay-" + objetDelai + "s\" autoplay loop></video>\n";
                }
                else {
                    appliquer += array[i] + "\n" + "<img src=\"" + objetSource.slice(objetSource.lastIndexOf("/")+1,objetSource.length) + "\" class=\"classe" + objetId + " " + objetAnimation + " animated speed-"+ objetDuree + "s delay-" + objetDelai + "s\">\n";
                }
            }
            else if (array[i].indexOf("      background-color: transparent;}") != -1){
                appliquer += array[i] + "\n    .classe" + objetId + " {\n      position: absolute; \n      left:" + (objetLeft*100)/960 + "%;\n      Top:" + (objetTop*100)/540 + "%;\n      height:auto;\n      opacity:" + objetOpacite + ";\n      z-index:" + objetId + ";\n      width:" + (objetWidth*100)/960 + "%;\n      -webkit-transform: rotate(" + objetAngle + "deg);}\n";
            }
        }
        fs.writeFileSync('./resultat/index.html', appliquer);
    })
/*    var champNom = document.getElementById("nomRom"),
        nomRom = champNom.value,
        zip = new JSZip(),
        dossier = zip.folder("./resultat"),
        theme = zip.generate({type:"blob"});
    saveAs(theme, nomRom);*/
}

// Selection de l'element en cours
function changeElement() {
    var select = document.getElementById("listeElements");
    canvas.setActiveObject(canvas.item(select.selectedIndex));
}

// Choix de l'animation
function changeAnimation() {
    var select = document.getElementById("listeAnimations"),
        champDelai = document.getElementById("delai"),
        delai = new Number(champDelai.value),
        champVitesse = document.getElementById("duree"),
        vitesse = new Number(champVitesse.value),
        activeObject = canvas.getActiveObject();
    activeObject.set('animation', select.options[select.selectedIndex].text);
    activeObject.set('delai', delai);
    activeObject.set('duree', vitesse);
}

// Met l'élément au premier plan
function enAvant() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
        canvas.bringToFront(activeObject);
    }
}

// Met l'élément en arrière plan
function enArriere() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.sendToBack(activeObject);
    }
}

// Change l'opacité de l'élément selectionné
function changeOpacite() {
    var activeObject = canvas.getActiveObject(),
        champOpacite = document.getElementById("opacite");
    activeObject.set({opacity : new Number(champOpacite.value)});
    canvas.renderAll();
}
