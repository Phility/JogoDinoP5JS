class Heroi {
  constructor() {
    this.r = 80;
    this.x = 10;
    this.y = 100;
    this.vy = 0;
    this.gravity = 3;
  }
 
  setX(x){
    this.x = x;
  }
  
  setY(y){
    this.y = y;
  }

  pular() {
    if (this.y == height - this.r) {
      this.vy = -35;
    }
  }

  colisao(inimigo) {
    let x1 = this.x + this.r * 0.5;
    let y1 = this.y + this.r * 0.5;
    let x2 = inimigo.x + inimigo.r * 0.5;
    let y2 = inimigo.y + inimigo.r * 0.5;
    return collideCircleCircle(x1, y1, this.r, x2, y2, inimigo.r);
  }

  movimento() {
    this.y += this.vy;
    this.vy += this.gravity;
    this.y = constrain(this.y, 0, height - this.r);
  }
  
  direita(){
    this.x += 5;
  }
  
  esquerda(){
    this.x -= 5;
  }

  mostrar() {
    image(heroiImg, this.x, this.y, this.r, this.r);
  }
  
  destruir(){
    this.x = 1000;
    this.y = 1000;
  }
}