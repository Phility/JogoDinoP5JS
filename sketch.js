//IMD PPGTI/Disciplina de Desenvolvimento de Jogos Digitais
//Criado por:
//Philipy Augusto Silveira de Brito (philipyaugusto@hotmail.com)
//Walter Lopes Neto (walter.lopes@ifrn.edu.br)

//Para dificultar o jogo e as fases podem ser alterados o número de moedas e pontos, velocidade do Heroi e Ratos e também posição e direção do Herio e ratos

//Link do conjuto de treino
const URL = "https://teachablemachine.withgoogle.com/models/H2T_3GTxc/";

//Criação de variáveis
let modelpture,
  numClasses,
  poseData,
  context;
var heroi,
  heroiImg,
  cobraImg,
  formigaImg,
  morcegoImg,
  moeda1,
  moeda2,
  moeda3,
  moeda4,
  moeda5,
  moeda6,
  moedaImg,
  vida1,
  vidaImg,
  bg1,
  bg2,
  bg3,
  bgGameOver,
  bgCreditos,
  bgInstrucao,
  bgIntro,
  bgFase1,
  bgFase2,
  bgFase3,
  bgVitoria,
  musica,
  musicaMoeda,
  musicaInimigo,
  musicaLevelUp,
  musicaVida;
var videoWidth = 100;
var videoHeight = 100;
var posVideoWidth = 0;
var posVideoHeight = 0;
var bgWidth = 700;
var bgHeight = 400;
var normal = 0.0;
var bracoDireito = 0.0;
var bracoEsquerdo = 0.0;
var bracoDireitoEsquerdo = 0.0;
var maoEsquerda = 0.0;
var maoDireita = 0.0;
var totalVidas = 3;
var totalPontos = 0;
var faseAtual = 0;
var xT = 20;
var yT = 400;
var cobras = [];
var formigas = [];
var morcegos = [];
var musicaOn = true;
//Tela 0 = Menu Inicial | 1 = Jogo() | 2 = Instruções() | 3 = Créditos() | 4 = Texto Inicial() | 5 = Transição Fase 1 | 6 = Fase 1 | 7 = Transição Fase 2 | 8 = Fase 2 | 9 = Transição Fase 3 | 10 = Fase 3 | 11 = Fim de Jogo() | 12 = Venceu ()
var tela = 0;
//Modo de jogo 1 - Teclado | Modo de jogo 2 - Webcam
var modoJogo = 0;

function preload() {

  //Carregamento das imagens
  bg1 = loadImage('assets/floresta.jpg');
  bg2 = loadImage('assets/gelo.jpg');
  bg3 = loadImage('assets/deserto.jpg');
  bgGameOver = loadImage('assets/gameover.jpeg');
  bgCreditos = loadImage('assets/creditos.jpeg');
  bgInstrucao = loadImage('assets/instrucao.jpeg');
  bgIntro = loadImage('assets/intro.png');
  bgFase1 = loadImage('assets/fase1.png');
  bgFase2 = loadImage('assets/fase2.png');
  bgFase3 = loadImage('assets/fase3.png');
  bgVitoria = loadImage('assets/vitoria.png')
  
  //Carregando Sprits do Jogo
  heroiImg = loadImage('assets/Walk (1).png');
  cobraImg = loadImage('assets/cobra.png');
  formigaImg = loadImage('assets/formiga.png');
  morcegoImg = loadImage('assets/morcego.png');
  moedaImg = loadImage('assets/coin.png');
  vidaImg = loadImage('assets/vida.png');

  //Carregamento de sons
  musica = loadSound('sounds/padrao.mpeg');
  musicaMoeda = loadSound('sounds/moeda.wav');
  musicaInimigo = loadSound('sounds/bate_no_inimigo.wav');
  musicaLevelUp = loadSound('sounds/LevelUp.wav');
  musicaVida = loadSound('sounds/vida.wav');

}

async function init() {

  //Inicia o modelo de treianmento de imagem
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmPose.load(modelURL, metadataURL);

  //NumClasses = Número de conjuntos de treinamentos que foram feitos (qtd gestos)
  numClasses = model.getTotalClasses();

}

async function predict() {

  //Predicção 
  const {
    pose,
    posenetOutput
  } = await model.estimatePose(capture.elt);

  const prediction = await model.predict(posenetOutput);

  for (let i = 0; i < numClasses; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);

  }
  poseData = pose;

  //Salva os valores reconhecidos pela webcam
  //Fixa a quantidade de casas decimais em 2
  normal = prediction[0].probability.toFixed(2);
  bracoDireito = prediction[1].probability.toFixed(2);
  bracoEsquerdo = prediction[2].probability.toFixed(2);
  bracoDireitoEsquerdo = prediction[3].probability.toFixed(2);
  maoEsquerda = prediction[4].probability.toFixed(2);
  maoDireita = prediction[5].probability.toFixed(2);

}

