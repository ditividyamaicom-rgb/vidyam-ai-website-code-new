import React from 'react';
import "./Carousel.css"

const Carousel = () => {
  return (
    <div>
       <section class="slider_section ">
      <div class="carousel_btn-container">
        <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
          <span class="sr-only">Next</span>
        </a>
      </div>
      <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
          <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active">01</li>
          <li data-target="#carouselExampleIndicators" data-slide-to="1">02</li>
          <li data-target="#carouselExampleIndicators" data-slide-to="2">03</li>
        </ol>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-5 offset-md-1">
                  <div class="detail-box">
                    <h1>
                      Key highlights of the 
                      <br/>
                      DimensionZero Academy's  <br/>
                      program
                    </h1>
                    <p>
                      Our program is designed to help you become an expert in Data Sceintist and ace product interviews to scale up in your tech career.

                    </p>
                    <div class="btn-box">
                      <a href="" class="btn-1">
                        About Us
                      </a>
                      <a href="" class="btn-2">
                        Get A Quote
                      </a>
                    </div>
                  </div>
                </div>
                <div class="offset-md-1 col-md-4 img-container">
                  <div class="img-box">
                    <img src="images/macos-big-sur-apple-layers-fluidic-colorful-wwdc-stock-4096x2304-1455.jpg" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="carousel-item ">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-5 offset-md-1">
                  <div class="detail-box">
                    <h1>
                      Key highlights of the  <br/>
                      DimensionZero Academy's  <br/>
                      program
                    </h1>
                    <p>
                      It is a long established fact that a reader will be distracted by
                      the readable content of a page
                    </p>
                    <div class="btn-box">
                      <a href="" class="btn-1">
                        About Us
                      </a>
                      <a href="" class="btn-2">
                        Get A Quote
                      </a>
                    </div>
                  </div>
                </div>
                <div class="offset-md-1 col-md-4 img-container">
                  <div class="img-box">
                    <img src="images/macos-big-sur-apple-layers-fluidic-colorful-wwdc-stock-4096x2304-1455.jpg" alt=""/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="carousel-item ">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-5 offset-md-1">
                  <div class="detail-box">
                    <h1>
                      Key highlights of the <br/>
                       DimensionZero Academy's   <br/>
                      program
                    </h1>
                    <p>
                      It is a long established fact that a reader will be distracted by
                      the readable content of a page
                    </p>
                    <div class="btn-box">
                      <a href="" class="btn-1">
                        About Us
                      </a>
                      <a href="" class="btn-2">
                        Get A Quote
                      </a>
                    </div>
                  </div>
                </div>
                <div class="offset-md-1 col-md-4 img-container">
                  <div class="img-box">
                    <img src="images/macos-big-sur-apple-layers-fluidic-colorful-wwdc-stock-4096x2304-1455.jpg" alt=""/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    
    </section>
    </div>
  );
};

export default Carousel;
