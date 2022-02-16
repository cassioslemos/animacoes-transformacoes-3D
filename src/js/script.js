function main() {


  const { gl, meshProgramInfo } = initializeWorld();

  const gui = new dat.GUI();
  var lista = []; //lista de objetos a serem desenhados
  var animacoesobjeto = []; //lista de animações que o objeto deve realizar
  var malhas = []; //lista de malhas
  var then = 0; //tempo onde do passo anterior da animação
  var tempnow = 0; //tempo atual 
  var flag = 0; //alteração de objeto
  var flagcamera = 0; //alteração de camera
  var flaganimação = 0; //sinaliza que começou uma animação
  var flagcamerapoint = 0; //sinaliza quando foi terminado uma rotação no ponto da camera
  var objetosnome = []; //nome dos objetos em cena
  objetosnome.push("");
  var controladorcombobox; //combo box que diz qual objeto está sendo controlado
  var controladorcomboboxanimacao; //combo box que diz qual objeto está sendo animado
  var controladortranslatelinear; //check box da translação linear
  var controladorrotationX; //controladores da Rotação
  var controladorrotationY;
  var controladorrotationZ;
  var controladorrotationcameraX; //controladores da Rotação da camera
  var controladorrotationcameraY;
  var controladorrotationcameraZ;
  var controladorscale; //controlador da escala
  var controladortranslateX; //controladores da translação
  var controladortranslateY;
  var controladortranslateZ;
  var controladortranslatecameraX; //controladores da translação da camera
  var controladortranslatecameraY;
  var controladortranslatecameraZ;
  var controladortranslatelinearcamera; //check box da translação linear da camera
  var controladorzoomcamera; //controlador de zoom da camera
  var controladorrotationpoint; //controlador de rotação no ponto
  var controladorcomboboxlookat; //controlador do combo box do look at
  var controladorlookat; //controlador do look at
  var controladorrotationpointcamera; //controlador da rotação no ponto da camera
  var controladoracompanhar; //controlador de apcompanhamento de objeto em animação
  var contcamera = []; //quantidade de cameras
  var listacamera = [];
  contcamera.push(1);
  var cameraInfo = { //criando matrix do objeto 
            position: [0,0,0],
            rotation: [0,0,0],
            scale: 60,
  };
  listacamera.push(cameraInfo);
  var controladorcomboboxcamera;
  var nome = []; //lista de nome de figuras
  nome.push("F"); //listando nome de figuras
  nome.push("Cubo");
  nome.push("Plano");
  nome.push("Esfera");
  nome.push("Cone");
  nome.push("Crescente");
  nome.push("Cilindro");
  nome.push("Disco");
  nome.push("Anel");
  var listaanimacoes = []; //lista de animações
  listaanimacoes.push("");
  listaanimacoes.push("Translação Linear em X");
  listaanimacoes.push("Translação Linear em Y");
  listaanimacoes.push("Translação Linear em Z");
  listaanimacoes.push("Translação Bezier");
  listaanimacoes.push("Rotação no Eixo em X");
  listaanimacoes.push("Rotação no Eixo em Y");
  listaanimacoes.push("Rotação no Eixo em Z");
  listaanimacoes.push("Rotação no Ponto em X");
  listaanimacoes.push("Rotação no Ponto em Y");
  listaanimacoes.push("Rotação no Ponto em Z");
  listaanimacoes.push("Escalar Maior");
  listaanimacoes.push("Escalar Menor");
  listaanimacoes.push("Zoom");
  
    
function updateDropdown(target, list){   
    innerHTMLStr = "";
    for(var i=0; i<list.length; i++){
        var str = "<option value='" + list[i] + "'>" + list[i] + "</option>";
        innerHTMLStr += str;        
    }

    if (innerHTMLStr != "") target.domElement.children[0].innerHTML = innerHTMLStr;
}

  var config = {adicionar: function(){ //configuração do botão de adicionar
          var r = Math.random() * 1; //escolhendo cor
          var g = Math.random() * 1;
          var b = Math.random() * 1;
    var objUniforms = { //criando matrix do objeto
            u_colorMult: [r, g, b, 1],
            u_matrix: m4.identity(), 
            position: [0,0,0],
            rotation: [20,20,20],
            scale: 1,
            indice: Math.floor(Math.random() * 9), //escolha da malha aleatoriamente
            nome: "",
          };
    objUniforms.nome = "Objeto "+(lista.length)+" "+nome[(objUniforms.indice)]; //gerando o nome do objeto
    objetosnome.push(objUniforms.nome); //mandando o nome para a lista de nomes de objetos em cena
    updateDropdown(controladorcombobox , objetosnome); // atualizando combo box de objetos
    updateDropdown(controladorcomboboxlookat, objetosnome); //atualiza combo box de objetos do look at
    updateDropdown(controladorcomboboxanimacao, objetosnome); //atualiza combo box de objetos da animação

    lista.push(objUniforms); //mandando matrix e informações do objeto pra lista de objetos em cena
  }, remover: function(){ //função remover objeto
      if(animacoesobjeto.length>0){
          alert("Realize a animação primeiro!");
      }
      else{
              var excluiu = 0;
              var tamanho = lista.length;
              var pulo;
              for(var i=0; i<tamanho; i++){
                  if(excluiu==1){
                    for(var j=0; j<lista[i-1].nome.length; j++){
                        if(lista[i-1].nome.charAt(8+j)==" "){
                            pulo=j;
                            break;
                        }
                    }
                    lista[i-1].nome = lista[i-1].nome.substring(0,7)+(i-1)+ lista[i-1].nome.substring(8+pulo); //atuliza numeração do objeto no nome
                    objetosnome[i-1] = objetosnome[i-1].substring(0,7)+(i-1)+ objetosnome[i-1].substring(8+pulo); //atualiza numeração do objeto no menu
                  }
                  if(excluiu==0){
                      if(lista[i].nome == config.objeto){
                          lista.splice(i,1); //remove objeto da lista
                          objetosnome.splice(i,1);
                          controladorcombobox.setValue(" ");
                          excluiu = 1;
                      }   
                  }
      }
      updateDropdown(controladorcombobox , objetosnome); // atualizando combo box
      updateDropdown(controladorcomboboxlookat, objetosnome); //atualiza combo box de objetos do look at
      updateDropdown(controladorcomboboxanimacao, objetosnome); //atualiza combo box de objetos da animação  
      }
  },adicionarcamera: function(){ //função adicionar camera
      cameraInfo = { //criando matrix do objeto 
            position: [0,0,0],
            rotation: [0,0,0],
            scale: 60,
          };
      contcamera.push(contcamera[contcamera.length-1]+1);
      updateDropdown(controladorcomboboxcamera , contcamera); // atualizando combo box
      listacamera.push(cameraInfo);
  },removercamera: function(){
     if(contcamera.length>1){
         var tamanho = contcamera.length;
         var excluiu = 0;
         for(var i=0; i<tamanho; i++){
             if(excluiu==1){
                contcamera[i-1] = i; //atuliza numeração das cameras
              }
              if(excluiu==0){
                  if(contcamera[i] == config.cameras){
                      contcamera.splice(i,1); //remove camera da lista
                      listacamera.splice(i,1);
                      controladorcomboboxcamera.setValue(1);
                      excluiu = 1;
                  }   
              }
         }
         updateDropdown(controladorcomboboxcamera, contcamera);//atualiza combo box das cameras
     }   
    else{
        alert("É obrigatório ter no mínimo 1 câmera!");
    }
  },adicionaranimacao: function(){
      if(config.animarobjeto == true){ //se for animar um objeto
          if(config.animacoes=="" || config.animacaoobjeto==""){
              alert("Selecione uma animação e um objeto!");
          }
          else if(config.animacoes=="Zoom"){
              alert("Essa é uma animação exclusiva para câmera");
          }
          else{
              if(config.animacoes=="Translação Linear em X" || config.animacoes=="Translação Linear em Y" || config.animacoes=="Translação Linear em Z"){
                var objAnimation = { //criando info da animação 
                objeto: config.animacaoobjeto, 
                animacao: config.animacoes,
                tempo: config.tempoanimacao,
                movimento: config.animacaotranslacao,
                inicial: [lista[config.animacaoobjeto.charAt(7)].position[0],lista[config.animacaoobjeto.charAt(7)].position[1],lista[config.animacaoobjeto.charAt(7)].position[2]],
                inicial2: [0,0,0],
                raio: 0
                };  
              }
              else if(config.animacoes=="Translação Bezier"){
                  var objAnimation = { //criando info da animação 
                  objeto: config.animacaoobjeto, 
                  animacao: config.animacoes,
                  tempo: config.tempoanimacao,
                  movimento: config.animacaobezier, 
                  inicial: [config.bezierstartX,config.bezierstartY,config.bezierstartZ],
                  inicial2: [0,0,0], 
                  raio: 0
                };  
              }
              else if(config.animacoes=="Escalar Maior" || config.animacoes=="Escalar Menor"){
                var objAnimation = { //criando info da animação
                objeto: config.animacaoobjeto, 
                animacao: config.animacoes,
                tempo: config.tempoanimacao,
                movimento: config.animacaoescala,
                inicial: [lista[config.animacaoobjeto.charAt(7)].scale,lista[config.animacaoobjeto.charAt(7)].scale,lista[config.animacaoobjeto.charAt(7)].scale],
                inicial2: [0,0,0],
                raio: 0
                }; 
              }
              else{
                var objAnimation = { //criando info da animação
                objeto: config.animacaoobjeto, 
                animacao: config.animacoes,
                tempo: config.tempoanimacao,
                movimento: config.animacaorotacao,
                inicial: [lista[config.animacaoobjeto.charAt(7)].position[0],lista[config.animacaoobjeto.charAt(7)].position[1],lista[config.animacaoobjeto.charAt(7)].position[2]],
                inicial2: [lista[config.animacaoobjeto.charAt(7)].rotation[0],lista[config.animacaoobjeto.charAt(7)].rotation[1],lista[config.animacaoobjeto.charAt(7)].rotation[2]],
                raio: config.animacaoraio
                }; 
              }
              animacoesobjeto.push(objAnimation);
          }
      }
      else{ //se for animar a câmera
          if(config.animacoes==""){
              alert("Selecione uma animação para a câmera!");
          }
          else if(config.animacoes=="Escalar Maior" || config.animacoes=="Escalar Menor"){
              alert("Essa é uma animação exclusiva para objeto");
          }
          else{
              if(config.animacoes=="Translação Linear em X" || config.animacoes=="Translação Linear em Y" || config.animacoes=="Translação Linear em Z"){
                var objAnimation = { //criando info da animação 
                objeto: "camera", 
                animacao: config.animacoes,
                tempo: config.tempoanimacao,
                movimento: config.animacaotranslacao,
                inicial: [listacamera[config.cameras-1].position[0], listacamera[config.cameras-1].position[1], listacamera[config.cameras-1].position[2]],
                inicial2: [0,0,0],
                raio: 0
                };  
              }
              else if(config.animacoes=="Translação Bezier"){
                  var objAnimation = { //criando info da animação 
                  objeto: "camera", 
                  animacao: config.animacoes,
                  tempo: config.tempoanimacao,
                  movimento: config.animacaobezier, 
                  inicial: [config.cbezierstartX,config.cbezierstartY,config.cbezierstartZ],
                  inicial2: [0,0,0], 
                  raio: 0
                };  
              }
              else if(config.animacoes=="Zoom"){
                var objAnimation = { //criando info da animação
                objeto: "camera", 
                animacao: config.animacoes,
                tempo: config.tempoanimacao,
                movimento: config.animacaozoom,
                inicial: [listacamera[config.cameras-1].scale, listacamera[config.cameras-1].scale, listacamera[config.cameras-1].scale],
                inicial2: [0,0,0],
                raio: 0
                }; 
              }
              else{
                var objAnimation = { //criando info da animação
                objeto: "camera", 
                animacao: config.animacoes,
                tempo: config.tempoanimacao,
                movimento: config.animacaorotacao,
                inicial: [listacamera[config.cameras-1].position[0], listacamera[config.cameras-1].position[1], listacamera[config.cameras-1].position[2]],
                inicial2: [listacamera[config.cameras-1].rotation[0], listacamera[config.cameras-1].rotation[1], listacamera[config.cameras-1].rotation[2]],
                raio: config.animacaoraio
                }; 
              }
              animacoesobjeto.push(objAnimation);
          }
      }
  }, comecaranimacao: function(){
     if(animacoesobjeto.length==0){
         alert("É necessário adicionar animações à lista!");
     }
      else{
          controladorcombobox.setValue("");
          then = tempnow;  
          flaganimação = 1;
          controladorcomboboxlookat.setValue(false);
          controladorrotationpoint.setValue(false);
          controladorrotationpointcamera.setValue(false);
          controladortranslatelinearcamera.setValue(true);
          controladortranslatelinear.setValue(true);
      }
      
  }, crotateX: degToRad(0) , crotateY: degToRad(0), crotateZ: degToRad(0), ctranslateX: 0 , ctranslateY: 0, ctranslateZ: 0, czoom: 60, ctranslationlinear: true, ctranslationbezier: false, crotacaoeixo: true, crotationpoint: false, crotationpointX: true, crotationpointY: false, crotationpointZ: false, craio: 100, cangulo: 0, cbezierstartX: 0, cbezierstartY: 0, cbezierstartZ: 0, cbezierp1X: 0, cbezierp1Y: 0, cbezierp1Z: 90, cbezierp2X: 0 , cbezierp2Y: 90, cbezierp2Z: 0, cbezierendX: 90, cbezierendY: 90, cbezierendZ: 0, ct: 0, rotatepoint: false, rotateX: 20 , rotateY: 20, rotateZ: 20, translateX: 0, translateY: 0, translateZ: 0, scale: 1, bezierstartX: 0, bezierstartY: 0, bezierstartZ: 0, bezierp1X: 0, bezierp1Y: 0, bezierp1Z: 90, bezierp2X: 0 , bezierp2Y: 90, bezierp2Z: 0, bezierendX: 90, bezierendY: 90, bezierendZ: 0, t: 0, translationlinear: true, translationbezier: false, beziervisivel: false, objeto: "", rotatepointx: true,rotatepointy: false,rotatepointz: false, raio:1, angulo: 0, rotacaoeixo: true, cameras: 1, lookat: false, lookatobjeto: "", animacoes: "", tempoanimacao: 0.1, animacaoobjeto: "", animacaotranslacao: 0, animacaorotacao:0, animacaoescala: 1, animacaoraio: 100, animacaobezier: 0, animarobjeto: true, animarcamera: false, animacaozoom: 60, animacaoacompanhar: false};
const loadGUI = () => {
  var camera = gui.addFolder('Câmeras'); //pasta da camera
  camera.add(config, "adicionarcamera").name("Adicionar Câmera"); //adiciona uma camera
  camera.add(config, "removercamera").name("Remover Câmera"); //remove uma camera
  controladorcomboboxcamera = camera.add(config, "cameras", contcamera).name("Câmera"); //lista com cameras disponiveis
  controladorzoomcamera = camera.add(config, "czoom", 0.1,179,0.1).name("Zoom"); //zoom da camera
  camera.add(config,"crotacaoeixo").name("Rotação no Eixo").listen().onChange(function(){if(config.crotacaoeixo==true){flagcamerapoint = 1; config.crotationpoint=false; config.ctranslationlinear=true;} else{config.crotationpoint=true;config.ctranslationlinear=false; config.ctranslationbezier=false;}}); //ativa rotação no eixo da camera
  var crotationeixo = camera.addFolder('Rotação no Eixo'); //pasta de rotação no eixo para camera
  controladorrotationcameraX = crotationeixo.add(config, "crotateX", 0, 360, 0.5).name("Rotação X"); //rotação no eixo da camera
  controladorrotationcameraY = crotationeixo.add(config, "crotateY", 0, 360, 0.5).name("Rotação Y");
  controladorrotationcameraZ = crotationeixo.add(config, "crotateZ", 0, 360, 0.5).name("Rotação Z");
  controladorrotationpointcamera = camera.add(config, "crotationpoint").name("Rotação no Ponto").listen().onChange(function(){ if(config.crotationpoint==true){config.lookat=false; config.ctranslationlinear=false; config.ctranslationbezier=false; config.crotacaoeixo=false;} else{flagcamerapoint = 1; config.ctranslationlinear=true; config.crotacaoeixo=true;}});
  var crotationpoint = camera.addFolder('Rotação no Ponto'); //pasta de rotação no ponto para camera
  crotationpoint.add(config, "crotationpointX").name("Rotação X").listen().onChange(function(){controladorrotationcameraX.setValue(listacamera[config.cameras-1].rotation[0]); controladorrotationcameraY.setValue(listacamera[config.cameras-1].rotation[1]); controladorrotationcameraZ.setValue(listacamera[config.cameras-1].rotation[2]); controladortranslatecameraX.setValue(listacamera[config.cameras-1].position[0]); controladortranslatecameraY.setValue(listacamera[config.cameras-1].position[1]); controladortranslatecameraZ.setValue(listacamera[config.cameras-1].position[2]); if(config.crotationpointX==true){config.crotationpointY=false; config.crotationpointZ=false;} else{config.crotationpointY=true;}}); //escolhe se rota em x
  crotationpoint.add(config, "crotationpointY").name("Rotação Y").listen().onChange(function(){controladorrotationcameraX.setValue(listacamera[config.cameras-1].rotation[0]); controladorrotationcameraY.setValue(listacamera[config.cameras-1].rotation[1]); controladorrotationcameraZ.setValue(listacamera[config.cameras-1].rotation[2]); controladortranslatecameraX.setValue(listacamera[config.cameras-1].position[0]); controladortranslatecameraY.setValue(listacamera[config.cameras-1].position[1]); controladortranslatecameraZ.setValue(listacamera[config.cameras-1].position[2]); if(config.crotationpointY==true){config.crotationpointX=false; config.crotationpointZ=false;} else{config.crotationpointX=true;}}) //escolhe se rota em y
  crotationpoint.add(config, "crotationpointZ").name("Rotação Z").listen().onChange(function(){controladorrotationcameraX.setValue(listacamera[config.cameras-1].rotation[0]); controladorrotationcameraY.setValue(listacamera[config.cameras-1].rotation[1]); controladorrotationcameraZ.setValue(listacamera[config.cameras-1].rotation[2]); controladortranslatecameraX.setValue(listacamera[config.cameras-1].position[0]); controladortranslatecameraY.setValue(listacamera[config.cameras-1].position[1]); controladortranslatecameraZ.setValue(listacamera[config.cameras-1].position[2]); if(config.crotationpointZ==true){config.crotationpointY=false; config.crotationpointX=false;} else{config.crotationpointX=true;}}) //escolhe se rota em z
  crotationpoint.add(config, "craio", 1, 200, 0.5).name("Raio");//raio da rotação
  crotationpoint.add(config, "cangulo", 0, 360, 0.5).name("Ângulo");//angulo da rotação
  controladortranslatelinearcamera = camera.add(config,"ctranslationlinear").name("Translação Linear").listen().onChange(function(){if(config.ctranslationlinear==true){if(config.crotationpoint== true){flagcamerapoint = 1;} config.ctranslationbezier=false; config.crotationpoint=false; config.crotacaoeixo=true} else{config.ctranslationbezier=true;}}); //escolhe translação linear
  var ctranslation = camera.addFolder('Translação Linear'); //pasta de translação no eixo para camera
  controladortranslatecameraX = ctranslation.add(config, "ctranslateX", -400, 400, 0.5).name("Translação X"); //translação linear da camera
  controladortranslatecameraY = ctranslation.add(config, "ctranslateY", -400, 400, 0.5).name("Translação Y"); 
  controladortranslatecameraZ = ctranslation.add(config, "ctranslateZ", -400, 400, 0.5).name("Translação Z");
  camera.add(config,"ctranslationbezier").name("Translação Bezier").listen().onChange(function(){if(config.ctranslationbezier==true){if(config.crotationpoint== true){flagcamerapoint = 1;} config.lookat=false; config.ctranslationlinear=false; config.crotationpoint=false;} else{config.ctranslationlinear=true;}}); //escolhe translação na curva de bezier
  var cbezier = camera.addFolder("Curva de Bezier"); //pasta da curva de bezier
  cbezier.add(config, "cbezierstartX", -400, 400, 0.5).name("Ponto Inicial X"); //ponto inicial da curva
  cbezier.add(config, "cbezierstartY", -400, 400, 0.5).name("Ponto Inicial Y");
  cbezier.add(config, "cbezierstartZ", -400, 400, 0.5).name("Ponto Inicial Z");
  cbezier.add(config, "cbezierp1X", -400, 400, 0.5).name("PC 1 X"); //ponto de controle 1 da curva
  cbezier.add(config, "cbezierp1Y", -200, 400, 0.5).name("PC 1 Y");
  cbezier.add(config, "cbezierp1Z", -400, 400, 0.5).name("PC 1 Z");
  cbezier.add(config, "cbezierp2X", -400, 400, 0.5).name("PC 2 X"); //ponto de controle 2 da curva
  cbezier.add(config, "cbezierp2Y", -400, 400, 0.5).name("PC 2 Y");
  cbezier.add(config, "cbezierp2Z", -400, 400, 0.5).name("PC 2 Z");
  cbezier.add(config, "cbezierendX", -400, 400, 0.5).name("Ponto Final X"); //ponto final da curva
  cbezier.add(config, "cbezierendY", -400, 400, 0.5).name("Ponto Final Y");
  cbezier.add(config, "cbezierendZ", -400, 400, 0.5).name("Ponto Final Z");
  cbezier.add(config, "ct", 0, 1, 0.01); //variavel t que define posição na curva;
  controladorlookat = camera.add(config, "lookat").name("Olhar para:").listen().onChange(function(){}); //ativa o look at
  controladorcomboboxlookat = camera.add(config, "lookatobjeto", objetosnome).name("Selecionar Objeto"); //seleciona o objeto q deseja acompanhar
  var obj = gui.addFolder("Objeto"); //pasta do objeto controlado
  obj.add(config,'adicionar').name('Adicionar Objetos'); //botão de adicionar
  controladorcombobox = obj.add(config,"objeto", objetosnome).name("Selecionar Objeto"); //combo box de escolha de objeto
  obj.add(config,'remover').name('Remover Objeto'); //remover objeto selecionado
  controladorscale = obj.add(config, "scale", 0.1, 10, 0.1).name("Escala"); //escalar objeto
  obj.add(config,"rotacaoeixo").name("Rotação no Eixo").listen().onChange(function(){if(config.rotacaoeixo==true){config.rotatepoint=false; config.translationlinear=true;} else{config.rotatepoint=true;config.translationlinear=false; config.translationbezier=false;}}); //escolhe rotação no eixo
  var rotacaoeixo = obj.addFolder("Rotação no Eixo"); //pasta da rotação no eixo
  controladorrotationX = rotacaoeixo.add(config, "rotateX", 0, 360, 0.5).name("Rotação X"); //rotação
  controladorrotationY = rotacaoeixo.add(config, "rotateY", 0, 360, 0.5).name("Rotação Y");
  controladorrotationZ = rotacaoeixo.add(config, "rotateZ", 0, 360, 0.5).name("Rotação Z");
  controladorrotationpoint = obj.add(config, "rotatepoint").name("Rotação no Ponto").listen().onChange(function(){if(config.rotatepoint==true){config.translationlinear=false; config.translationbezier=false; config.rotacaoeixo=false;} else{config.translationlinear=true; config.rotacaoeixo=true;}}); //escolhe se rota no ponto
  var rotacaoponto = obj.addFolder("Rotação no Ponto"); //pasta da rotação no ponto
  rotacaoponto.add(config, "rotatepointx").name("Rotação X").listen().onChange(function(){if(config.objeto!=""){controladorrotationX.setValue(lista[config.objeto.charAt(7)].rotation[0]); controladorrotationY.setValue(lista[config.objeto.charAt(7)].rotation[1]); controladorrotationZ.setValue(lista[config.objeto.charAt(7)].rotation[2]); controladortranslateX.setValue(lista[config.objeto.charAt(7)].position[0]); controladortranslateY.setValue(lista[config.objeto.charAt(7)].position[1]); controladortranslateZ.setValue(lista[config.objeto.charAt(7)].position[2]);} if(config.rotatepointx==true){config.rotatepointy=false; config.rotatepointz=false;} else{config.rotatepointy=true;}}); //escolhe se rota em x
  rotacaoponto.add(config, "rotatepointy").name("Rotação Y").listen().onChange(function(){if(config.objeto!=""){ controladorrotationX.setValue(lista[config.objeto.charAt(7)].rotation[0]); controladorrotationY.setValue(lista[config.objeto.charAt(7)].rotation[1]); controladorrotationZ.setValue(lista[config.objeto.charAt(7)].rotation[2]); controladortranslateX.setValue(lista[config.objeto.charAt(7)].position[0]); controladortranslateY.setValue(lista[config.objeto.charAt(7)].position[1]); controladortranslateZ.setValue(lista[config.objeto.charAt(7)].position[2]);} if(config.rotatepointy==true){config.rotatepointx=false; config.rotatepointz=false;} else{config.rotatepointx=true;}}) //escolhe se rota em y
  rotacaoponto.add(config, "rotatepointz").name("Rotação Z").listen().onChange(function(){if(config.objeto!=""){ controladorrotationX.setValue(lista[config.objeto.charAt(7)].rotation[0]); controladorrotationY.setValue(lista[config.objeto.charAt(7)].rotation[1]); controladorrotationZ.setValue(lista[config.objeto.charAt(7)].rotation[2]); controladortranslateX.setValue(lista[config.objeto.charAt(7)].position[0]); controladortranslateY.setValue(lista[config.objeto.charAt(7)].position[1]); controladortranslateZ.setValue(lista[config.objeto.charAt(7)].position[2]);} if(config.rotatepointz==true){config.rotatepointy=false; config.rotatepointx=false;} else{config.rotatepointx=true;}}) //escolhe se rota em z
  rotacaoponto.add(config, "raio", 1, 200, 0.5).name("Raio");//raio da rotação
  rotacaoponto.add(config, "angulo", 0, 360, 0.5).name("Ângulo");//angulo da rotação
  controladortranslatelinear = obj.add(config,"translationlinear").name("Translação Linear").listen().onChange(function(){if(config.translationlinear==true){config.translationbezier=false; config.rotatepoint=false; config.rotacaoeixo=true} else{config.translationbezier=true;}}); //escolhe translação linear
  var translate = obj.addFolder("Translação Linear"); //pasta translação linear
  controladortranslateX = translate.add(config, "translateX", -400, 400, 0.5).name("Translação X"); //translação linear
  controladortranslateY = translate.add(config, "translateY", -400, 400, 0.5).name("Translação Y"); 
  controladortranslateZ = translate.add(config, "translateZ", -400, 400, 0.5).name("Translação Z");
  obj.add(config,"translationbezier").name("Translação Bezier").listen().onChange(function(){if(config.translationbezier==true){config.translationlinear=false; config.rotatepoint=false;} else{config.translationlinear=true;}}); //escolhe translação na curva de bezier
  var bezier = obj.addFolder("Curva de Bezier"); //pasta da curva de bezier
  bezier.add(config, "beziervisivel").name("Visível"); //escolhe deixar a curva visivel
  bezier.add(config, "bezierstartX", -400, 400, 0.5).name("Ponto Inicial X"); //ponto inicial da curva
  bezier.add(config, "bezierstartY", -400, 400, 0.5).name("Ponto Inicial Y");
  bezier.add(config, "bezierstartZ", -400, 400, 0.5).name("Ponto Inicial Z");
  bezier.add(config, "bezierp1X", -400, 400, 0.5).name("PC 1 X"); //ponto de controle 1 da curva
  bezier.add(config, "bezierp1Y", -400, 400, 0.5).name("PC 1 Y");
  bezier.add(config, "bezierp1Z", -400, 400, 0.5).name("PC 1 Z");
  bezier.add(config, "bezierp2X", -400, 400, 0.5).name("PC 2 X"); //ponto de controle 2 da curva
  bezier.add(config, "bezierp2Y", -400, 400, 0.5).name("PC 2 Y");
  bezier.add(config, "bezierp2Z", -400, 400, 0.5).name("PC 2 Z");
  bezier.add(config, "bezierendX", -400, 400, 0.5).name("Ponto Final X"); //ponto final da curva
  bezier.add(config, "bezierendY", -400, 400, 0.5).name("Ponto Final Y");
  bezier.add(config, "bezierendZ", -400, 400, 0.5).name("Ponto Final Z");
  bezier.add(config, "t", 0, 1, 0.01); //variavel t que define posição na curva;
  var animacao = gui.addFolder('Animação'); //pasta da animação
  animacao.add(config, "animarcamera").name("Animar Câmera").listen().onChange(function(){if(config.animarcamera==true){config.animarobjeto=false;} else{config.animarobjeto=true;}});
  animacao.add(config, "animarobjeto").name("Animar Objeto").listen().onChange(function(){if(config.animarobjeto==true){config.animarcamera=false;} else{config.animarcamera=true;}});
  controladorcomboboxanimacao = animacao.add(config,"animacaoobjeto", objetosnome).name("Selecionar Objeto"); //combo box de escolha de objeto
  animacao.add(config, "animacoes", listaanimacoes).name("Animação"); //lista com cameras disponiveis
  animacao.add(config, "tempoanimacao", 0.1, 10, 0.1).name("Tempo"); //tempo 
  animacao.add(config, "adicionaranimacao").name("Adicionar Animação"); //adiciona uma animação a lista
  animacao.add(config, "comecaranimacao").name("Começar Animação"); //começa uma lista de animações
  animacao.add(config, "animacaotranslacao", -400, 400, 0.5).name("Translação Linear"); //translação na animação
  animacao.add(config, "animacaobezier",0, 1, 0.01).name("Translação Bezier"); //curva de bezier na animação
  animacao.add(config, "animacaorotacao",0, 360, 0.5).name("Rotação"); //rotação na animação
  animacao.add(config, "animacaoraio", 1, 200, 0.5).name("Raio");//raio da rotação no ponto na animação
  animacao.add(config, "animacaoescala", 0.1, 10, 0.1).name("Escalar");//zoom na animação
  animacao.add(config, "animacaozoom", -179,179,0.1).name("Zoom"); //zoom da animação
  controladoracompanhar = animacao.add(config, "animacaoacompanhar").name("Acompanhar").listen();
};
  
  loadGUI();

  function computeMatrix(viewProjectionMatrix, translation, xRotation, yRotation, zRotation, scale, name) { //atualiza matrix do objeto
    var x;
    var y;
    var z;
    var radius = config.raio;
    var matrix = m4.translate(
      viewProjectionMatrix,
      translation[0],
      translation[1],
      translation[2],
    );
    if(config.rotatepoint==true && config.objeto==name){ //se rota no ponto
            if(config.rotatepointx==true){
                y = Math.cos(degToRad(config.angulo)) * radius;
                z = Math.sin(degToRad(config.angulo)) * radius;
                matrix = m4.translate(
                  viewProjectionMatrix,
                   translation[0],
                   translation[1]+y,
                   translation[2]+z,
                );
                matrix = m4.xRotate(matrix, degToRad(config.angulo)+degToRad(xRotation));
                matrix = m4.yRotate(matrix, degToRad(yRotation));
                matrix = m4.zRotate(matrix, degToRad(zRotation));
                controladortranslateY.setValue(translation[1]+y); //atualiza os controladores
                controladortranslateZ.setValue(translation[2]+z);
                var temprotate = config.angulo+xRotation;
                if(temprotate>360){
                    temprotate = temprotate -360;
                }
                controladorrotationX.setValue(temprotate);
            }
            else if(config.rotatepointy==true){
                x = Math.sin(degToRad(config.angulo)) * radius;
                z = Math.cos(degToRad(config.angulo)) * radius;
                matrix = m4.translate(
                  viewProjectionMatrix,
                   translation[0]+x,
                   translation[1],
                   translation[2]+z,
                );
                matrix = m4.xRotate(matrix, degToRad(xRotation));
                matrix = m4.yRotate(matrix, degToRad(config.angulo)+degToRad(yRotation));
                matrix = m4.zRotate(matrix, degToRad(zRotation));
                controladortranslateX.setValue(translation[0]+x); //atualiza os controladores
                controladortranslateZ.setValue(translation[2]+z);
                var temprotate = config.angulo+yRotation;
                if(temprotate>360){
                    temprotate = temprotate -360;
                }
                controladorrotationY.setValue(temprotate);
            }
            else if(config.rotatepointz==true){
                x = Math.cos(degToRad(config.angulo)) * radius;
                y = Math.sin(degToRad(config.angulo)) * radius;
                matrix = m4.translate(
                  viewProjectionMatrix,
                   translation[0]+x,
                   translation[1]+y,
                   translation[2],
                );
                matrix = m4.xRotate(matrix, degToRad(xRotation));
                matrix = m4.yRotate(matrix, degToRad(yRotation));
                matrix = m4.zRotate(matrix, degToRad(config.angulo)+degToRad(zRotation));
                controladortranslateY.setValue(translation[1]+y); //atualiza os controladores
                controladortranslateX.setValue(translation[0]+x);
                var temprotate = config.angulo+zRotation;
                if(temprotate>360){
                    temprotate = temprotate -360;
                }
                controladorrotationZ.setValue(temprotate);
            }
    }
    else{ //se rota somente no eixo
        matrix = m4.xRotate(matrix, degToRad(xRotation));
        matrix = m4.yRotate(matrix, degToRad(yRotation));
        matrix = m4.zRotate(matrix, degToRad(zRotation));
    }
    matrix = m4.scale(matrix,scale,scale,scale);
    return matrix;
  }
    var objUniforms = { //cria matrix e informações para o desenho da curva de bezier
            u_colorMult: [0, 0, 0, 1],
            u_matrix: m4.identity(), 
            position: [config.bezierstartX,config.bezierstartY,config.bezierstartZ],
            rotation: [0,0,0],
            scale: 1,
            indice: 0,
            nome: "Curva de bezier",
          };
  lista.push(objUniforms);
    
  function bezierCurvePoint(t, A, B, C, D) { //calculo de posição na curva de bezier
      var s = 1 - t;
      var AB = [A[0]*s+ B[0]*t, A[1]*s+ B[1]*t, A[2]*s+ B[2]*t];
      var BC = [B[0]*s + C[0]*t, B[1]*s + C[1]*t, B[2]*s + C[2]*t];
      var CD = [C[0]*s + D[0]*t, C[1]*s + D[1]*t, C[2]*s + D[2]*t];
      var ABC = [AB[0]*s + BC[0]*t, AB[1]*s + BC[1]*t, AB[2]*s + BC[2]*t];
      var BCD = [BC[0]*s + CD[0]*t, BC[1]*s + CD[1]*t, BC[2]*s + CD[2]*t];
      return [ABC[0]*s + BCD[0]*t, ABC[1]*s + BCD[1]*t, ABC[2]*s + BCD[2]*t];
  }
  objBufferInfo = flattenedPrimitives.create3DFBufferInfo(gl);
  malhas.push(objBufferInfo);
  objBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 20);
  malhas.push(objBufferInfo);
  objBufferInfo = flattenedPrimitives.createPlaneBufferInfo(gl, 20,20);
  malhas.push(objBufferInfo);
  objBufferInfo = flattenedPrimitives.createSphereBufferInfo(gl, 20, 24, 12);
  malhas.push(objBufferInfo);
  objBufferInfo = flattenedPrimitives.createTruncatedConeBufferInfo(gl, 10, 0, 20, 24, 10);
  malhas.push(objBufferInfo);
  objBufferInfo = flattenedPrimitives.createCresentBufferInfo(gl, 20, 20, 0.5, 0.8, 24);
  malhas.push(objBufferInfo);
  objBufferInfo = flattenedPrimitives.createCylinderBufferInfo(gl, 10, 20, 20, 24);
  malhas.push(objBufferInfo);
  objBufferInfo = flattenedPrimitives.createDiscBufferInfo(gl, 10, 24);
  malhas.push(objBufferInfo);
  objBufferInfo = flattenedPrimitives.createTorusBufferInfo(gl, 30, 0.9, 24, 12);
  malhas.push(objBufferInfo);   
    
  function render(now) { //função renderização
    now *= 0.001;
    tempnow = now;
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    controladorcomboboxcamera.onChange(function () { //verifica se outro objeto foi escolhido
                        flagcamera=1;
                        controladorlookat.setValue(false);
                        controladorrotationpointcamera.setValue(false);
                  });
    if(flagcamera==1){ //atualiza os controladores na troca de camera
        controladortranslatecameraX.setValue(listacamera[config.cameras-1].position[0]);
        controladortranslatecameraY.setValue(listacamera[config.cameras-1].position[1]);
        controladortranslatecameraZ.setValue(listacamera[config.cameras-1].position[2]);
        controladorrotationcameraX.setValue(listacamera[config.cameras-1].rotation[0]);
        controladorrotationcameraY.setValue(listacamera[config.cameras-1].rotation[1]);
        controladorrotationcameraZ.setValue(listacamera[config.cameras-1].rotation[2]);
        controladorzoomcamera.setValue(listacamera[config.cameras-1].scale);
     }
    var fieldOfViewRadians = degToRad(config.czoom); //guarda o valor do zoom  
    if(flaganimação==1){ //começa uma animação
        var deltat = (now - then)/animacoesobjeto[0].tempo;
        if(deltat<1){ //faz animação
            if(animacoesobjeto[0].objeto != "camera"){ //se for objeto
                if(animacoesobjeto[0].animacao == "Translação Linear em X"){
                    lista[animacoesobjeto[0].objeto.charAt(7)].position[0] = animacoesobjeto[0].inicial[0] + animacoesobjeto[0].movimento * deltat; 
                }
                else if(animacoesobjeto[0].animacao == "Translação Linear em Y"){
                    lista[animacoesobjeto[0].objeto.charAt(7)].position[1] = animacoesobjeto[0].inicial[1] + animacoesobjeto[0].movimento * deltat; 
                }
                else if(animacoesobjeto[0].animacao == "Translação Linear em Z"){
                    lista[animacoesobjeto[0].objeto.charAt(7)].position[2] = animacoesobjeto[0].inicial[2] + animacoesobjeto[0].movimento * deltat; 
                }
                else if(animacoesobjeto[0].animacao == "Translação Bezier"){
                    var A = [config.bezierstartX,config.bezierstartY,config.bezierstartZ]; 
                    var B = [config.bezierp1X,config.bezierp1Y,config.bezierp1Z];
                    var C = [config.bezierp2X,config.bezierp2Y,config.bezierp2Z];
                    var D = [config.bezierendX, config.bezierendY, config.bezierendZ];
                    var tempt = animacoesobjeto[0].movimento * deltat;
                    var pontocb = bezierCurvePoint(tempt, A,B,C,D);
                    lista[animacoesobjeto[0].objeto.charAt(7)].position[0] = animacoesobjeto[0].inicial[0] + pontocb[0];
                    lista[animacoesobjeto[0].objeto.charAt(7)].position[1] = animacoesobjeto[0].inicial[1] + pontocb[1];
                    lista[animacoesobjeto[0].objeto.charAt(7)].position[2] = animacoesobjeto[0].inicial[2] + pontocb[2];
                }
                else if(animacoesobjeto[0].animacao == "Rotação no Eixo em X"){
                    lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0] = animacoesobjeto[0].inicial2[0] + animacoesobjeto[0].movimento * deltat;
                    if(lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0]>360){
                        lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0] = lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0] -360;
                    }
                }
                else if(animacoesobjeto[0].animacao == "Rotação no Eixo em Y"){
                    lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1] = animacoesobjeto[0].inicial2[1] + animacoesobjeto[0].movimento * deltat; 
                    if(lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1]>360){
                        lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1] = lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1] -360;
                    }
                }
                else if(animacoesobjeto[0].animacao == "Rotação no Eixo em Z"){
                    lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2] = animacoesobjeto[0].inicial2[2] + animacoesobjeto[0].movimento * deltat; 
                    if(lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2]>360){
                        lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2] = lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2] -360;
                    }
                }
                else if(animacoesobjeto[0].animacao == "Rotação no Ponto em X"){
                    var y;
                    var z;
                    y = Math.cos(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                    z = Math.sin(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                    lista[animacoesobjeto[0].objeto.charAt(7)].position[1] = animacoesobjeto[0].inicial[1] + y;
                    lista[animacoesobjeto[0].objeto.charAt(7)].position[2] = animacoesobjeto[0].inicial[2] + z;
                    lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0] = animacoesobjeto[0].inicial2[0] + animacoesobjeto[0].movimento * deltat;
                    if(lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0]>360){
                        lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0] = lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0] -360;
                    }
                }
                else if(animacoesobjeto[0].animacao == "Rotação no Ponto em Y"){
                    var x;
                    var z;
                    x = Math.sin(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                    z = Math.cos(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                    lista[animacoesobjeto[0].objeto.charAt(7)].position[0] = animacoesobjeto[0].inicial[0] + x;
                    lista[animacoesobjeto[0].objeto.charAt(7)].position[2] = animacoesobjeto[0].inicial[2] + z;
                    lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1] = animacoesobjeto[0].inicial2[1] + animacoesobjeto[0].movimento * deltat;
                    if(lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1]>360){
                        lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1] = lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1] -360;
                    }
                }
                else if(animacoesobjeto[0].animacao == "Rotação no Ponto em Z"){
                    var x;
                    var y;
                    x = Math.cos(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                    y = Math.sin(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                    lista[animacoesobjeto[0].objeto.charAt(7)].position[0] = animacoesobjeto[0].inicial[0] + x;
                    lista[animacoesobjeto[0].objeto.charAt(7)].position[1] = animacoesobjeto[0].inicial[1] + y;
                    lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2] = animacoesobjeto[0].inicial2[2] + animacoesobjeto[0].movimento * deltat;
                    if(lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2]>360){
                        lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2] = lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2] -360;
                    }
                }
                else if(animacoesobjeto[0].animacao == "Escalar Maior"){
                    lista[animacoesobjeto[0].objeto.charAt(7)].scale = animacoesobjeto[0].inicial[0] + animacoesobjeto[0].movimento * deltat; 
                }
                else if(animacoesobjeto[0].animacao == "Escalar Menor"){
                    if(animacoesobjeto[0].inicial[0] - animacoesobjeto[0].movimento * deltat>=0.1){
                        lista[animacoesobjeto[0].objeto.charAt(7)].scale = animacoesobjeto[0].inicial[0] - animacoesobjeto[0].movimento * deltat;     
                    }
                    else{
                        lista[animacoesobjeto[0].objeto.charAt(7)].scale = 0.1;    
                    }
                }
                if(config.animacaoacompanhar==true){ //caso a camera deva acompanhar o objeto
                    controladortranslatecameraX.setValue(lista[animacoesobjeto[0].objeto.charAt(7)].position[0]);
                    controladortranslatecameraY.setValue(lista[animacoesobjeto[0].objeto.charAt(7)].position[1]);
                    controladortranslatecameraZ.setValue(lista[animacoesobjeto[0].objeto.charAt(7)].position[2]);
                    listacamera[config.cameras-1].position = [lista[animacoesobjeto[0].objeto.charAt(7)].position[0], lista[animacoesobjeto[0].objeto.charAt(7)].position[1], lista[animacoesobjeto[0].objeto.charAt(7)].position[2]];
                    controladorrotationcameraX.setValue(0);
                    controladorrotationcameraY.setValue(0);
                    controladorrotationcameraZ.setValue(0);
                    listacamera[config.cameras-1].rotation = [0,0,0];
                }
            }
            else{
                if(animacoesobjeto[0].animacao == "Translação Linear em X"){
                    controladortranslatecameraX.setValue(animacoesobjeto[0].inicial[0] + animacoesobjeto[0].movimento * deltat);
                    listacamera[config.cameras-1].position[0] = animacoesobjeto[0].inicial[0] + animacoesobjeto[0].movimento * deltat; 
                }
                else if(animacoesobjeto[0].animacao == "Translação Linear em Y"){
                    controladortranslatecameraY.setValue(animacoesobjeto[0].inicial[1] + animacoesobjeto[0].movimento * deltat);
                    listacamera[config.cameras-1].position[1] = animacoesobjeto[0].inicial[1] + animacoesobjeto[0].movimento * deltat; 
                }
                else if(animacoesobjeto[0].animacao == "Translação Linear em Z"){
                    controladortranslatecameraZ.setValue(animacoesobjeto[0].inicial[2] + animacoesobjeto[0].movimento * deltat);
                    listacamera[config.cameras-1].position[2] = animacoesobjeto[0].inicial[2] + animacoesobjeto[0].movimento * deltat; 
                }
                else if(animacoesobjeto[0].animacao == "Translação Bezier"){
                    var A = [config.cbezierstartX,config.cbezierstartY,config.cbezierstartZ]; 
                    var B = [config.cbezierp1X,config.cbezierp1Y,config.cbezierp1Z];
                    var C = [config.cbezierp2X,config.cbezierp2Y,config.cbezierp2Z];
                    var D = [config.cbezierendX, config.cbezierendY, config.cbezierendZ];
                    var tempt = animacoesobjeto[0].movimento * deltat;
                    var pontocb = bezierCurvePoint(tempt, A,B,C,D);
                     controladortranslatecameraX.setValue(animacoesobjeto[0].inicial[0] + pontocb[0]);
                     controladortranslatecameraY.setValue(animacoesobjeto[0].inicial[1] + pontocb[1]);
                     controladortranslatecameraZ.setValue(animacoesobjeto[0].inicial[2] + pontocb[2]);
                     listacamera[config.cameras-1].position[0] = animacoesobjeto[0].inicial[0] + pontocb[0];
                     listacamera[config.cameras-1].position[1] = animacoesobjeto[0].inicial[1] + pontocb[1];
                     listacamera[config.cameras-1].position[2] = animacoesobjeto[0].inicial[2] + pontocb[2];
                }
                else if(animacoesobjeto[0].animacao == "Rotação no Eixo em X"){
                    listacamera[config.cameras-1].rotation[0] = animacoesobjeto[0].inicial2[0] + animacoesobjeto[0].movimento * deltat;
                    if(listacamera[config.cameras-1].rotation[0]>360){
                        listacamera[config.cameras-1].rotation[0] = listacamera[config.cameras-1].rotation[0] -360;
                    }
                    controladorrotationcameraX.setValue(listacamera[config.cameras-1].rotation[0]);
                }
                else if(animacoesobjeto[0].animacao == "Rotação no Eixo em Y"){
                    listacamera[config.cameras-1].rotation[1] = animacoesobjeto[0].inicial2[1] + animacoesobjeto[0].movimento * deltat; 
                    if( listacamera[config.cameras-1].rotation[1]>360){
                         listacamera[config.cameras-1].rotation[1] =  listacamera[config.cameras-1].rotation[1] -360;
                    }
                    controladorrotationcameraY.setValue(listacamera[config.cameras-1].rotation[1]);
                }
                else if(animacoesobjeto[0].animacao == "Rotação no Eixo em Z"){
                    listacamera[config.cameras-1].rotation[2] = animacoesobjeto[0].inicial2[2] + animacoesobjeto[0].movimento * deltat; 
                    if(listacamera[config.cameras-1].rotation[2]>360){
                        listacamera[config.cameras-1].rotation[2] = listacamera[config.cameras-1].rotation[2] -360;
                    }
                    controladorrotationcameraZ.setValue(listacamera[config.cameras-1].rotation[2]);
                }
                else if(animacoesobjeto[0].animacao == "Rotação no Ponto em X"){
                    var y;
                    var z;
                    var temprotation;
                    y = animacoesobjeto[0].inicial[1] + (Math.sin(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio);
                    z = (animacoesobjeto[0].inicial[2]-100) + (Math.cos(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio);
                    temprotation = animacoesobjeto[0].inicial2[0] + animacoesobjeto[0].movimento * deltat;
                    if(temprotation>360){
                        temprotation = temprotation -360;
                    }
                    controladorrotationcameraX.setValue(temprotation);
                    controladortranslatecameraY.setValue(y);
                    controladortranslatecameraZ.setValue(z);
                }
                else if(animacoesobjeto[0].animacao == "Rotação no Ponto em Y"){
                    var x;
                    var z;
                    var temprotation;
                    x = animacoesobjeto[0].inicial[0] + (Math.sin(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio);
                    z = (animacoesobjeto[0].inicial[2]-100) + (Math.cos(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio);
                    temprotation = animacoesobjeto[0].inicial2[1] + animacoesobjeto[0].movimento * deltat;
                    if(temprotation>360){
                        temprotation = temprotation -360;
                    }
                    controladorrotationcameraY.setValue(temprotation);
                    controladortranslatecameraX.setValue(x);
                    controladortranslatecameraZ.setValue(z);
                }
                else if(animacoesobjeto[0].animacao == "Rotação no Ponto em Z"){
                    var x;
                    var y;
                    var temprotation;
                    x = animacoesobjeto[0].inicial[0] + (Math.sin(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio);
                    y = (animacoesobjeto[0].inicial[1]) + (Math.cos(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio);
                    temprotation = animacoesobjeto[0].inicial2[2] + animacoesobjeto[0].movimento * deltat;
                    if(temprotation>360){
                        temprotation = temprotation -360;
                    }
                    controladorrotationcameraZ.setValue(temprotation);
                    controladortranslatecameraX.setValue(x);
                    controladortranslatecameraY.setValue(y);
                }
                else if(animacoesobjeto[0].animacao == "Zoom"){
                    if(animacoesobjeto[0].inicial[0] + (animacoesobjeto[0].movimento * deltat) >=0.1 && animacoesobjeto[0].inicial[0] + (animacoesobjeto[0].movimento * deltat) <=179){
                            fieldOfViewRadians = degToRad(animacoesobjeto[0].inicial[0] + (animacoesobjeto[0].movimento * deltat));
                            controladorzoomcamera.setValue(animacoesobjeto[0].inicial[0] + (animacoesobjeto[0].movimento * deltat));
                        }
                }
            }
        }
        else{
            if(animacoesobjeto[0].animacao=="Rotação no Ponto em X" && animacoesobjeto[0].objeto=="camera"){
                var y;
                var z;
                y = Math.sin(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                z = Math.cos(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                listacamera[config.cameras-1].position[1] = animacoesobjeto[0].inicial[1] + y;
                listacamera[config.cameras-1].position[2] = (animacoesobjeto[0].inicial[2]-100) + z;
                listacamera[config.cameras-1].rotation[0] = animacoesobjeto[0].inicial2[0] + animacoesobjeto[0].movimento * deltat;
                if(listacamera[config.cameras-1].rotation[0]>360){
                    listacamera[config.cameras-1].rotation[0] = listacamera[config.cameras-1].rotation[0] -360;
                }
                listacamera[config.cameras-1].rotation[0] = 360 - listacamera[config.cameras-1].rotation[0]
                controladorrotationcameraX.setValue(listacamera[config.cameras-1].rotation[0]);
            }
            else if(animacoesobjeto[0].animacao=="Rotação no Ponto em Y" && animacoesobjeto[0].objeto=="camera"){
                var x;
                var z;
                x = Math.sin(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                z = Math.cos(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                listacamera[config.cameras-1].position[0] = animacoesobjeto[0].inicial[0] + x;
                listacamera[config.cameras-1].position[2] = (animacoesobjeto[0].inicial[2]-100) + z;
                listacamera[config.cameras-1].rotation[1] = animacoesobjeto[0].inicial2[1] + animacoesobjeto[0].movimento * deltat;
                if(listacamera[config.cameras-1].rotation[1]>360){
                    listacamera[config.cameras-1].rotation[1] = listacamera[config.cameras-1].rotation[1] -360;
                }
            }
            else if(animacoesobjeto[0].animacao=="Rotação no Ponto em Z" && animacoesobjeto[0].objeto=="camera"){
                var x;
                var y;
                x = Math.sin(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                y = Math.cos(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                listacamera[config.cameras-1].position[0] = animacoesobjeto[0].inicial[0] + x;
                listacamera[config.cameras-1].position[1] = (animacoesobjeto[0].inicial[1]) + y;
                listacamera[config.cameras-1].rotation[2] = animacoesobjeto[0].inicial2[2] + animacoesobjeto[0].movimento * deltat;
                if(listacamera[config.cameras-1].rotation[2]>360){
                    listacamera[config.cameras-1].rotation[2] = listacamera[config.cameras-1].rotation[2] -360;
                }
                listacamera[config.cameras-1].rotation[2] = 360 - listacamera[config.cameras-1].rotation[2]
                controladorrotationcameraZ.setValue(listacamera[config.cameras-1].rotation[2]);
            }
            animacoesobjeto.splice(0,1);
            then = now;
            if(animacoesobjeto.length>0){ //caso haja um próxima animação
                if(animacoesobjeto[0].objeto != "camera"){ //se for objeto
                    if(animacoesobjeto[0].animacao != "Translação Bezier" && animacoesobjeto[0].animacao != "Escalar Maior" && animacoesobjeto[0].animacao != "Escalar Menor"){
                        animacoesobjeto[0].inicial[0] = lista[animacoesobjeto[0].objeto.charAt(7)].position[0];
                        animacoesobjeto[0].inicial[1] = lista[animacoesobjeto[0].objeto.charAt(7)].position[1];
                        animacoesobjeto[0].inicial[2] = lista[animacoesobjeto[0].objeto.charAt(7)].position[2]; 
                        animacoesobjeto[0].inicial2[0] = lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0];
                        animacoesobjeto[0].inicial2[1] = lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1];
                        animacoesobjeto[0].inicial2[2] = lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2];
                    }
                    else if(animacoesobjeto[0].animacao == "Escalar Maior" || animacoesobjeto[0].animacao == "Escalar Menor"){
                        animacoesobjeto[0].inicial[0] = lista[animacoesobjeto[0].objeto.charAt(7)].scale;
                        animacoesobjeto[0].inicial[1] = lista[animacoesobjeto[0].objeto.charAt(7)].scale;
                        animacoesobjeto[0].inicial[2] = lista[animacoesobjeto[0].objeto.charAt(7)].scale; 
                    }
                    deltat = deltat - 1;
                    deltat = deltat/animacoesobjeto[0].tempo;
                    if(animacoesobjeto[0].animacao == "Translação Linear em X"){
                        lista[animacoesobjeto[0].objeto.charAt(7)].position[0] = animacoesobjeto[0].inicial[0] + animacoesobjeto[0].movimento * deltat;     
                    }
                    else if(animacoesobjeto[0].animacao == "Translação Linear em Y"){
                        lista[animacoesobjeto[0].objeto.charAt(7)].position[1] = animacoesobjeto[0].inicial[1] + animacoesobjeto[0].movimento * deltat;     
                    }
                    else if(animacoesobjeto[0].animacao == "Translação Linear em Z"){
                        lista[animacoesobjeto[0].objeto.charAt(7)].position[2] = animacoesobjeto[0].inicial[2] + animacoesobjeto[0].movimento * deltat;     
                    }
                    else if(animacoesobjeto[0].animacao == "Translação Bezier"){
                        var A = [config.bezierstartX,config.bezierstartY,config.bezierstartZ]; 
                        var B = [config.bezierp1X,config.bezierp1Y,config.bezierp1Z];
                        var C = [config.bezierp2X,config.bezierp2Y,config.bezierp2Z];
                        var D = [config.bezierendX, config.bezierendY, config.bezierendZ];
                        var tempt = animacoesobjeto[0].movimento * deltat;
                        var pontocb = bezierCurvePoint(tempt, A,B,C,D);
                        lista[animacoesobjeto[0].objeto.charAt(7)].position[0] = animacoesobjeto[0].inicial[0] + pontocb[0];
                        lista[animacoesobjeto[0].objeto.charAt(7)].position[1] = animacoesobjeto[0].inicial[1] + pontocb[1];
                        lista[animacoesobjeto[0].objeto.charAt(7)].position[2] = animacoesobjeto[0].inicial[2] + pontocb[2]; 
                    }
                    else if(animacoesobjeto[0].animacao == "Rotação no Eixo em X"){
                        lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0] = animacoesobjeto[0].inicial2[0] + animacoesobjeto[0].movimento * deltat; 
                        if(lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0]>360){
                            lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0] = lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0] -360;
                        }
                }
                    else if(animacoesobjeto[0].animacao == "Rotação no Eixo em Y"){
                        lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1] = animacoesobjeto[0].inicial2[1] + animacoesobjeto[0].movimento * deltat; 
                        if(lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1]>360){
                            lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1] = lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1] -360;
                        }
                    }
                    else if(animacoesobjeto[0].animacao == "Rotação no Eixo em Z"){
                        lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2] = animacoesobjeto[0].inicial2[2] + animacoesobjeto[0].movimento * deltat; 
                        if(lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2]>360){
                            lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2] = lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2] -360;
                        }
                    }
                    else if(animacoesobjeto[0].animacao == "Rotação no Ponto em X"){
                        var y;
                        var z;
                        y = Math.cos(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                        z = Math.sin(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                        lista[animacoesobjeto[0].objeto.charAt(7)].position[1] = animacoesobjeto[0].inicial[1] + y;
                        lista[animacoesobjeto[0].objeto.charAt(7)].position[2] = animacoesobjeto[0].inicial[2] + z;
                        lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0] = animacoesobjeto[0].inicial2[0] + animacoesobjeto[0].movimento * deltat;
                        if(lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0]>360){
                            lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0] = lista[animacoesobjeto[0].objeto.charAt(7)].rotation[0] -360;
                        }
                    }
                    else if(animacoesobjeto[0].animacao == "Rotação no Ponto em Y"){
                        var x;
                        var z;
                        x = Math.sin(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                        z = Math.cos(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                        lista[animacoesobjeto[0].objeto.charAt(7)].position[0] = animacoesobjeto[0].inicial[0] + x;
                        lista[animacoesobjeto[0].objeto.charAt(7)].position[2] = animacoesobjeto[0].inicial[2] + z;
                        lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1] = animacoesobjeto[0].inicial2[1] + animacoesobjeto[0].movimento * deltat;
                        if(lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1]>360){
                            lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1] = lista[animacoesobjeto[0].objeto.charAt(7)].rotation[1] -360;
                        }
                    }
                    else if(animacoesobjeto[0].animacao == "Rotação no Ponto em Z"){
                        var x;
                        var y;
                        x = Math.cos(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                        y = Math.sin(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio;
                        lista[animacoesobjeto[0].objeto.charAt(7)].position[0] = animacoesobjeto[0].inicial[0] + x;
                        lista[animacoesobjeto[0].objeto.charAt(7)].position[1] = animacoesobjeto[0].inicial[1] + y;
                        lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2] = animacoesobjeto[0].inicial2[2] + animacoesobjeto[0].movimento * deltat;
                        if(lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2]>360){
                            lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2] = lista[animacoesobjeto[0].objeto.charAt(7)].rotation[2] -360;
                        }
                    }
                    else if(animacoesobjeto[0].animacao == "Escalar Maior"){
                        lista[animacoesobjeto[0].objeto.charAt(7)].scale = animacoesobjeto[0].inicial[0] + animacoesobjeto[0].movimento * deltat; 
                    }
                    else if(animacoesobjeto[0].animacao == "Escalar Menor"){
                        if(animacoesobjeto[0].inicial[0] - animacoesobjeto[0].movimento * deltat>=0.1){
                            lista[animacoesobjeto[0].objeto.charAt(7)].scale = animacoesobjeto[0].inicial[0] - animacoesobjeto[0].movimento * deltat;     
                        }
                        else{
                            lista[animacoesobjeto[0].objeto.charAt(7)].scale = 0.1;    
                        }
                    }
                    if(config.animacaoacompanhar==true){ //caso a camera deva acompanhar o objeto
                        controladortranslatecameraX.setValue(lista[animacoesobjeto[0].objeto.charAt(7)].position[0]);
                        controladortranslatecameraY.setValue(lista[animacoesobjeto[0].objeto.charAt(7)].position[1]);
                        controladortranslatecameraZ.setValue(lista[animacoesobjeto[0].objeto.charAt(7)].position[2]);
                        listacamera[config.cameras-1].position = [lista[animacoesobjeto[0].objeto.charAt(7)].position[0], lista[animacoesobjeto[0].objeto.charAt(7)].position[1], lista[animacoesobjeto[0].objeto.charAt(7)].position[2]];
                        controladorrotationcameraX.setValue(0);
                        controladorrotationcameraY.setValue(0);
                        controladorrotationcameraZ.setValue(0);
                        listacamera[config.cameras-1].rotation = [0,0,0];
                    }
                }
                else{
                    if(animacoesobjeto[0].animacao != "Translação Bezier" && animacoesobjeto[0].animacao != "Zoom"){
                        animacoesobjeto[0].inicial[0] = listacamera[config.cameras-1].position[0];
                        animacoesobjeto[0].inicial[1] = listacamera[config.cameras-1].position[1];
                        animacoesobjeto[0].inicial[2] = listacamera[config.cameras-1].position[2]; 
                        animacoesobjeto[0].inicial2[0] = listacamera[config.cameras-1].rotation[0];
                        animacoesobjeto[0].inicial2[1] = listacamera[config.cameras-1].rotation[1];
                        animacoesobjeto[0].inicial2[2] = listacamera[config.cameras-1].rotation[2];
                    }
                    else if(animacoesobjeto[0].animacao == "Zoom"){
                        animacoesobjeto[0].inicial[0] = listacamera[config.cameras-1].scale;
                        animacoesobjeto[0].inicial[1] = listacamera[config.cameras-1].scale;
                        animacoesobjeto[0].inicial[2] = listacamera[config.cameras-1].scale; 
                    }
                    deltat = deltat - 1;
                    deltat = deltat/animacoesobjeto[0].tempo;
                    if(animacoesobjeto[0].animacao == "Translação Linear em X"){
                    controladortranslatecameraX.setValue(animacoesobjeto[0].inicial[0] + animacoesobjeto[0].movimento * deltat);
                    listacamera[config.cameras-1].position[0] = animacoesobjeto[0].inicial[0] + animacoesobjeto[0].movimento * deltat; 
                    }
                    else if(animacoesobjeto[0].animacao == "Translação Linear em Y"){
                        controladortranslatecameraY.setValue(animacoesobjeto[0].inicial[1] + animacoesobjeto[0].movimento * deltat);
                        listacamera[config.cameras-1].position[1] = animacoesobjeto[0].inicial[1] + animacoesobjeto[0].movimento * deltat; 
                    }
                    else if(animacoesobjeto[0].animacao == "Translação Linear em Z"){
                        controladortranslatecameraZ.setValue(animacoesobjeto[0].inicial[2] + animacoesobjeto[0].movimento * deltat);
                        listacamera[config.cameras-1].position[2] = animacoesobjeto[0].inicial[2] + animacoesobjeto[0].movimento * deltat; 
                    }
                    else if(animacoesobjeto[0].animacao == "Translação Bezier"){
                        var A = [config.cbezierstartX,config.cbezierstartY,config.cbezierstartZ]; 
                        var B = [config.cbezierp1X,config.cbezierp1Y,config.cbezierp1Z];
                        var C = [config.cbezierp2X,config.cbezierp2Y,config.cbezierp2Z];
                        var D = [config.cbezierendX, config.cbezierendY, config.cbezierendZ];
                        var tempt = animacoesobjeto[0].movimento * deltat;
                        var pontocb = bezierCurvePoint(tempt, A,B,C,D);
                         controladortranslatecameraX.setValue(animacoesobjeto[0].inicial[0] + pontocb[0]);
                         controladortranslatecameraY.setValue(animacoesobjeto[0].inicial[1] + pontocb[1]);
                         controladortranslatecameraZ.setValue(animacoesobjeto[0].inicial[2] + pontocb[2]);
                         listacamera[config.cameras-1].position[0] = animacoesobjeto[0].inicial[0] + pontocb[0];
                         listacamera[config.cameras-1].position[1] = animacoesobjeto[0].inicial[1] + pontocb[1];
                         listacamera[config.cameras-1].position[2] = animacoesobjeto[0].inicial[2] + pontocb[2]; 
                    }
                    else if(animacoesobjeto[0].animacao == "Rotação no Eixo em X"){
                        listacamera[config.cameras-1].rotation[0] = animacoesobjeto[0].inicial2[0] + animacoesobjeto[0].movimento * deltat;
                        if(listacamera[config.cameras-1].rotation[0]>360){
                            listacamera[config.cameras-1].rotation[0] = listacamera[config.cameras-1].rotation[0] -360;
                        }
                        controladorrotationcameraX.setValue(listacamera[config.cameras-1].rotation[0]);
                    }
                    else if(animacoesobjeto[0].animacao == "Rotação no Eixo em Y"){
                        listacamera[config.cameras-1].rotation[1] = animacoesobjeto[0].inicial2[1] + animacoesobjeto[0].movimento * deltat; 
                        if( listacamera[config.cameras-1].rotation[1]>360){
                             listacamera[config.cameras-1].rotation[1] =  listacamera[config.cameras-1].rotation[1] -360;
                        }
                        controladorrotationcameraY.setValue(listacamera[config.cameras-1].rotation[1]);
                    }
                    else if(animacoesobjeto[0].animacao == "Rotação no Eixo em Z"){
                        listacamera[config.cameras-1].rotation[2] = animacoesobjeto[0].inicial2[2] + animacoesobjeto[0].movimento * deltat; 
                        if(listacamera[config.cameras-1].rotation[2]>360){
                            listacamera[config.cameras-1].rotation[2] = listacamera[config.cameras-1].rotation[2] -360;
                        }
                        controladorrotationcameraZ.setValue(listacamera[config.cameras-1].rotation[2]);
                    }
                    else if(animacoesobjeto[0].animacao == "Rotação no Ponto em X"){
                        var y;
                        var z;
                        var temprotation;
                        y = animacoesobjeto[0].inicial[1] + (Math.sin(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio);
                        z = (animacoesobjeto[0].inicial[2]-100) + (Math.cos(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio);
                        temprotation = animacoesobjeto[0].inicial2[0] + animacoesobjeto[0].movimento * deltat;
                        if(temprotation>360){
                            temprotation = temprotation -360;
                        }
                        controladorrotationcameraX.setValue(temprotation);
                        controladortranslatecameraY.setValue(y);
                        controladortranslatecameraZ.setValue(z);
                    }
                    else if(animacoesobjeto[0].animacao == "Rotação no Ponto em Y"){
                        var x;
                        var z;
                        var temprotation;
                        x = animacoesobjeto[0].inicial[0] + (Math.sin(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio);
                        z = (animacoesobjeto[0].inicial[2]-100) + (Math.cos(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio);
                        temprotation = animacoesobjeto[0].inicial2[1] + animacoesobjeto[0].movimento * deltat;
                        if(temprotation>360){
                            temprotation = temprotation -360;
                        }
                        controladorrotationcameraY.setValue(temprotation);
                        controladortranslatecameraX.setValue(x);
                        controladortranslatecameraZ.setValue(z);
                    }
                    else if(animacoesobjeto[0].animacao == "Rotação no Ponto em Z"){
                        var x;
                        var y;
                        var temprotation;
                        x = animacoesobjeto[0].inicial[0] + (Math.sin(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio);
                        y = (animacoesobjeto[0].inicial[1]) + (Math.cos(degToRad(animacoesobjeto[0].movimento * deltat)) * animacoesobjeto[0].raio);
                        temprotation = animacoesobjeto[0].inicial2[2] + animacoesobjeto[0].movimento * deltat;
                        if(temprotation>360){
                            temprotation = temprotation -360;
                        }
                        controladorrotationcameraZ.setValue(temprotation);
                        controladortranslatecameraX.setValue(x);
                        controladortranslatecameraY.setValue(y);
                    }
                    else if(animacoesobjeto[0].animacao == "Zoom"){
                        if(animacoesobjeto[0].inicial[0] + (animacoesobjeto[0].movimento * deltat) >=0.1 && animacoesobjeto[0].inicial[0] + (animacoesobjeto[0].movimento * deltat) <=179){
                            fieldOfViewRadians = degToRad(animacoesobjeto[0].inicial[0] + (animacoesobjeto[0].movimento * deltat));
                            controladorzoomcamera.setValue(animacoesobjeto[0].inicial[0] + (animacoesobjeto[0].movimento * deltat));
                        }
                    }
                }
            }
        }
        if(animacoesobjeto.length==0){ //finaliza animação
            flaganimação=0;
        }
    }
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);
    listacamera[config.cameras-1].scale = config.czoom;
    // Compute the camera's matrix using look at.
    var cameraPosition = [0, 0, 100];   
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
    if(flagcamerapoint == 1){
        if(config.crotationpoint==false){ //salva as informações camera depois que a rotação no ponto é concluida
            if(config.crotationpointX==true){
                var y = listacamera[config.cameras-1].position[1] + (Math.cos(degToRad(config.cangulo)) * (config.craio));
                var z = listacamera[config.cameras-1].position[2] + (Math.sin(degToRad(config.cangulo)) * (config.craio));
                listacamera[config.cameras-1].position[1] = y;//guarda infos de translação da camera/
                listacamera[config.cameras-1].position[2] = z;
                var temprotate = config.cangulo+listacamera[config.cameras-1].rotation[0];
                if(temprotate>360){
                    temprotate = temprotate -360;
                }
                listacamera[config.cameras-1].rotation[0] = temprotate; 
            }
            if(config.crotationpointY==true){
                var x = listacamera[config.cameras-1].position[0] + (Math.sin(degToRad(config.cangulo)) * (config.craio));
                var z = listacamera[config.cameras-1].position[2] + (Math.cos(degToRad(config.cangulo)) * (config.craio));
                listacamera[config.cameras-1].position[0] = x;//guarda infos de translação da camera/
                listacamera[config.cameras-1].position[2] = z;
                var temprotate = config.cangulo+listacamera[config.cameras-1].rotation[1];
                if(temprotate>360){
                    temprotate = temprotate -360;
                }
                listacamera[config.cameras-1].rotation[1] = temprotate; 
            }
            if(config.crotationpointZ==true){
                var x = listacamera[config.cameras-1].position[0] + (Math.cos(degToRad(config.cangulo)) * (config.craio));
                var y = listacamera[config.cameras-1].position[1] + (Math.sin(degToRad(config.cangulo)) * (config.craio));
                listacamera[config.cameras-1].position[0] = x;//guarda infos de translação da camera/
                listacamera[config.cameras-1].position[1] = y;
                var temprotate = config.cangulo+listacamera[config.cameras-1].rotation[2];
                if(temprotate>360){
                    temprotate = temprotate -360;
                }
                listacamera[config.cameras-1].rotation[2] = temprotate; 
            }
        }
    }
    if(config.crotationpoint==true){ //rota a camera em torno de um ponto
        if(config.crotationpointX==true){
            var x = listacamera[config.cameras-1].position[0];
            var y = listacamera[config.cameras-1].position[1] + (Math.sin(degToRad(config.cangulo)) * (config.craio));
            var z = (listacamera[config.cameras-1].position[2]-100) + (Math.cos(degToRad(config.cangulo)) * (config.craio));
            cameraMatrix = m4.translate(cameraMatrix,x, y, z);
            cameraMatrix = m4.xRotate(cameraMatrix, degToRad((-1)*listacamera[config.cameras-1].rotation[0])+degToRad((-1)*config.cangulo));
            cameraMatrix = m4.yRotate(cameraMatrix, degToRad(listacamera[config.cameras-1].rotation[1]));
            cameraMatrix = m4.zRotate(cameraMatrix, degToRad(listacamera[config.cameras-1].rotation[2])); 
            controladortranslatecameraY.setValue(y);
            controladortranslatecameraZ.setValue(z);
            var temprotate = config.cangulo+listacamera[config.cameras-1].rotation[0];
            if(temprotate>360){
                temprotate = temprotate -360;
            }
            controladorrotationcameraX.setValue(temprotate);
        }
        if(config.crotationpointY==true){
            var x = listacamera[config.cameras-1].position[0] + (Math.sin(degToRad(config.cangulo)) * (config.craio));
            var y = listacamera[config.cameras-1].position[1];
            var z = (listacamera[config.cameras-1].position[2]-100) + (Math.cos(degToRad(config.cangulo)) * (config.craio));
            cameraMatrix = m4.translate(cameraMatrix, x, y, z);
            cameraMatrix = m4.xRotate(cameraMatrix, degToRad(listacamera[config.cameras-1].rotation[0]));
            cameraMatrix = m4.yRotate(cameraMatrix, degToRad(listacamera[config.cameras-1].rotation[1])+degToRad(config.cangulo));
            cameraMatrix = m4.zRotate(cameraMatrix, degToRad(listacamera[config.cameras-1].rotation[2])); 
            controladortranslatecameraX.setValue(x);
            controladortranslatecameraZ.setValue(z);
            var temprotate = config.cangulo+listacamera[config.cameras-1].rotation[1];
            if(temprotate>360){
                temprotate = temprotate -360;
            }
            controladorrotationcameraY.setValue(temprotate);
        }
        if(config.crotationpointZ==true){
            var x = listacamera[config.cameras-1].position[0] + (Math.cos(degToRad(config.cangulo)) * (config.craio));
            var y = listacamera[config.cameras-1].position[1] + (Math.sin(degToRad(config.cangulo)) * (config.craio));
            var z = listacamera[config.cameras-1].position[2];
            cameraMatrix = m4.translate(cameraMatrix,x, y, z);
            cameraMatrix = m4.xRotate(cameraMatrix, degToRad(listacamera[config.cameras-1].rotation[0]));
            cameraMatrix = m4.yRotate(cameraMatrix, degToRad(listacamera[config.cameras-1].rotation[1]));
            cameraMatrix = m4.zRotate(cameraMatrix, degToRad(listacamera[config.cameras-1].rotation[2])+degToRad(config.cangulo)); 
            controladortranslatecameraX.setValue(x);
            controladortranslatecameraY.setValue(y);
            var temprotate = config.cangulo+listacamera[config.cameras-1].rotation[2];
            if(temprotate>360){
                temprotate = temprotate -360;
            }
            controladorrotationcameraZ.setValue(temprotate);
        }
    }
    else{
        if(config.ctranslationbezier == true){
            var A = [config.cbezierstartX,config.cbezierstartY,config.cbezierstartZ]; 
            var B = [config.cbezierp1X,config.cbezierp1Y,config.cbezierp1Z];
            var C = [config.cbezierp2X,config.cbezierp2Y,config.cbezierp2Z];
            var D = [config.cbezierendX, config.cbezierendY, config.cbezierendZ];
            var pontocb = bezierCurvePoint(config.ct, A,B,C,D);
            cameraMatrix = m4.translate(cameraMatrix,(config.bezierstartX+pontocb[0]),(config.bezierstartY+pontocb[1]), (config.bezierstartZ+pontocb[2]));
            controladortranslatecameraX.setValue(config.bezierstartX+pontocb[0]);
            controladortranslatecameraY.setValue(config.bezierstartY+pontocb[1]);
            controladortranslatecameraZ.setValue(config.bezierstartZ+pontocb[2]);
        }
        else{
            cameraMatrix = m4.translate(cameraMatrix, config.ctranslateX, config.ctranslateY, config.ctranslateZ);       
        }
        if(flaganimação==1 && (animacoesobjeto[0].animacao=="Rotação no Ponto em X" || animacoesobjeto[0].animacao=="Rotação no Ponto em Z")){
            cameraMatrix = m4.xRotate(cameraMatrix, degToRad((-1)*config.crotateX));
            cameraMatrix = m4.yRotate(cameraMatrix, degToRad((-1)*config.crotateY));
            cameraMatrix = m4.zRotate(cameraMatrix, degToRad((-1)*config.crotateZ));
        }
        else{
            cameraMatrix = m4.xRotate(cameraMatrix, degToRad(config.crotateX));
            cameraMatrix = m4.yRotate(cameraMatrix, degToRad(config.crotateY));
            cameraMatrix = m4.zRotate(cameraMatrix, degToRad(config.crotateZ));     
        }
        listacamera[config.cameras-1].position[0] = config.ctranslateX; //guarda infos de translação da camera
        listacamera[config.cameras-1].position[1] = config.ctranslateY;
        listacamera[config.cameras-1].position[2] = config.ctranslateZ;
        listacamera[config.cameras-1].rotation[0] = config.crotateX;
        listacamera[config.cameras-1].rotation[1] = config.crotateY;
        listacamera[config.cameras-1].rotation[2] = config.crotateZ;  
    }
    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    gl.useProgram(meshProgramInfo.program);

    // ------ Draw the object --------
  
        
    // Setup all the needed attributes.
      var buffervoid = gl.createBuffer();
      for(var i=0; i < lista.length-1; i++){
          if(config.beziervisivel==true){ //Desenha a curva se a opção for selecionada
                    var A = [config.bezierstartX,config.bezierstartY,config.bezierstartZ];
                    var B = [config.bezierp1X,config.bezierp1Y,config.bezierp1Z];
                    var C = [config.bezierp2X,config.bezierp2Y,config.bezierp2Z];
                    var D = [config.bezierendX, config.bezierendY, config.bezierendZ];
                    var curva = [];
                    var cor = []; 
                    for (var j=0; j<1; j=j+0.01){  //calcula os pontos da curva
                        var ponto = bezierCurvePoint(j,A,B,C,D);
                        curva.push(ponto[0]);
                        curva.push(ponto[1]);
                        curva.push(ponto[2]);
                        cor.push(1);
                        cor.push(1);
                        cor.push(1);
                        cor.push(1);
                    }
                  let  arrays = {position: curva, color: cor}; //posição e cor da curva
                  var objBufferInfo = twgl.createBufferInfoFromArrays(gl,arrays); //cria buffer da curva
                  var objVAO = twgl.createVAOFromBufferInfo(
                    gl,
                    meshProgramInfo,
                    objBufferInfo,
                  );
                  gl.bindVertexArray(objVAO);
                  lista[0].u_matrix = computeMatrix(
                  viewProjectionMatrix,
                  [config.bezierstartX,config.bezierstartY,config.bezierstartZ],
                  0,
                  0,
                  0,
                  1,
                  );
            // Set the uniforms we just computed
            twgl.setUniforms(meshProgramInfo, lista[0]);
            twgl.drawBufferInfo(gl, objBufferInfo, gl.LINE_STRIP);
          }
              var objVAO = twgl.createVAOFromBufferInfo(
                gl,
                meshProgramInfo,
                malhas[lista[i+1].indice],
                  );
              var A = [config.bezierstartX,config.bezierstartY,config.bezierstartZ]; 
              var B = [config.bezierp1X,config.bezierp1Y,config.bezierp1Z];
              var C = [config.bezierp2X,config.bezierp2Y,config.bezierp2Z];
              var D = [config.bezierendX, config.bezierendY, config.bezierendZ];
              var pontocb = bezierCurvePoint(config.t, A,B,C,D); //calcula ponto do objeto na curva de bezier
              gl.bindVertexArray(objVAO);
              controladorcombobox.onChange(function () { //verifica se outro objeto foi escolhido
                        flag=1;
                        controladortranslatelinear.setValue(true);
                        controladorrotationpoint.setValue(false);
                  });
                if(config.lookat==true && config.lookatobjeto==lista[i+1].nome){
                    controladortranslatelinearcamera.setValue(true);
                    controladortranslatecameraX.setValue(lista[i+1].position[0]);
                    controladortranslatecameraY.setValue(lista[i+1].position[1]);
                    controladortranslatecameraZ.setValue(lista[i+1].position[2]);
                    controladorrotationcameraX.setValue(0);
                    controladorrotationcameraY.setValue(0);
                    controladorrotationcameraZ.setValue(0);
                }
                if(flag==1 && lista[i+1].nome == config.objeto){ //se sim, altera os controladores para os valores do objeto atualmente escolhido
                    controladortranslateX.setValue(lista[i+1].position[0]);
                    controladortranslateY.setValue(lista[i+1].position[1]);
                    controladortranslateZ.setValue(lista[i+1].position[2]);
                    controladorrotationX.setValue(lista[i+1].rotation[0]);
                    controladorrotationY.setValue(lista[i+1].rotation[1]);
                    controladorrotationZ.setValue(lista[i+1].rotation[2]);
                    controladorscale.setValue(lista[i+1].scale);
                }
              if(lista[i+1].nome == config.objeto && config.translationlinear==true){
                lista[i+1].position = [config.translateX,config.translateY,config.translateZ];
              }
              else if(lista[i+1].nome == config.objeto && config.translationbezier==true){
                  controladortranslateX.setValue(config.bezierstartX+pontocb[0]);
                  controladortranslateY.setValue(config.bezierstartY+pontocb[1]);
                  controladortranslateZ.setValue(config.bezierstartZ+pontocb[2]);
                  lista[i+1].position = [config.bezierstartX+pontocb[0], config.bezierstartY+pontocb[1], config.bezierstartZ+pontocb[2]];
              }
              if(lista[i+1].nome == config.objeto && config.rotacaoeixo==true){
                 lista[i+1].rotation = [config.rotateX,config.rotateY,config.rotateZ];
              }
              if(lista[i+1].nome == config.objeto){
                  lista[i+1].scale = config.scale;
              }
              lista[i+1].u_matrix = computeMatrix(
              viewProjectionMatrix,
              lista[i+1].position,
              lista[i+1].rotation[0],
              lista[i+1].rotation[1],
              lista[i+1].rotation[2],
              lista[i+1].scale,
              lista[i+1].nome,
              );

            // Set the uniforms we just computed
            twgl.setUniforms(meshProgramInfo, lista[i+1]);
            twgl.drawBufferInfo(gl, malhas[lista[i+1].indice]);
      }
      flag = 0;
      flagcamerapoint = 0;
      flagcamera = 0;
      twgl.drawBufferInfo(gl, buffervoid);
      requestAnimationFrame(render); 
       
  }
  requestAnimationFrame(render);
}

main();