function setup() {

  //Cria o canva
  const canvas = createCanvas(bgWidth, bgHeight);
  context = canvas.elt.getContext('2d');

  //Cria a captura de vídeo
  capture = createCapture(VIDEO);
  capture.size(videoWidth, videoHeight);
  capture.hide();

  //Inicio da análise das posições capturadas pela webcam
  init();

  //Criação de um novo Heroi
  heroi = new Heroi();

  //Criação das moedas utilizadas no jogo
  moeda1 = new Moeda();
  moeda2 = new Moeda();
  moeda3 = new Moeda();
  moeda4 = new Moeda();
  moeda5 = new Moeda();
  moeda6 = new Moeda();

  vida1 = new Vida();

  //Inicia música do jogo
  if (musicaOn == true) {
    musica.loop();
  }

}

function comandoTeclado() {
  //Recebe a tecla pressionada e determina o método a ser chamado
  if (keyIsDown(LEFT_ARROW)) {
    heroi.esquerda();
  }

  if (keyIsDown(RIGHT_ARROW)) {
    heroi.direita();
  }

  if (keyIsDown(UP_ARROW)) {
    heroi.pular();
  }
}

function comandoWebcam() {

  //Identifica qual "pose" está sendo capturada
  if (normal >= 0.90) {
    //Faz o heroi ficar parado
    console.log("Normal: " + normal);
  } else if (bracoDireito >= 0.90) {
    console.log("Braço Direito: " + bracoDireito);
    heroi.direita();
  } else if (bracoEsquerdo >= 0.90) {
    console.log("Braço Esquerdo: " + bracoEsquerdo);
    heroi.esquerda();
  } else if (bracoDireitoEsquerdo >= 0.90) {
    console.log("Dir Esq: " + bracoDireitoEsquerdo);
    heroi.pular();
  } else if (maoEsquerda >= 0.90) {
    console.log("Mao Esq: " + maoEsquerda);
    heroi.direita();
    heroi.pular();
  } else if (maoDireita >= 0.90) {
    console.log("Mao Dir: " + maoDireita);
    heroi.esquerda();
    heroi.pular();
  }

}

function menuInicial() {

  //Criação do botão de ativação/desativação do som
  background(bgIntro);
  if (musicaOn == true) {
    fill('#529020');
    rect(0, 0, 40, 15);
    textSize(10);
    fill(55);
    text('SOM', 7, 11);

  } else {
    fill(255, 0, 0);
    rect(0, 0, 40, 15);
    textSize(8);
    fill(55);
    text('SEM SOM', 1, 11);
  }

  //Criação do menu inicial do jogo
  fill('#529020');
  rect(155, 35, 385, 75);
  fill('#BB7123');
  rect(155, 150, 385, 75);
  fill('#6359AF');
  rect(155, 265, 385, 75);
  textSize(50)
  fill(255);
  textAlign(CENTER);
  text('START', bgWidth / 2, 90);
  text('INSTRUÇÕES', bgWidth / 2, 206);
  text('CRÉDITOS', bgWidth / 2, 325);

}

function moveText(colorText, size, message, speed) {

  //Aparecer texto pré jogo
  fill(colorText);
  textSize(size);
  text(message, xT, yT + size);
  if (yT >= size) {
    yT -= speed;
  }

  textSize(11);
  fill(255, 0, 0);
  textStyle(BOLD);
  textAlign(CENTER);
  text("PARA INICIAR PRESSIONE:", bgWidth / 2, 375);
  text("1 - JOGAR COM TECLAS | 2 - JOGAR COM WEBCAM (GESTOS)", bgWidth / 2, 390);

}

function textoInicial() {

  //Definição do texto incial pré jogo
  background(0);
  texto = "Era uma vez uma criança comum, que tinha um brinquedo comum que\nela amava. Maria não largava seu Dinossauro da sorte, que ela chamava\ncarinhosamente de Dino. Um dia a Maria vinha andando para casa como\ncostumava fazer todos os dias . Maria foi surpreendida por malfeitores\nque a raptaram. Durante a confusão, Dino caiu e com a grande\npreocupação em salvar a sua amada dona, o dinossauro descobriu que\nconsegue se movimentar e ganhou vida. Tentando encontrar o caminho\nde volta para casa, Dino encontra um Dinossauro sábio. O sábio\nconvence o Dino que ele não pode deixar os medos e incertezas o\nimpedirem de salvar sua amiga. Dino então, consegue sentir o caminho\npara encontrar Maria e começa sua jornada, ingressando num portal\nque a leva para um outro mundo, onde sabe que a Maria está sendo\nmantida prisioneira. Então a aventura começa...";
  moveText('white', 20, texto, 0.3);

  //Derminação do modo de jogo (Setas 1 ou Gestos 2)
  if (keyIsDown(49)) {
    modoJogo = 1;
    tela = 5;
  } else if (keyIsDown(50)) {
    modoJogo = 2;
    tela = 5;
  }

}

