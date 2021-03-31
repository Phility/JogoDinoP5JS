class Cobra {
  constructor() {
    this.r = 75;
    this.x = width;
    this.y = height - this.r;
  }

  movimento(v) {
    this.x -= v;
  }


  mostrar() {
    image(cobraImg, this.x, this.y, this.r, this.r);
  }
  
  destruir(){
    this.x = 1000;
    this.y = 1000;
  }
}