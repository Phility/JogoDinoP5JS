class Morcego {
  constructor() {
    this.r = 50;
    this.x = width;
    this.y = 280;
  }

  movimento(v) {
    this.x -= v;
  }


  mostrar() {
    image(morcegoImg, this.x, this.y, this.r, this.r);
  }
  
  destruir(){
    this.x = 1000;
    this.y = 1000;
  }
}