function instrucoes() {

  //Criação da tela de instruções
  background(bgInstrucao);

  //Botão de Voltar
  fill('#529020');
  rect(650, 0, 50, 20);
  textSize(10)
  fill(255);
  text('VOLTAR', 655, 13);

}

function creditos() {

  //Criação da tela de créditos
  background(bgCreditos);

  //Botão de Voltar
  fill('#529020');
  rect(650, 0, 50, 20);
  textSize(10);
  fill(255);
  text('VOLTAR', 655, 13);

}

function transicaoFase1() {
  //Tela de transição de fase
  background(bgFase1);
  fill(0);
  rect(190, 323, 305, 40);
  textSize(15);
  fill(255);
  textStyle(BOLD);
  text('PRESSIONE ENTER PARA CONTINUAR', 200, 350);

  //Identifica a tecla enter
  if(keyCode === ENTER) {
    //Zerando a ultima tecla pressionada
    keyCode = null;
    //Chama a tela de jogo();
    faseAtual = 1;
    tela = 1;
  }

}

function fase1() {

  keyCode = null;
  
  //Determina BG
  background(bg1);

  //Chama a função jogo para que as configurações gerais estejam aplicadas a esta fase
  jogo();

  //Exibir e movimentar os itens da fase 1
  moeda1.mostrar();
  heroi.mostrar();
  heroi.movimento();

  //Cria uma quantidade de inimigos aleatórias a partir de números aleatórios
  //Adiciona os inimigos em um vetor ratos[]
  if (random(1) < 0.005) {
    formigas.push(new Formiga());
  }

  //Pecorre todo o vetor de inimigos
  for (let f of formigas) {
    //Chama os métodos de movimentos e exibição para cada inimigo (rato) gerado anteriormente
    f.movimento(5);
    f.mostrar();
    //Identifica se o heroi colidiu com o inimigo
    if (heroi.colisao(f)) {
      //Executa a música de quando colide com inimigo
      if (musicaOn == true) {
        musicaInimigo.setVolume(1);
        musicaInimigo.play();
      }
      //Retira uma vida do total
      //Trás o heroi para a posição inicial
      //Remove os ratos antigos da tela
      totalVidas -= 1;
      heroi.setX(10);
      heroi.setY(100);
      for (let f of formigas) {
        f.destruir();
      }
    }
  }

  //Identifica se o heroi colidiu com uma moeda
  if (heroi.colisao(moeda1)) {
    //Executa a música de quando colide com a moeda
    if (musicaOn == true) {
      musicaMoeda.play();

    }
    //Remove a moeda
    //Acrescenta 10 pontos no total
    moeda1.destruir();
    totalPontos += 10;
  }

  //Identifica se a pontuação para passar de fase foi atingida
  if (totalPontos >= 10) {
    //Ganha uma nova vida
    totalVidas += 1;
    //Executa a música de Level Up
    if (musicaOn == true) {
      musica.setVolume(0)
      musicaLevelUp.play();
    }
    //Remove os inimigos (ratos) da tela
    for (let f of formigas) {
      f.destruir();
    }
    //Muda a fase atual
    //Chama a tela de transição da fase 2
    faseAtual = 2;
    tela = 7;
  }

}

function transicaoFase2() {
  //Tela de transição de fase
  background(bgFase2);
  fill(0);
  rect(190, 323, 305, 40);
  textSize(15);
  fill(255);
  textStyle(BOLD);
  text('PRESSIONE ENTER PARA CONTINUAR', 200, 350);

  //Identifica a tecla enter
  if(keyCode === ENTER) {
    //Zerando a ultima tecla pressionada
    keyCode = null;
    //Trás o heroi para a posição inicial
    //Determina a posição das novas moedas
    heroi.setX(10);
    heroi.setY(100);
    moeda3.setX(250);
    moeda3.setY(200);
    vida1.setX(-27);
    vida1.setY(325);
    //Chama a tela da fase 2
    tela = 8;
  }

}

