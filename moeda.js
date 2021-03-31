class Moeda {
  constructor() {
    this.r = 30;
    this.x = 500;
    this.y = 325;
  }
  
  setX(x){
    this.x = x;
  }
  
  setY(y){
    this.y = y;
  }

  mostrar() {
    image(moedaImg, this.x, this.y, this.r, this.r);

  }
  
    destruir(){
    this.x = 1000;
    this.y = 1000;
  }
}