function fase2() {
  
  keyCode = null;

  //Executa a música do jogo
  if (musicaOn == true) {
    musica.setVolume(1);
  }

  //Determina BG
  background(bg2);

  jogo();

  //Exibir e movimentar os itens da fase 2
  vida1.mostrar();
  moeda2.mostrar();
  moeda3.mostrar();
  heroi.mostrar();
  heroi.movimento();

  if (random(1) < 0.007) {
    cobras.push(new Cobra());
  }

  for (let c of cobras) {
    c.movimento(5);
    c.mostrar();
    if (heroi.colisao(c)) {
      if (musicaOn == true) {
        musicaInimigo.setVolume(1);
        musicaInimigo.play();
      }
      totalVidas -= 1;
      heroi.setX(10);
      heroi.setY(100);
      for (let c of cobras) {
        c.destruir();
      }
    }
  }

  if (heroi.colisao(vida1)) {
    if (musicaOn == true) {
      musicaVida.play();
    }
    //Ganha uma nova vida
    totalVidas += 1;
    vida1.destruir();
  }

  if (heroi.colisao(moeda2)) {
    if (musicaOn == true) {
      musicaMoeda.play();

    }
    moeda2.destruir();
    totalPontos += 10;
  }

  if (heroi.colisao(moeda3)) {
    if (musicaOn == true) {
      musicaMoeda.play();

    }
    moeda3.destruir();
    totalPontos += 10;
  }

  if (totalPontos >= 30) {
    //Ganha uma nova vida
    totalVidas += 1;
    if (musicaOn == true) {
      musica.setVolume(0)
      musicaLevelUp.play();
    }
    //Remove os itens da tela
    for (let c of cobras) {
      c.destruir();
    }
    faseAtual = 3;
    tela = 9;
  }

}

function transicaoFase3() {
  background(bgFase3);
  fill(0);
  rect(190, 323, 305, 40);
  textSize(15);
  fill(255);
  textStyle(BOLD);
  text('PRESSIONE ENTER PARA CONTINUAR', 200, 350);

  if(keyCode === ENTER) {
    //Zerando a ultima tecla pressionada
    keyCode = null;
    heroi.setX(10);
    heroi.setY(100);
    moeda5.setX(250);
    moeda5.setY(200);
    moeda6.setX(150);
    moeda6.setY(300);
    tela = 10;
  }

}

function fase3() {
  //Zerando a ultima tecla pressionada
  keyCode = null;

  if (musicaOn == true) {
    musica.setVolume(1);
  }
  //Determina BG
  background(bg3);

  jogo();

  moeda4.mostrar();
  moeda5.mostrar();
  moeda6.mostrar();
  heroi.mostrar();
  heroi.movimento();

  if (random(1) < 0.01) {
    morcegos.push(new Morcego());
  }

  for (let m of morcegos) {
    m.movimento(5);
    m.mostrar();
    if (heroi.colisao(m)) {
      if (musicaOn == true) {
        musicaInimigo.setVolume(1);
        musicaInimigo.play();
      }
      totalVidas -= 1;
      heroi.setX(10);
      heroi.setY(100);
      for (let m of morcegos) {
        m.destruir();
      }
    }
  }

  if (heroi.colisao(moeda4)) {
    if (musicaOn == true) {
      musicaMoeda.play();

    }
    moeda4.destruir();
    totalPontos += 10;
  }

  if (heroi.colisao(moeda5)) {
    if (musicaOn == true) {
      musicaMoeda.play();

    }
    moeda5.destruir();
    totalPontos += 10;
  }

  if (heroi.colisao(moeda6)) {
    if (musicaOn == true) {
      musicaMoeda.play();

    }
    moeda6.destruir();
    totalPontos += 10;
  }

  if (totalPontos >= 60) {
    //Ganha uma nova vida
    totalVidas += 1;
    if (musicaOn == true) {
      musica.setVolume(0)
      musicaLevelUp.play();
    }
    //Remove os itens da tela

    for (let m of morcegos) {
      m.destruir();
    }
    faseAtual = 3;
    tela = 12;
  }

}

function fimJogo() {

  //Determinar o Bg
  background(bgGameOver);

  //Remove todos os itens criados da tela
  heroi.destruir();
  for (let f of formigas) {
    f.destruir();
  }
  for (let c of cobras) {
    c.destruir();
  }
  for (let m of morcegos) {
    m.destruir();
  }
  moeda1.destruir();
  moeda2.destruir();
  moeda3.destruir();
  moeda4.destruir();
  moeda5.destruir();
  moeda6.destruir();

  //Para a música padrão
  if (musicaOn == true) {
    musica.setVolume(0)
  }

  //Botão de Voltar
  fill('#529020');
  rect(650, 0, 50, 20);
  textSize(10);
  fill(255);
  text('SAIR', 665, 13);

  //Para o Loop do jogo
  noLoop();

}

function venceu() {

  //Determina o BG
  background(bgVitoria);

  //Remove todos os itens criados da tela
  heroi.destruir();
  for (let f of formigas) {
    f.destruir();
  }
  for (let c of cobras) {
    c.destruir();
  }
  for (let m of morcegos) {
    m.destruir();
  }
  moeda1.destruir();
  moeda2.destruir();
  moeda3.destruir();
  moeda4.destruir();
  moeda5.destruir();
  moeda6.destruir();

  //Para a música padrão
  if (musicaOn == true) {
    musica.setVolume(0)
  }

  //Botão de Voltar
  fill('#529020');
  rect(650, 0, 50, 20);
  textSize(10);
  fill(255);
  text('SAIR', 665, 13);

  //Para o Loop do jogo
  noLoop();

}

function jogo() {

  //Função com itens gerais a todas as fases

  //Chama a primeira fase do jogo
  if (faseAtual === 1) {
    tela = 6;
  }

  if (modoJogo === 1) {
    //Modo de Jogo Teclado
    //Chama função de movimento de teclado
    comandoTeclado();

  }

  if (modoJogo === 2) {

    //Modo de Jogo Webcam
    comandoWebcam();

    imageMode(CORNER)
    push()
    translate(videoWidth, 0);
    scale(-1, 1);

    //Cria a captura de vídeo
    image(capture, posVideoWidth, posVideoHeight, videoWidth, videoHeight)


    if (poseData) {
      const minPartConfidence = 0.5;
      tmPose.drawKeypoints(poseData.keypoints, minPartConfidence, context);
      tmPose.drawSkeleton(poseData.keypoints, minPartConfidence, context);
    }

    pop()

    imageMode(CENTER);

    predict();

  }

  //Chama o fim do jogo caso o numero de vidas seja igual a 0
  if (totalVidas <= 0) {
    tela = 11;
  }

  //Informações do Menu Lateral Direito
  stroke(40);
  strokeWeight(4);
  fill(255);
  textSize(15);
  text("Vidas: " + totalVidas, 150, 50);
  text("Pontos: " + totalPontos, 250, 50);
  text("Fase: " + faseAtual, 350, 50);


  //Botão de Sair
  stroke(0);
  strokeWeight(0)
  fill('#529020');
  rect(650, 0, 50, 20);
  textSize(10);
  fill(255);
  text('SAIR', 665, 13);

}

function draw() {

  //Identifica qual menu opção do menu foi escolhida
  switch (tela) {
    case 0:
      menuInicial();
      break;

    case 1:
      jogo();
      break;

    case 2:
      instrucoes();
      break;

    case 3:
      creditos();
      break;

    case 4:
      textoInicial();
      break;

    case 5:
      transicaoFase1();
      break;

    case 6:
      fase1();
      break;

    case 7:
      transicaoFase2();
      break;

    case 8:
      fase2();
      break;

    case 9:
      transicaoFase3();
      break;

    case 10:
      fase3();
      break;

    case 11:
      fimJogo();
      break;
    
    case 12:
      venceu();
      break;
  }

}

function mouseClicked() {
  //Identifica clique do mouse no tela inicial
  if (tela == 0) {
    if (mouseX < 540 && mouseX > 155) {
      if (mouseY < 110 && mouseY > 35) {
        tela = 4;
      }
      if (mouseY < 225 && mouseY > 150) {
        tela = 2;
      }
      if (mouseY < 340 && mouseY > 265) {
        tela = 3;
      }
    }
  }

  //Habilitar e desabilitar som
  if (tela == 0) {
    if (mouseX < 40 && mouseX > 0) {
      if (mouseY < 15 && mouseY > 0) {
        if (musicaOn == true) {
          musica.pause();
          musicaOn = false;
        } else {
          musica.play();
          musicaOn = true;
        }
      }
    }
  }

  //Identifica se foi clicado em "SAIR" na tela do JOGO em Execução, Fim de Jogo e Venceu
  if (tela == 6 || tela == 8 || tela == 10 || tela == 11 || tela == 12) {
    if (mouseX < 700 && mouseX > 650) {
      if (mouseY < 20 && mouseY > 0) {
        document.location.reload(true);
      }
    }
  }

  //Identifica se foi clicado em "Voltar" Intruções e Crédito
  if (tela == 2 || tela == 3) {
    if (mouseX < 700 && mouseX > 650) {
      if (mouseY < 20 && mouseY > 0) {
        tela = 0;
      }
    }
  }

}